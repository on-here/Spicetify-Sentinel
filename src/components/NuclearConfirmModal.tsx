import React from 'react';
import { AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface NuclearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const NuclearConfirmModal: React.FC<NuclearConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-spotify-surface border border-spotify-error/40 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-border bg-spotify-error/10">
          <div className="flex items-center gap-2 text-spotify-error">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-sm font-bold text-white">Reinstalación Nuclear Limpia</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-spotify-subtext hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs text-spotify-subtext">
          <p className="text-white font-medium">
            Esta opción reparará completamente instalaciones rotas o corruptas de Spotify:
          </p>

          <ul className="space-y-2 bg-spotify-card p-3 rounded-lg border border-spotify-border/60">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Respaldo Automático:</strong> Se guardan tus temas, extensiones, <code className="text-spotify-green">config-xpui.ini</code> y archivo <code className="text-spotify-green">prefs</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Descarga Oficial:</strong> Se descarga la última versión limpia oficial de Spotify para Windows.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Restauración & Blindaje:</strong> Restaura tus temas, inyecta Adblock, activa el bloqueo de updates y re-parchea todo.
              </span>
            </li>
          </ul>

          <p className="text-[11px] text-spotify-warning">
            ⚠️ Spotify se cerrará durante este proceso. Tardará aproximadamente 15-30 segundos.
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-spotify-card border-t border-spotify-border flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 bg-spotify-elevated hover:bg-spotify-highlight text-white text-xs font-semibold rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1.5 bg-spotify-error hover:bg-red-600 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 shadow-lg"
          >
            {loading ? 'Reinstalando...' : 'Proceder con la Reinstalación'}
          </button>
        </div>
      </div>
    </div>
  );
};
