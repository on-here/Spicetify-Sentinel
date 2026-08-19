use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemStatus {
    pub spotify_installed: bool,
    pub spotify_version: Option<String>,
    pub spotify_running: bool,
    pub spicetify_installed: bool,
    pub spicetify_version: Option<String>,
    pub is_patched: bool,
    pub updates_blocked: bool,
    pub adblock_installed: bool,
    pub marketplace_installed: bool,
    pub autostart_enabled: bool,
    pub watcher_active: bool,
    pub cache_size_formatted: String,
    pub cache_size_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SentinelLog {
    pub id: String,
    pub timestamp: String,
    pub level: String, // "info" | "success" | "warn" | "error"
    pub message: String,
    pub detail: Option<String>,
}

impl SentinelLog {
    pub fn new(level: &str, message: &str) -> Self {
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default();
        let total_secs = now.as_secs();
        let hours = (total_secs / 3600) % 24;
        let mins = (total_secs / 60) % 60;
        let secs = total_secs % 60;

        Self {
            id: format!("{}", now.as_millis()),
            timestamp: format!("{:02}:{:02}:{:02}", hours, mins, secs),
            level: level.to_string(),
            message: message.to_string(),
            detail: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandResult {
    pub success: bool,
    pub message: String,
    pub logs: Vec<SentinelLog>,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub autostart: bool,
    pub silent_auto_heal: bool,
    pub toast_notifications: bool,
    pub auto_install_adblock: bool,
    pub auto_install_marketplace: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            autostart: true,
            silent_auto_heal: true,
            toast_notifications: true,
            auto_install_adblock: true,
            auto_install_marketplace: true,
        }
    }
}
