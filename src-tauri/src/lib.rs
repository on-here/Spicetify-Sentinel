use std::process::Command;
use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, State,
};
use tauri_plugin_notification::NotificationExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

mod autostart;
mod blocker;
mod recovery;
mod spicetify;
mod types;
mod watcher;

use autostart::AutoStartManager;
use blocker::UpdateBlocker;
use recovery::RecoveryManager;
use spicetify::SpicetifyManager;
use types::{CommandResult, SentinelLog, SystemStatus};
use watcher::SentinelWatcher;

struct AppState {
    logs: Arc<Mutex<Vec<SentinelLog>>>,
}

#[tauri::command]
fn get_system_status() -> Result<SystemStatus, String> {
    let spotify_installed = SpicetifyManager::is_spotify_installed();
    let spotify_running = SpicetifyManager::is_spotify_running();
    let spicetify_installed = SpicetifyManager::is_spicetify_installed();
    let spicetify_version = SpicetifyManager::get_spicetify_version();
    let is_patched = SpicetifyManager::is_patched();
    let updates_blocked = UpdateBlocker::is_blocked();
    let adblock_installed = SpicetifyManager::is_adblock_active();
    let marketplace_installed = SpicetifyManager::is_marketplace_active();
    let autostart_enabled = AutoStartManager::is_enabled();
    let (cache_size_bytes, cache_size_formatted) = SpicetifyManager::get_cache_size();

    Ok(SystemStatus {
        spotify_installed,
        spotify_version: if spotify_installed { Some("Detectado (Desktop)".to_string()) } else { None },
        spotify_running,
        spicetify_installed,
        spicetify_version,
        is_patched,
        updates_blocked,
        adblock_installed,
        marketplace_installed,
        autostart_enabled,
        watcher_active: true,
        cache_size_formatted,
        cache_size_bytes,
    })
}

