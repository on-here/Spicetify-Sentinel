use std::fs::{self, File, OpenOptions};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub struct UpdateBlocker;

impl UpdateBlocker {
    pub fn get_update_paths() -> Vec<PathBuf> {
        let mut paths = Vec::new();
        
        if let Some(local) = dirs::data_local_dir() {
            paths.push(local.join("Spotify").join("Update"));
        }
        if let Some(roaming) = dirs::config_dir() {
            paths.push(roaming.join("Spotify").join("Update"));
        }
        
        paths
    }

    pub fn is_blocked() -> bool {
        let paths = Self::get_update_paths();
        if paths.is_empty() {
            return false;
        }

        for path in &paths {
            if !path.exists() {
                return false;
            }
            // If it's a directory instead of a dummy file, it's not blocked
            if path.is_dir() {
                return false;
            }
            // If it's a file, try to open it for writing - if denied, it is blocked
            if let Ok(_) = OpenOptions::new().write(true).open(path) {
                return false;
            }
        }

        true
    }

    pub fn block() -> Result<String, String> {
        let paths = Self::get_update_paths();
        let mut errors = Vec::new();

        for path in paths {
            if let Some(parent) = path.parent() {
                if !parent.exists() {
                    let _ = fs::create_dir_all(parent);
                }
            }

            // If it's a directory, delete all files inside and remove directory
            if path.exists() {
                if path.is_dir() {
                    if let Err(e) = fs::remove_dir_all(&path) {
                        errors.push(format!("Error removiendo directorio {:?}: {}", path, e));
                        continue;
                    }
                } else {
                    // Reset permissions first in case it was partially locked
                    Self::reset_permissions(&path);
                    let _ = fs::remove_file(&path);
                }
            }

            // Create a 0-byte dummy file named "Update"
            match File::create(&path) {
                Ok(_) => {
                    // Apply ACL lock denying write, delete, append to Everyone SID (*S-1-1-0)
                    if let Err(e) = Self::apply_acl_deny(&path) {
                        errors.push(format!("Error aplicando ACL en {:?}: {}", path, e));
                    }
                }
                Err(e) => {
                    errors.push(format!("No se pudo crear archivo dummy {:?}: {}", path, e));
                }
            }
        }

        if errors.is_empty() {
            Ok("Canal de actualizaciones de Spotify bloqueado exitosamente a nivel sistema (NTFS ACL).".to_string())
        } else {
            Err(errors.join(" | "))
        }
    }

    pub fn unblock() -> Result<String, String> {
        let paths = Self::get_update_paths();
        let mut errors = Vec::new();

        for path in paths {
            if path.exists() {
                Self::reset_permissions(&path);
                if path.is_file() {
                    if let Err(e) = fs::remove_file(&path) {
                        errors.push(format!("Error eliminando archivo {:?}: {}", path, e));
                    }
                } else if path.is_dir() {
                    let _ = fs::remove_dir_all(&path);
                }
            }
        }

        if errors.is_empty() {
            Ok("Bloqueo de actualizaciones removido correctamente.".to_string())
        } else {
            Err(errors.join(" | "))
        }
    }

    fn apply_acl_deny(path: &Path) -> Result<(), String> {
        let path_str = path.to_string_lossy().to_string();

        // SID *S-1-1-0 is language-independent for 'Everyone' / 'Todos'
        let output = Command::new("icacls")
            .arg(&path_str)
            .arg("/deny")
            .arg("*S-1-1-0:(WD,AD,DE)")
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .map_err(|e| format!("Fallo al ejecutar icacls: {}", e))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("icacls deny error: {}", stderr));
        }

        Ok(())
    }

    fn reset_permissions(path: &Path) {
        let path_str = path.to_string_lossy().to_string();
        let _ = Command::new("icacls")
            .arg(&path_str)
            .arg("/reset")
            .creation_flags(CREATE_NO_WINDOW)
            .output();
    }
}
