use std::env;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;
const REG_KEY: &str = r"HKCU\Software\Microsoft\Windows\CurrentVersion\Run";
const APP_NAME: &str = "SpicetifySentinel";

pub struct AutoStartManager;

impl AutoStartManager {
    fn get_disabled_flag_path() -> PathBuf {
        let appdata = env::var("APPDATA").unwrap_or_else(|_| r"C:\".to_string());
        let dir = PathBuf::from(appdata).join("SpicetifySentinel");
        let _ = fs::create_dir_all(&dir);
        dir.join("autostart_disabled.flag")
    }

    pub fn is_user_disabled() -> bool {
        Self::get_disabled_flag_path().exists()
    }

    pub fn is_enabled() -> bool {
        let output = Command::new("reg")
            .args(["query", REG_KEY, "/v", APP_NAME])
            .creation_flags(CREATE_NO_WINDOW)
            .output();

        match output {
            Ok(out) => out.status.success(),
            Err(_) => false,
        }
    }

    pub fn set_enabled(enable: bool) -> Result<(), String> {
        let flag_path = Self::get_disabled_flag_path();

        if enable {
            // User enabled it: delete disabled flag
            if flag_path.exists() {
                let _ = fs::remove_file(&flag_path);
            }

            let current_exe = env::current_exe()
                .map_err(|e| format!("No se pudo determinar ruta del ejecutable: {}", e))?;
            
            let cmd_val = format!("\"{}\" --hide", current_exe.to_string_lossy());

            let output = Command::new("reg")
                .args(["add", REG_KEY, "/v", APP_NAME, "/t", "REG_SZ", "/d", &cmd_val, "/f"])
                .creation_flags(CREATE_NO_WINDOW)
                .output()
                .map_err(|e| format!("Error modificando registro de inicio: {}", e))?;

            if !output.status.success() {
                return Err(format!("Error reg add: {}", String::from_utf8_lossy(&output.stderr)));
            }
        } else {
            // User physically turned it OFF: save disabled flag to strictly respect user choice
            let _ = fs::write(&flag_path, "disabled");

            let output = Command::new("reg")
                .args(["delete", REG_KEY, "/v", APP_NAME, "/f"])
                .creation_flags(CREATE_NO_WINDOW)
                .output()
                .map_err(|e| format!("Error eliminando del registro: {}", e))?;

            if !output.status.success() {
                // If it doesn't exist, ignore
            }
        }

        Ok(())
    }

    pub fn sync_on_startup() {
        if Self::is_user_disabled() {
            // User explicitly turned it OFF: ensure registry has no entry
            let _ = Command::new("reg")
                .args(["delete", REG_KEY, "/v", APP_NAME, "/f"])
                .creation_flags(CREATE_NO_WINDOW)
                .output();
        } else {
            // Default ON: ensure registry is active and points to current exe path with --hide
            let _ = Self::set_enabled(true);
        }
    }
}