#[tauri::command]
fn toggle_update_blocker(enable: bool, state: State<'_, AppState>) -> Result<CommandResult, String> {
    let res = if enable {
        UpdateBlocker::block()
    } else {
        UpdateBlocker::unblock()
    };

    let (success, message, level) = match res {
        Ok(msg) => (true, msg, "success"),
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn run_auto_heal(state: State<'_, AppState>, app: AppHandle) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Iniciando ciclo de auto-sanación manual...");

    let res = SpicetifyManager::auto_heal();
    let (success, message, level) = match res {
        Ok(msg) => {
            let _ = app.notification()
                .builder()
                .title("Spicetify Sentinel")
                .body("Spotify ha sido re-parcheado con éxito.")
                .show();
            (true, msg, "success")
        }
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn force_spicetify_apply(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Ejecutando spicetify backup apply...");

    let _ = SpicetifyManager::ensure_adblock_installed();

    let res = SpicetifyManager::run_spicetify_command(&["backup", "apply", "-n"]);
    let (success, message, level) = match res {
        Ok(msg) => (true, format!("Spicetify aplicado con éxito: {}", msg), "success"),
        Err(e) => (false, format!("Error aplicando Spicetify: {}", e), "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn install_spicetify_cli(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Descargando e instalando Spicetify CLI...");

    let res = SpicetifyManager::install_spicetify_cli();
    let (success, message, level) = match res {
        Ok(msg) => {
            let _ = SpicetifyManager::ensure_adblock_installed();
            (true, msg, "success")
        }
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn ensure_adblock(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Configurando extensión obligatoria de Adblock...");

    let res = SpicetifyManager::ensure_adblock_installed();
    let (success, message, level) = match res {
        Ok(msg) => {
            let _ = SpicetifyManager::run_spicetify_command(&["apply", "-n"]);
            (true, msg, "success")
        }
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn ensure_marketplace(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Instalando Spicetify Marketplace...");

    let res = SpicetifyManager::ensure_marketplace_installed();
    let (success, message, level) = match res {
        Ok(msg) => {
            let _ = SpicetifyManager::run_spicetify_command(&["apply", "-n"]);
            (true, msg, "success")
        }
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn clean_cache(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "info", "Limpiando archivos de caché de Spotify...");

    let res = SpicetifyManager::clean_cache();
    let (success, message, level) = match res {
        Ok(msg) => (true, msg, "success"),
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn launch_spotify(state: State<'_, AppState>) -> Result<CommandResult, String> {
    if let Some(exe) = SpicetifyManager::get_spotify_exe() {
        if exe.exists() {
            let res = Command::new(&exe).creation_flags(CREATE_NO_WINDOW).spawn();
            return match res {
                Ok(_) => {
                    add_internal_log(&state.logs, "info", "Spotify iniciado.");
                    Ok(CommandResult {
                        success: true,
                        message: "Spotify lanzado con éxito.".to_string(),
                        logs: get_logs_internal(&state.logs),
                    })
                }
                Err(e) => {
                    let err = format!("Error al iniciar Spotify: {}", e);
                    add_internal_log(&state.logs, "error", &err);
                    Ok(CommandResult {
                        success: false,
                        message: err,
                        logs: get_logs_internal(&state.logs),
                    })
                }
            };
        }
    }
    Err("No se encontró el ejecutable de Spotify.".to_string())
}

#[tauri::command]
fn nuclear_reinstall(state: State<'_, AppState>) -> Result<CommandResult, String> {
    add_internal_log(&state.logs, "warn", "Iniciando recuperación nuclear: reinstalación limpia conservando preferencias...");

    let res = RecoveryManager::execute_nuclear_recovery();
    let (success, message, level) = match res {
        Ok(msg) => (true, msg, "success"),
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn set_autostart(enable: bool, state: State<'_, AppState>) -> Result<CommandResult, String> {
    let res = AutoStartManager::set_enabled(enable);
    let (success, message, level) = match res {
        Ok(_) => {
            let msg = if enable {
                "Inicio automático con Windows activado.".to_string()
            } else {
                "Inicio automático con Windows desactivado.".to_string()
            };
            (true, msg, "info")
        }
        Err(e) => (false, e, "error"),
    };

    add_internal_log(&state.logs, level, &message);

    Ok(CommandResult {
        success,
        message,
        logs: get_logs_internal(&state.logs),
    })
}

#[tauri::command]
fn get_logs(state: State<'_, AppState>) -> Result<Vec<SentinelLog>, String> {
    Ok(get_logs_internal(&state.logs))
}

fn add_internal_log(logs: &Arc<Mutex<Vec<SentinelLog>>>, level: &str, message: &str) {
    let log = SentinelLog::new(level, message);

    if let Ok(mut lock) = logs.lock() {
        lock.insert(0, log);
        if lock.len() > 100 {
            lock.pop();
        }
    }
}

#[tauri::command]
fn window_minimize(window: tauri::Window) {
    let _ = window.minimize();
}

#[tauri::command]
fn window_hide(window: tauri::Window) {
    let _ = window.hide();
    SentinelWatcher::trim_memory();
}

#[tauri::command]
fn window_start_drag(window: tauri::Window) {
    let _ = window.start_dragging();
}

fn get_logs_internal(logs: &Arc<Mutex<Vec<SentinelLog>>>) -> Vec<SentinelLog> {
    if let Ok(lock) = logs.lock() {
        lock.clone()
    } else {
        Vec::new()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let logs_arc = Arc::new(Mutex::new(Vec::new()));
    let logs_clone = Arc::clone(&logs_arc);

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .manage(AppState { logs: logs_arc })
        .setup(move |app| {
            let handle = app.handle().clone();

            // Set up Systray Menu
            let quit_i = MenuItem::with_id(app, "quit", "Salir de Spicetify Sentinel", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Abrir Panel de Control", true, None::<&str>)?;
            let heal_i = MenuItem::with_id(app, "heal", "⚡ Auto-Reparar & Re-aplicar", true, None::<&str>)?;
            let block_i = MenuItem::with_id(app, "toggle_block", "🛡️ Alternar Bloqueo de Updates", true, None::<&str>)?;
            let spotify_i = MenuItem::with_id(app, "spotify", "🎵 Abrir Spotify", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show_i, &heal_i, &block_i, &spotify_i, &quit_i])?;

            let default_icon = app.default_window_icon().cloned();
            let mut builder = TrayIconBuilder::with_id("sentinel-tray")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .tooltip("Spicetify Sentinel - Auto-Repair & Update Blocker");

            if let Some(icon) = default_icon {
                builder = builder.icon(icon);
            }

            let _tray = builder
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "heal" => {
                        let _ = SpicetifyManager::auto_heal();
                    }
                    "toggle_block" => {
                        if UpdateBlocker::is_blocked() {
                            let _ = UpdateBlocker::unblock();
                        } else {
                            let _ = UpdateBlocker::block();
                        }
                    }
                    "spotify" => {
                        if let Some(exe) = SpicetifyManager::get_spotify_exe() {
                            let _ = Command::new(exe).creation_flags(CREATE_NO_WINDOW).spawn();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Start FileSystem Watcher in background
            SentinelWatcher::start_background_watcher(handle, logs_clone);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
                SentinelWatcher::trim_memory();
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_system_status,
            toggle_update_blocker,
            run_auto_heal,
            force_spicetify_apply,
            install_spicetify_cli,
            ensure_adblock,
            ensure_marketplace,
            clean_cache,
            launch_spotify,
            nuclear_reinstall,
            set_autostart,
            get_logs,
            window_minimize,
            window_hide,
            window_start_drag,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
