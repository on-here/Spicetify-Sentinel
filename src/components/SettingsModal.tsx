import React from 'react';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autostart: boolean;
  onToggleAutostart: (val: boolean) => void;
  loading: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  autostart,
  onToggleAutostart,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-spotify-surface border border-spotify-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-border bg-spotify-card">
          <h2 className="text-sm font-bold text-white">Configuración del Centinela</h2>
          <button
            onClick={onClose}
            className="text-spotify-subtext hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Autostart Option */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
            <div>
              <div className="text-xs font-semibold text-white">Iniciar con Windows</div>
              <div className="text-[11px] text-spotify-subtext">
                Ejecuta el centinela minimizado al arrancar el sistema
              </div>
            </div>
            <button
              onClick={() => onToggleAutostart(!autostart)}
              disabled={loading}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                autostart ? 'bg-spotify-green justify-end' : 'bg-spotify-elevated justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Adblock Enforcement (Always On) */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                Inyección de Adblock Obligatoria
                <span className="text-[10px] bg-spotify-green/20 text-spotify-green px-1.5 rounded">
                  Fijado
                </span>
              </div>
              <div className="text-[11px] text-spotify-subtext">
                Garantiza adblock.js activo en cualquier recuperación
              </div>
            </div>
            <div className="text-spotify-green">
              <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Silent Self-Healing (Always On) */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                Auto-Sanación Silenciosa
                <span className="text-[10px] bg-spotify-green/20 text-spotify-green px-1.5 rounded">
                  Fijado
                </span>
              </div>
              <div className="text-[11px] text-spotify-subtext">
                Re-parchea automáticamente en segundo plano sin pedir confirmaciones
              </div>
            </div>
            <div className="text-spotify-green">
              <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Memory Target Note */}
          <div className="p-3 bg-spotify-base/50 rounded-lg border border-spotify-border/40 text-[11px] text-spotify-subtext leading-relaxed">
            <span className="text-spotify-green font-medium">⚡ Eficiencia extrema:</span> El centinela corre en Rust nativo suspendido en llamadas al kernel de Windows (<span className="text-white font-medium">&lt;10 MB de RAM y 0% de CPU</span>).
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-spotify-card border-t border-spotify-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-spotify-green hover:bg-spotify-greenHover text-black text-xs font-bold rounded-full transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
