use std::env;
use std::process::Command;
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;
const REG_KEY: &str = r"HKCU\Software\Microsoft\Windows\CurrentVersion\Run";
const APP_NAME: &str = "SpicetifySentinel";

pub struct AutoStartManager;

impl AutoStartManager {
    pub fn is_enabled() -> bool {
        let output = Command::new("reg")
            .args(["query", REG_KEY, "/v", APP_NAME])
            .creation_flags(CREATE_NO_WINDOW)
            .output();

        if let Ok(out) = output {
            out.status.success()
        } else {
            false
        }
    }

    pub fn set_enabled(enable: bool) -> Result<(), String> {
        if enable {
            let current_exe = env::current_exe()
                .map_err(|e| format!("No se pudo determinar ruta del ejecutable: {}", e))?;
            
            let cmd_val = format!("\"{}\" --minimized", current_exe.to_string_lossy());

            let output = Command::new("reg")
                .args(["add", REG_KEY, "/v", APP_NAME, "/t", "REG_SZ", "/d", &cmd_val, "/f"])
                .creation_flags(CREATE_NO_WINDOW)
                .output()
                .map_err(|e| format!("Error modificando registro de inicio: {}", e))?;

            if !output.status.success() {
                return Err(format!("Error reg add: {}", String::from_utf8_lossy(&output.stderr)));
            }
        } else {
            let output = Command::new("reg")
                .args(["delete", REG_KEY, "/v", APP_NAME, "/f"])
                .creation_flags(CREATE_NO_WINDOW)
                .output()
                .map_err(|e| format!("Error eliminando del registro: {}", e))?;

            if !output.status.success() {
                // If it doesn't exist, ignore error
            }
        }

        Ok(())
    }
}
