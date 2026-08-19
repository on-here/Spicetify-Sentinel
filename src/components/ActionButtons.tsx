import React from 'react';
import { Play, RefreshCw, Shield, Trash2, Zap, AlertOctagon } from 'lucide-react';

interface ActionButtonsProps {
  onAutoHeal: () => void;
  onToggleBlocker: () => void;
  onLaunchSpotify: () => void;
  onCleanCache: () => void;
  onUpgradeCLI: () => void;
  onOpenNuclearModal: () => void;
  isBlocked: boolean;
  cacheSizeFormatted?: string;
  loading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAutoHeal,
  onToggleBlocker,
  onLaunchSpotify,
  onCleanCache,
  onUpgradeCLI,
  onOpenNuclearModal,
  isBlocked,
  cacheSizeFormatted,
  loading,
}) => {
  return (
    <div className="px-4 space-y-2.5">
      {/* Primary Action Button */}
      <button
        onClick={onAutoHeal}
        disabled={loading}
        className="w-full bg-spotify-green hover:bg-spotify-greenHover text-black font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none text-xs uppercase tracking-wider"
      >
        <Zap className="w-4 h-4 fill-black" />
        {loading ? 'Aplicando Spicetify...' : 'Auto-Reparar & Re-aplicar Spicetify'}
      </button>

      {/* Grid of Secondary Quick Actions */}
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={onToggleBlocker}
          disabled={loading}
          title={isBlocked ? "Clic para Desbloquear Actualizaciones" : "Clic para Bloquear Actualizaciones"}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
            isBlocked
              ? 'bg-spotify-surface border-spotify-green/40 text-spotify-green hover:bg-spotify-elevated'
              : 'bg-spotify-surface border-spotify-warning/40 text-spotify-warning hover:bg-spotify-elevated'
          }`}
        >
          <Shield className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-semibold leading-tight">
            {isBlocked ? '🛡️ Bloqueado' : '⚠️ Permitido'}
          </span>
        </button>

        <button
          onClick={onLaunchSpotify}
          disabled={loading}
          title="Abrir Spotify Desktop"
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-spotify-surface border border-spotify-border hover:border-spotify-highlight text-white hover:bg-spotify-elevated transition-all"
        >
          <Play className="w-4 h-4 mb-1 text-spotify-green" />
          <span className="text-[10px] font-medium leading-tight">Abrir App</span>
        </button>

        <button
          onClick={onCleanCache}
          disabled={loading}
          title={`Limpiar archivos temporales de Spotify (${cacheSizeFormatted || '0 MB'})`}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-spotify-surface border border-spotify-border hover:border-sky-500/50 text-white hover:bg-spotify-elevated transition-all group"
        >
          <Trash2 className="w-4 h-4 mb-1 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium leading-tight text-spotify-subtext group-hover:text-white">
            Caché
          </span>
          <span className="text-[9px] font-semibold text-sky-400 leading-none mt-0.5">
            {cacheSizeFormatted || '0 MB'}
          </span>
        </button>

        <button
          onClick={onUpgradeCLI}
          disabled={loading}
          title="Re-aplicar configuración actual de Spicetify"
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-spotify-surface border border-spotify-border hover:border-spotify-highlight text-white hover:bg-spotify-elevated transition-all"
        >
          <RefreshCw className="w-4 h-4 mb-1 text-spotify-subtext" />
          <span className="text-[10px] font-medium leading-tight">Re-aplicar</span>
        </button>

        <button
          onClick={onOpenNuclearModal}
          disabled={loading}
          title="Reinstalación limpia conservando tus temas y configuraciones"
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-spotify-surface border border-spotify-error/30 hover:border-spotify-error text-spotify-error hover:bg-spotify-elevated transition-all"
        >
          <AlertOctagon className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-medium leading-tight">Reinstalar</span>
        </button>
      </div>
    </div>
  );
};
