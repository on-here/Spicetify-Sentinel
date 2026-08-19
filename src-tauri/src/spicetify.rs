use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

// Embedded robust Spicetify Adblock script (fallback and default)
const EMBEDDED_ADBLOCK_JS: &str = r#"// Spicetify Adblock Extension
(function adblock() {
    if (!Spicetify?.Platform?.AdManagers) {
        setTimeout(adblock, 250);
        return;
    }
    try {
        const { AdManagers } = Spicetify.Platform;
        if (AdManagers?.audio) {
            AdManagers.audio.inStreamApi = null;
            AdManagers.audio.disable();
        }
        if (AdManagers?.billboard) {
            AdManagers.billboard.disable();
        }
        if (AdManagers?.leaderboard) {
            AdManagers.leaderboard.disable();
        }
        if (AdManagers?.sponsoredPlaylist) {
            AdManagers.sponsoredPlaylist.disable();
        }
        console.log("[Spicetify Sentinel] Adblock initialized successfully.");
    } catch (e) {
        console.warn("[Spicetify Sentinel] Adblock setup:", e);
    }
})();
"#;

pub struct SpicetifyManager;

impl SpicetifyManager {
    pub fn clean_ansi(input: &str) -> String {
        let mut result = String::new();
        let mut in_escape = false;

        for c in input.chars() {
            if c == '\x1b' || c == '\u{001b}' {
                in_escape = true;
                continue;
            }
            if in_escape {
                if c.is_ascii_alphabetic() {
                    in_escape = false;
                }
                continue;
            }
            result.push(c);
        }

        result.trim().to_string()
    }

