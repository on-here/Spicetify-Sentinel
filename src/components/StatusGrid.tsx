import React from 'react';
import { SystemStatus } from '../types';
import { Music, Zap, Shield, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StatusGridProps {
  status: SystemStatus | null;
  loading: boolean;
}

export const StatusGrid: React.FC<StatusGridProps> = ({ status, loading }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {/* Spotify Card */}
      <div className="bg-spotify-surface border border-spotify-border/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-spotify-highlight transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-spotify-elevated rounded-md text-spotify-green">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Spotify Desktop</h3>
              <p className="text-[11px] text-spotify-subtext">
                {loading ? 'Comprobando...' : status?.spotify_installed ? (status.spotify_version || 'Instalado') : 'No detectado'}
              </p>
            </div>
          </div>
          {status?.spotify_running ? (
            <span className="flex items-center gap-1 text-[10px] bg-spotify-green/10 text-spotify-green px-2 py-0.5 rounded-full font-medium border border-spotify-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-spotify-green animate-pulse" />
              Abierto
            </span>
          ) : (
            <span className="text-[10px] bg-spotify-elevated text-spotify-subtext px-2 py-0.5 rounded-full font-medium">
              Cerrado
            </span>
          )}
        </div>
      </div>

      {/* Spicetify CLI Card */}
      <div className="bg-spotify-surface border border-spotify-border/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-spotify-highlight transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-spotify-elevated rounded-md text-spotify-green">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Spicetify CLI</h3>
              <p className="text-[11px] text-spotify-subtext">
                {loading ? 'Comprobando...' : status?.spicetify_installed ? `v${status.spicetify_version || 'Activo'}` : 'No instalado'}
              </p>
            </div>
          </div>
          {status?.is_patched ? (
            <span className="flex items-center gap-1 text-[10px] bg-spotify-green/10 text-spotify-green px-2 py-0.5 rounded-full font-medium border border-spotify-green/20">
              <CheckCircle2 className="w-3 h-3" />
              Parcheado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-spotify-error/10 text-spotify-error px-2 py-0.5 rounded-full font-medium border border-spotify-error/20">
              <AlertTriangle className="w-3 h-3" />
              Sin Parche
            </span>
          )}
        </div>
      </div>

      {/* Update Blocker Card */}
      <div className="bg-spotify-surface border border-spotify-border/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-spotify-highlight transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 bg-spotify-elevated rounded-md ${status?.updates_blocked ? 'text-spotify-green' : 'text-spotify-warning'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Bloqueo de Updates</h3>
              <p className="text-[11px] text-spotify-subtext">
                {status?.updates_blocked ? 'Permisos NTFS denegados' : 'Updates permitidos'}
              </p>
            </div>
          </div>
          {status?.updates_blocked ? (
            <span className="flex items-center gap-1 text-[10px] bg-spotify-green/10 text-spotify-green px-2 py-0.5 rounded-full font-medium border border-spotify-green/20">
              <CheckCircle2 className="w-3 h-3" />
              Inmune
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-spotify-warning/10 text-spotify-warning px-2 py-0.5 rounded-full font-medium border border-spotify-warning/20">
              <XCircle className="w-3 h-3" />
              Vulnerable
            </span>
          )}
        </div>
      </div>

      {/* Adblock & Marketplace Card */}
      <div className="bg-spotify-surface border border-spotify-border/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-spotify-highlight transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-spotify-elevated rounded-md text-spotify-green">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Adblock & Extras</h3>
              <p className="text-[11px] text-spotify-subtext">
                {status?.adblock_installed ? 'Adblock forzado y activo' : 'Inyectando extensiones'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {status?.adblock_installed ? (
              <span className="text-[10px] bg-spotify-green/10 text-spotify-green px-1.5 py-0.5 rounded font-medium border border-spotify-green/20">
                Adblock ON
              </span>
            ) : null}
            {status?.marketplace_installed ? (
              <span className="text-[10px] bg-spotify-elevated text-spotify-subtext px-1.5 py-0.5 rounded font-medium">
                Marketplace
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
