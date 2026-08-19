import React, { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { TitleBar } from './components/TitleBar';
import { StatusGrid } from './components/StatusGrid';
import { ActionButtons } from './components/ActionButtons';
import { LogConsole } from './components/LogConsole';
import { SettingsModal } from './components/SettingsModal';
import { NuclearConfirmModal } from './components/NuclearConfirmModal';
import { SystemStatus, SentinelLog, CommandResult } from './types';
import { Language, getInitialLanguage } from './i18n/translations';

export const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [logs, setLogs] = useState<SentinelLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNuclearOpen, setIsNuclearOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>(getInitialLanguage);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('sentinel_lang', newLang);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await invoke<SystemStatus>('get_system_status');
      setStatus(res);
    } catch (err) {
      console.error('Error fetching system status:', err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await invoke<SentinelLog[]>('get_logs');
      setLogs(res);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch once on load
    fetchStatus();
    fetchLogs();

    // Listen to background sentinel events (100% reactive, 0% CPU idle)
    let unlistenLog: (() => void) | undefined;
    let unlistenHeal: (() => void) | undefined;

    const setupListeners = async () => {
      try {
        unlistenLog = await listen<SentinelLog>('sentinel-log', (event) => {
          setLogs((prev) => [event.payload, ...prev.slice(0, 49)]);
        });

        unlistenHeal = await listen('sentinel-healed', () => {
          fetchStatus();
        });
      } catch (e) {
        console.error('Failed to attach event listeners:', e);
      }
    };

    setupListeners();

    return () => {
      if (unlistenLog) unlistenLog();
      if (unlistenHeal) unlistenHeal();
    };
  }, [fetchStatus, fetchLogs]);

  const handleAutoHeal = async () => {
    setLoading(true);
    try {
      const res = await invoke<CommandResult>('run_auto_heal');
      setLogs(res.logs);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlocker = async () => {
    if (!status) return;
    setLoading(true);
    try {
      const newTarget = !status.updates_blocked;
      const res = await invoke<CommandResult>('toggle_update_blocker', { enable: newTarget });
      setLogs(res.logs);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchSpotify = async () => {
    try {
      const res = await invoke<CommandResult>('launch_spotify');
      setLogs(res.logs);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCleanCache = async () => {
    setLoading(true);
    try {
      const res = await invoke<CommandResult>('clean_cache');
      setLogs(res.logs);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeCLI = async () => {
    setLoading(true);
    try {
      const res = await invoke<CommandResult>('force_spicetify_apply');
      setLogs(res.logs);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuclearReinstall = async () => {
    setLoading(true);
    try {
      const res = await invoke<CommandResult>('nuclear_reinstall');
      setLogs(res.logs);
      await fetchStatus();
      setIsNuclearOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutostart = async (enable: boolean) => {
    setStatus((prev) => (prev ? { ...prev, autostart_enabled: enable } : null));
    try {
      const res = await invoke<CommandResult>('set_autostart', { enable });
      setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      await fetchStatus();
    }
  };

  const handleRestartApp = async () => {
    try {
      await invoke('restart_app');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-spotify-base select-none overflow-hidden rounded-lg border border-spotify-border/60 shadow-2xl">
      {/* Title bar with native window dragging */}
      <TitleBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        watcherActive={status?.watcher_active ?? true}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Status Dashboard Grid */}
        <StatusGrid status={status} loading={!status} lang={lang} />

        {/* Quick Action Buttons */}
        <ActionButtons
          onAutoHeal={handleAutoHeal}
          onToggleBlocker={handleToggleBlocker}
          onLaunchSpotify={handleLaunchSpotify}
          onCleanCache={handleCleanCache}
          onUpgradeCLI={handleUpgradeCLI}
          onOpenNuclearModal={() => setIsNuclearOpen(true)}
          isBlocked={status?.updates_blocked ?? false}
          cacheSizeFormatted={status?.cache_size_formatted}
          loading={loading}
          lang={lang}
        />

        {/* Real-time Activity Log Terminal */}
        <LogConsole logs={logs} onClearLogs={handleClearLogs} lang={lang} />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        autostart={status?.autostart_enabled ?? false}
        onToggleAutostart={handleToggleAutostart}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onRestartApp={handleRestartApp}
        loading={loading}
      />

      {/* Nuclear Reinstall Confirmation Modal */}
      <NuclearConfirmModal
        isOpen={isNuclearOpen}
        onClose={() => setIsNuclearOpen(false)}
        onConfirm={handleNuclearReinstall}
        loading={loading}
        lang={lang}
      />
    </div>
  );
};
export default App;