    pub fn get_spicetify_binary() -> Option<PathBuf> {
        // 1. Check user home .spicetify
        if let Some(home) = dirs::home_dir() {
            let path = home.join(".spicetify").join("spicetify.exe");
            if path.exists() {
                return Some(path);
            }
        }
        // 2. Check local app data
        if let Some(local) = dirs::data_local_dir() {
            let path = local.join("spicetify").join("spicetify.exe");
            if path.exists() {
                return Some(path);
            }
        }
        // 3. Try to locate via where.exe
        if let Ok(output) = Command::new("where.exe")
            .arg("spicetify")
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                if let Some(first_line) = stdout.lines().next() {
                    let path = PathBuf::from(first_line.trim());
                    if path.exists() {
                        return Some(path);
                    }
                }
            }
        }
        None
    }

    pub fn get_spotify_dir() -> Option<PathBuf> {
        dirs::config_dir().map(|roaming| roaming.join("Spotify"))
    }

    pub fn get_spotify_exe() -> Option<PathBuf> {
        Self::get_spotify_dir().map(|dir| dir.join("Spotify.exe"))
    }

    pub fn is_spotify_installed() -> bool {
        if let Some(exe) = Self::get_spotify_exe() {
            exe.exists()
        } else {
            false
        }
    }

    pub fn is_spotify_running() -> bool {
        let output = Command::new("tasklist")
            .args(["/FI", "IMAGENAME eq Spotify.exe", "/NH"])
            .creation_flags(CREATE_NO_WINDOW)
            .output();

        if let Ok(out) = output {
            let stdout = String::from_utf8_lossy(&out.stdout);
            stdout.to_lowercase().contains("spotify.exe")
        } else {
            false
        }
    }

    pub fn is_spicetify_installed() -> bool {
        Self::get_spicetify_binary().is_some()
    }

    pub fn get_spicetify_version() -> Option<String> {
        let binary = Self::get_spicetify_binary()?;
        let output = Command::new(binary)
            .arg("-v")
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .ok()?;

        if output.status.success() {
            let ver = Self::clean_ansi(&String::from_utf8_lossy(&output.stdout));
            if !ver.is_empty() {
                return Some(ver);
            }
        }
        None
    }

    pub fn is_patched() -> bool {
        if let Some(home) = dirs::home_dir() {
            let backup_dir = home.join(".spicetify").join("Backup");
            if backup_dir.exists() {
                if let Ok(entries) = fs::read_dir(&backup_dir) {
                    if entries.count() > 0 {
                        return true;
                    }
                }
            }
        }
        if let Some(dir) = Self::get_spotify_dir() {
            let xpui = dir.join("Apps").join("xpui.spa");
            let chrome_elf = dir.join("chrome_elf.dll");
            return xpui.exists() || chrome_elf.exists();
        }
        false
    }

    pub fn install_spicetify_cli() -> Result<String, String> {
        let output = Command::new("powershell")
            .args([
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                "iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex",
            ])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .map_err(|e| format!("Fallo al ejecutar PowerShell: {}", e))?;

        if output.status.success() {
            Ok("Spicetify CLI instalado exitosamente.".to_string())
        } else {
            let err = Self::clean_ansi(&String::from_utf8_lossy(&output.stderr));
            Err(format!("Error instalando Spicetify: {}", err))
        }
    }

    pub fn ensure_adblock_installed() -> Result<String, String> {
        let home = dirs::home_dir().ok_or("No se pudo obtener directorio HOME")?;
        let ext_dir = home.join(".spicetify").join("Extensions");
        
        if !ext_dir.exists() {
            fs::create_dir_all(&ext_dir).map_err(|e| format!("Error creando carpeta Extensions: {}", e))?;
        }

        let adblock_path = ext_dir.join("adblock.js");
        if !adblock_path.exists() {
            let mut file = File::create(&adblock_path)
                .map_err(|e| format!("Error creando adblock.js: {}", e))?;
            file.write_all(EMBEDDED_ADBLOCK_JS.as_bytes())
                .map_err(|e| format!("Error escribiendo adblock.js: {}", e))?;
        }

        // Now ensure it is configured in config-xpui.ini
        Self::add_extension_to_config("adblock.js")?;

        Ok("Extensión Adblock garantizada y activa en config-xpui.ini.".to_string())
    }

    pub fn ensure_marketplace_installed() -> Result<String, String> {
        let home = dirs::home_dir().ok_or("No se pudo obtener directorio HOME")?;
        let custom_apps_dir = home.join(".spicetify").join("CustomApps").join("marketplace");
        
        if !custom_apps_dir.exists() {
            // Install marketplace via official install script
            let output = Command::new("powershell")
                .args([
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    "iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.ps1 | iex",
                ])
                .creation_flags(CREATE_NO_WINDOW)
                .output();

            if let Ok(out) = output {
                if !out.status.success() {
                    return Err(format!("Error descargando Marketplace: {}", Self::clean_ansi(&String::from_utf8_lossy(&out.stderr))));
                }
            }
        }

        // Add custom app marketplace to config
        Self::add_custom_app_to_config("marketplace")?;

        Ok("Marketplace configurado exitosamente.".to_string())
    }

    pub fn is_adblock_active() -> bool {
        if let Some(home) = dirs::home_dir() {
            let adblock_file = home.join(".spicetify").join("Extensions").join("adblock.js");
            if !adblock_file.exists() {
                return false;
            }
            let config_file = home.join(".spicetify").join("config-xpui.ini");
            if let Ok(content) = fs::read_to_string(config_file) {
                return content.contains("adblock.js");
            }
        }
        false
    }

    pub fn is_marketplace_active() -> bool {
        if let Some(home) = dirs::home_dir() {
            let custom_app = home.join(".spicetify").join("CustomApps").join("marketplace");
            return custom_app.exists();
        }
        false
    }

    fn add_extension_to_config(ext_name: &str) -> Result<(), String> {
        let home = dirs::home_dir().ok_or("No se encontró HOME")?;
        let config_path = home.join(".spicetify").join("config-xpui.ini");

        if !config_path.exists() {
            return Ok(());
        }

        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Error leyendo config-xpui.ini: {}", e))?;

        let mut lines: Vec<String> = content.lines().map(|s| s.to_string()).collect();
        let mut modified = false;

        for line in &mut lines {
            if line.trim().starts_with("extensions") {
                let parts: Vec<&str> = line.split('=').collect();
                if parts.len() == 2 {
                    let current_exts = parts[1].trim();
                    let list: Vec<&str> = current_exts.split('|').map(|s| s.trim()).filter(|s| !s.is_empty()).collect();
                    if !list.contains(&ext_name) {
                        let mut new_list = list;
                        new_list.push(ext_name);
                        *line = format!("extensions                   = {}", new_list.join("|"));
                        modified = true;
                    }
                }
                break;
            }
        }

        if modified {
            fs::write(&config_path, lines.join("\r\n"))
                .map_err(|e| format!("Error guardando config-xpui.ini: {}", e))?;
        }

        Ok(())
    }

    fn add_custom_app_to_config(app_name: &str) -> Result<(), String> {
        let home = dirs::home_dir().ok_or("No se encontró HOME")?;
        let config_path = home.join(".spicetify").join("config-xpui.ini");

        if !config_path.exists() {
            return Ok(());
        }

        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Error leyendo config-xpui.ini: {}", e))?;

        let mut lines: Vec<String> = content.lines().map(|s| s.to_string()).collect();
        let mut modified = false;

        for line in &mut lines {
            if line.trim().starts_with("custom_apps") {
                let parts: Vec<&str> = line.split('=').collect();
                if parts.len() == 2 {
                    let current_apps = parts[1].trim();
                    let list: Vec<&str> = current_apps.split('|').map(|s| s.trim()).filter(|s| !s.is_empty()).collect();
                    if !list.contains(&app_name) {
                        let mut new_list = list;
                        new_list.push(app_name);
                        *line = format!("custom_apps                  = {}", new_list.join("|"));
                        modified = true;
                    }
                }
                break;
            }
        }

        if modified {
            fs::write(&config_path, lines.join("\r\n"))
                .map_err(|e| format!("Error guardando config-xpui.ini: {}", e))?;
        }

        Ok(())
    }

    pub fn run_spicetify_command(args: &[&str]) -> Result<String, String> {
        let binary = Self::get_spicetify_binary()
            .ok_or_else(|| "Spicetify CLI no está instalado en el sistema.".to_string())?;

        let output = Command::new(&binary)
            .args(args)
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .map_err(|e| format!("Fallo ejecutando spicetify {:?}: {}", args, e))?;

        let stdout = Self::clean_ansi(&String::from_utf8_lossy(&output.stdout));
        let stderr = Self::clean_ansi(&String::from_utf8_lossy(&output.stderr));

        if output.status.success() {
            Ok(stdout)
        } else {
            let combined = if !stderr.is_empty() && !stdout.is_empty() {
                format!("{}\n{}", stderr, stdout)
            } else if !stderr.is_empty() {
                stderr
            } else {
                stdout
            };
            Err(combined)
        }
    }

    pub fn auto_heal() -> Result<String, String> {
        // 1. Check if Spicetify CLI is installed, if not, install it
        if !Self::is_spicetify_installed() {
            let _ = Self::install_spicetify_cli();
        }

        // 2. Ensure Adblock is installed and configured
        let _ = Self::ensure_adblock_installed();

        // 3. Try to upgrade CLI
        let _ = Self::run_spicetify_command(&["upgrade", "-y"]);

        // 4. Primary: Try direct apply
        if let Ok(msg) = Self::run_spicetify_command(&["apply", "-n"]) {
            return Ok(format!("Spicetify aplicado con éxito: {}", msg));
        }

        // 5. Secondary: Try restore backup apply
        if let Ok(msg) = Self::run_spicetify_command(&["restore", "backup", "apply", "-n"]) {
            return Ok(format!("Spicetify restaurado y aplicado con éxito: {}", msg));
        }

        // 6. Tertiary: Try backup apply
        if let Ok(msg) = Self::run_spicetify_command(&["backup", "apply", "-n"]) {
            return Ok(format!("Spicetify respaldado y aplicado con éxito: {}", msg));
        }

        // 7. Fallback: restore then backup apply
        let _ = Self::run_spicetify_command(&["restore"]);
        let final_res = Self::run_spicetify_command(&["backup", "apply", "-n"]);
        match final_res {
            Ok(msg) => Ok(format!("Spicetify auto-reparado tras regeneración: {}", msg)),
            Err(e) => Err(format!("Fallo en auto-sanación: {}", e)),
        }
    }

    pub fn clean_cache() -> Result<String, String> {
        let mut cleaned = Vec::new();
        if let Some(local) = dirs::data_local_dir() {
            let storage = local.join("Spotify").join("Storage");
            let data = local.join("Spotify").join("Data");
            let users = local.join("Spotify").join("Users");

            if storage.exists() {
                let _ = fs::remove_dir_all(&storage);
                cleaned.push("Storage");
            }
            if data.exists() {
                let _ = fs::remove_dir_all(&data);
                cleaned.push("Data");
            }
            if users.exists() {
                if let Ok(entries) = fs::read_dir(&users) {
                    for entry in entries.flatten() {
                        let cache = entry.path().join("cache");
                        if cache.exists() {
                            let _ = fs::remove_dir_all(&cache);
                        }
                    }
                }
                cleaned.push("User Cache");
            }
        }

        Ok(format!("Caché de Spotify liberada con éxito ({}).", cleaned.join(", ")))
    }

    pub fn get_cache_size() -> (u64, String) {
        let mut total_bytes: u64 = 0;
        if let Some(local) = dirs::data_local_dir() {
            let storage = local.join("Spotify").join("Storage");
            let data = local.join("Spotify").join("Data");
            let users = local.join("Spotify").join("Users");
            let browser = local.join("Spotify").join("Browser").join("Cache");

            total_bytes += Self::dir_size(&storage);
            total_bytes += Self::dir_size(&data);
            total_bytes += Self::dir_size(&browser);

            if users.exists() {
                if let Ok(entries) = fs::read_dir(&users) {
                    for entry in entries.flatten() {
                        let cache = entry.path().join("cache");
                        total_bytes += Self::dir_size(&cache);
                    }
                }
            }
        }

        let formatted = if total_bytes >= 1024 * 1024 * 1024 {
            format!("{:.2} GB", total_bytes as f64 / (1024.0 * 1024.0 * 1024.0))
        } else if total_bytes >= 1024 * 1024 {
            format!("{:.1} MB", total_bytes as f64 / (1024.0 * 1024.0))
        } else if total_bytes > 0 {
            format!("{} KB", total_bytes / 1024)
        } else {
            "0 MB".to_string()
        };

        (total_bytes, formatted)
    }

    fn dir_size(path: &std::path::Path) -> u64 {
        if !path.exists() {
            return 0;
        }
        let mut size = 0;
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                if let Ok(meta) = entry.metadata() {
                    if meta.is_dir() {
                        size += Self::dir_size(&entry.path());
                    } else {
                        size += meta.len();
                    }
                }
            }
        }
        size
    }
}
