use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::os::windows::process::CommandExt;
use std::time::Duration;
use std::thread;

use crate::blocker::UpdateBlocker;
use crate::spicetify::SpicetifyManager;

const CREATE_NO_WINDOW: u32 = 0x08000000;
const SPOTIFY_INSTALLER_URL: &str = "https://download.scdn.co/SpotifySetup.exe";

pub struct RecoveryManager;

impl RecoveryManager {
    pub fn get_temp_backup_dir() -> PathBuf {
        std::env::temp_dir().join("SpicetifySentinel_Backup")
    }

    pub fn backup_user_data() -> Result<PathBuf, String> {
        let backup_dir = Self::get_temp_backup_dir();
        if backup_dir.exists() {
            let _ = fs::remove_dir_all(&backup_dir);
        }
        fs::create_dir_all(&backup_dir).map_err(|e| format!("No se pudo crear carpeta de respaldo temporal: {}", e))?;

        // 1. Backup Spotify prefs
        if let Some(roaming) = dirs::config_dir() {
            let prefs = roaming.join("Spotify").join("prefs");
            if prefs.exists() {
                let _ = fs::copy(&prefs, backup_dir.join("prefs"));
            }
        }

        // 2. Backup Spicetify configs & themes & extensions
        let spice_dir = SpicetifyManager::get_spicetify_config_dir();
        let spice_backup = backup_dir.join("spicetify");
        let _ = fs::create_dir_all(&spice_backup);

        let config_file = spice_dir.join("config-xpui.ini");
        if config_file.exists() {
            let _ = fs::copy(&config_file, spice_backup.join("config-xpui.ini"));
        }

        let themes_dir = spice_dir.join("Themes");
        if themes_dir.exists() {
            let _ = Self::copy_dir_recursive(&themes_dir, &spice_backup.join("Themes"));
        }

        let exts_dir = spice_dir.join("Extensions");
        if exts_dir.exists() {
            let _ = Self::copy_dir_recursive(&exts_dir, &spice_backup.join("Extensions"));
        }

        Ok(backup_dir)
    }

    pub fn kill_spotify_processes() {
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", "Spotify.exe", "/T"])
            .creation_flags(CREATE_NO_WINDOW)
            .output();

        let _ = Command::new("taskkill")
            .args(["/F", "/IM", "SpotifyUpdate.exe", "/T"])
            .creation_flags(CREATE_NO_WINDOW)
            .output();
        
        thread::sleep(Duration::from_millis(500));
    }

    pub fn clean_uninstall_spotify() -> Result<(), String> {
        Self::kill_spotify_processes();

        // Temporarily unblock updates folder so we can clean it
        let _ = UpdateBlocker::unblock();

        // Delete Spotify directory in AppData Roaming & Local
        if let Some(roaming) = dirs::config_dir() {
            let spotify_roaming = roaming.join("Spotify");
            if spotify_roaming.exists() {
                let _ = fs::remove_dir_all(&spotify_roaming);
            }
        }
        if let Some(local) = dirs::data_local_dir() {
            let spotify_local = local.join("Spotify");
            if spotify_local.exists() {
                let _ = fs::remove_dir_all(&spotify_local);
            }
        }

        Ok(())
    }

    pub fn download_and_install_spotify() -> Result<(), String> {
        let temp_installer = std::env::temp_dir().join("SpotifySetup_Clean.exe");
        
        // Download official Spotify installer using reqwest
        let response = reqwest::blocking::get(SPOTIFY_INSTALLER_URL)
            .map_err(|e| format!("Error descargando instalador de Spotify: {}", e))?;

        if !response.status().is_success() {
            return Err(format!("Error HTTP descargando instalador: {}", response.status()));
        }

        let bytes = response.bytes().map_err(|e| format!("Error leyendo instalador: {}", e))?;
        let mut file = File::create(&temp_installer)
            .map_err(|e| format!("Error creando archivo instalador: {}", e))?;
        file.write_all(&bytes).map_err(|e| format!("Error guardando instalador: {}", e))?;

        // Run installer silently
        let mut child = Command::new(&temp_installer)
            .creation_flags(CREATE_NO_WINDOW)
            .spawn()
            .map_err(|e| format!("Error ejecutando instalador de Spotify: {}", e))?;

        let _ = child.wait();

        // Wait up to 30 seconds for Spotify.exe to appear
        let start = std::time::Instant::now();
        while start.elapsed() < Duration::from_secs(30) {
            if SpicetifyManager::is_spotify_installed() {
                break;
            }
            thread::sleep(Duration::from_secs(1));
        }

        // Kill Spotify if it automatically opened after install
        thread::sleep(Duration::from_secs(2));
        Self::kill_spotify_processes();

        let _ = fs::remove_file(&temp_installer);
        Ok(())
    }

