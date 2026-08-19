use std::sync::mpsc::channel;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use tauri::{AppHandle, Emitter};

use crate::blocker::UpdateBlocker;
use crate::spicetify::SpicetifyManager;
use crate::types::SentinelLog;

pub struct SentinelWatcher;

impl SentinelWatcher {
    pub fn trim_memory() {
        unsafe {
            use windows::Win32::System::Threading::{GetCurrentProcess, SetProcessWorkingSetSize};
            let _ = SetProcessWorkingSetSize(GetCurrentProcess(), usize::MAX, usize::MAX);
        }
    }

    pub fn start_background_watcher(
        app_handle: AppHandle,
        logs: Arc<Mutex<Vec<SentinelLog>>>,
    ) {
        thread::spawn(move || {
            let (tx, rx) = channel();

            let mut watcher: Option<RecommendedWatcher> = match RecommendedWatcher::new(tx, Config::default()) {
                Ok(w) => Some(w),
                Err(e) => {
                    Self::add_log(&logs, &app_handle, "warn", &format!("Watcher en reposo: {}", e));
                    None
                }
            };

            if let Some(roaming) = dirs::config_dir() {
                let spotify_dir = roaming.join("Spotify");
                if spotify_dir.exists() {
                    if let Some(ref mut w) = watcher {
                        let _ = w.watch(&spotify_dir, RecursiveMode::NonRecursive);
                    }
                }
            }

            Self::add_log(
                &logs,
                &app_handle,
                "info",
                "Centinela activo. Monitoreo por eventos de kernel en reposo (0% CPU).",
            );

            // Trim initial memory
            Self::trim_memory();

            let mut last_heal = Instant::now() - Duration::from_secs(60);

            // PURE EVENT-DRIVEN LOOP: Waits indefinitely on OS notifications without polling
            while let Ok(event_res) = rx.recv() {
                if let Ok(event) = event_res {
                    // Check if event relates to Spotify.exe or patched files
                    let is_relevant = event.paths.iter().any(|p| {
                        let name = p.file_name().and_then(|n| n.to_str()).unwrap_or("").to_lowercase();
                        name == "spotify.exe" || name == "chrome_elf.dll" || name == "xpui.spa"
                    });

                    if is_relevant && last_heal.elapsed() > Duration::from_secs(10) {
                        // Debounce: wait 3 seconds for file writes to finish
                        thread::sleep(Duration::from_secs(3));

                        Self::add_log(
                            &logs,
                            &app_handle,
                            "warn",
                            "Cambio detectado en archivos de Spotify. Re-aplicando Spicetify...",
                        );

                        // Ensure updates remain blocked
                        let _ = UpdateBlocker::block();

                        // Apply patch silently
                        match SpicetifyManager::run_spicetify_command(&["apply", "-n"]) {
                            Ok(msg) => {
                                Self::add_log(&logs, &app_handle, "success", &format!("Spicetify re-aplicado con éxito: {}", msg));
                                let _ = app_handle.emit("sentinel-healed", ());
                            }
                            Err(_) => {
                                // Fallback: restore backup apply
                                let _ = SpicetifyManager::run_spicetify_command(&["restore", "backup", "apply", "-n"]);
                                let _ = app_handle.emit("sentinel-healed", ());
                            }
                        }

                        last_heal = Instant::now();
                        Self::trim_memory();
                    }
                }
            }
        });
    }

    fn add_log(
        logs: &Arc<Mutex<Vec<SentinelLog>>>,
        app_handle: &AppHandle,
        level: &str,
        message: &str,
    ) {
        let log = SentinelLog::new(level, message);

        if let Ok(mut lock) = logs.lock() {
            lock.insert(0, log.clone());
            if lock.len() > 50 {
                lock.pop();
            }
        }

        let _ = app_handle.emit("sentinel-log", log);
    }
}
