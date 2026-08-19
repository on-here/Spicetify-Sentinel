import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ShieldCheck, Minus, X, Settings as SettingsIcon } from 'lucide-react';

interface TitleBarProps {
  onOpenSettings: () => void;
  watcherActive: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onOpenSettings, watcherActive }) => {
  const handleMouseDown = async (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && (e.target as HTMLElement).closest('button') === null) {
      try {
        await invoke('window_start_drag');
      } catch (err) {
        console.error('Drag error:', err);
      }
    }
  };

  const handleMinimize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await invoke('window_minimize');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await invoke('window_hide');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header 
      data-tauri-drag-region 
      onMouseDown={handleMouseDown}
      className="h-10 bg-spotify-surface border-b border-spotify-border flex items-center justify-between px-3 select-none z-50 sticky top-0 cursor-move"
    >
      {/* Brand & Sentinel Status with Spotify Green */}
      <div className="flex items-center gap-2.5" data-tauri-drag-region>
        <div className="relative flex items-center justify-center" data-tauri-drag-region>
          <ShieldCheck className="w-5 h-5 text-spotify-green drop-shadow-[0_0_8px_rgba(29,185,84,0.45)]" />
          {watcherActive && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-spotify-green rounded-full animate-pulse-green ring-2 ring-spotify-surface" />
          )}
        </div>
        <span className="text-xs font-bold tracking-wide text-white uppercase flex items-center gap-1.5" data-tauri-drag-region>
          Spicetify Sentinel
          <span className="text-[10px] font-normal text-spotify-subtext px-1.5 py-0.2 bg-spotify-elevated rounded border border-spotify-border/40">
            v1.0
          </span>
        </span>
      </div>

      {/* Window Actions */}
      <div className="flex items-center gap-1" data-tauri-no-drag onMouseDown={(e) => e.stopPropagation()}>
        <button
          onClick={onOpenSettings}
          title="Configuración"
          data-tauri-no-drag
          className="p-1.5 text-spotify-subtext hover:text-white hover:bg-spotify-elevated rounded transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleMinimize}
          title="Minimizar"
          data-tauri-no-drag
          className="p-1.5 text-spotify-subtext hover:text-white hover:bg-spotify-elevated rounded transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleClose}
          title="Ocultar a la bandeja del sistema"
          data-tauri-no-drag
          className="p-1.5 text-spotify-subtext hover:text-spotify-error hover:bg-spotify-elevated rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