    pub fn restore_user_data(backup_dir: &Path) -> Result<(), String> {
        if !backup_dir.exists() {
            return Ok(());
        }

        // Restore prefs
        let backup_prefs = backup_dir.join("prefs");
        if backup_prefs.exists() {
            if let Some(roaming) = dirs::config_dir() {
                let spotify_dir = roaming.join("Spotify");
                let _ = fs::create_dir_all(&spotify_dir);
                let _ = fs::copy(&backup_prefs, spotify_dir.join("prefs"));
            }
        }

        // Restore Spicetify files
        let spice_backup = backup_dir.join("spicetify");
        if spice_backup.exists() {
            let spice_dest = SpicetifyManager::get_spicetify_config_dir();
            let _ = fs::create_dir_all(&spice_dest);

            let config = spice_backup.join("config-xpui.ini");
            if config.exists() {
                let _ = fs::copy(&config, spice_dest.join("config-xpui.ini"));
            }

            let themes = spice_backup.join("Themes");
            if themes.exists() {
                let _ = Self::copy_dir_recursive(&themes, &spice_dest.join("Themes"));
            }

            let exts = spice_backup.join("Extensions");
            if exts.exists() {
                let _ = Self::copy_dir_recursive(&exts, &spice_dest.join("Extensions"));
            }
        }

        // Clean up backup directory
        let _ = fs::remove_dir_all(backup_dir);
        Ok(())
    }

    pub fn execute_nuclear_recovery() -> Result<String, String> {
        // Step 1: Backup
        let backup_dir = Self::backup_user_data()?;

        // Step 2: Clean Uninstall
        Self::clean_uninstall_spotify()?;

        // Step 3: Download & Fresh Install
        Self::download_and_install_spotify()?;

        // Step 4: Restore user preferences & themes
        let _ = Self::restore_user_data(&backup_dir);

        // Step 5: Guarantee Adblock & Marketplace
        let _ = SpicetifyManager::ensure_adblock_installed();
        let _ = SpicetifyManager::ensure_marketplace_installed();

        // Step 6: Apply Update Blocker
        let _ = UpdateBlocker::block();

        // Step 7: Clear old Spicetify backup and re-apply
        let _ = SpicetifyManager::run_spicetify_command(&["clear-backup"]);
        let apply_result = SpicetifyManager::run_spicetify_command(&["backup", "apply", "-n"]);

        match apply_result {
            Ok(_) => Ok("Reinstalación limpia completada con éxito. Spotify reinstalado, configuraciones restauradas, adblock inyectado y bloqueo de actualizaciones activo.".to_string()),
            Err(e) => Ok(format!("Spotify reinstalado y restaurado, pero requiere reinicio para Spicetify: {}", e)),
        }
    }

    fn copy_dir_recursive(src: &Path, dst: &Path) -> std::io::Result<()> {
        if !dst.exists() {
            fs::create_dir_all(dst)?;
        }
        for entry in fs::read_dir(src)? {
            let entry = entry?;
            let ty = entry.file_type()?;
            let dest_path = dst.join(entry.file_name());
            if ty.is_dir() {
                Self::copy_dir_recursive(&entry.path(), &dest_path)?;
            } else {
                fs::copy(entry.path(), dest_path)?;
            }
        }
        Ok(())
    }
}
