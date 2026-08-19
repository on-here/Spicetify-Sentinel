export interface SystemStatus {
  spotify_installed: boolean;
  spotify_version: string | null;
  spotify_running: boolean;
  spicetify_installed: boolean;
  spicetify_version: string | null;
  is_patched: boolean;
  updates_blocked: boolean;
  adblock_installed: boolean;
  marketplace_installed: boolean;
  autostart_enabled: boolean;
  watcher_active: boolean;
  cache_size_formatted: string;
  cache_size_bytes: number;
}

export interface SentinelLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  detail?: string | null;
}

export interface CommandResult {
  success: boolean;
  message: string;
  logs: SentinelLog[];
}
