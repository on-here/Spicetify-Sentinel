import React, { useRef, useEffect } from 'react';
import { SentinelLog } from '../types';
import { Terminal, Trash } from 'lucide-react';

interface LogConsoleProps {
  logs: SentinelLog[];
  onClearLogs: () => void;
}

export const LogConsole: React.FC<LogConsoleProps> = ({ logs, onClearLogs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [logs]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'success':
        return <span className="text-spotify-green font-semibold">[OK]</span>;
      case 'warn':
        return <span className="text-spotify-warning font-semibold">[WARN]</span>;
      case 'error':
        return <span className="text-spotify-error font-semibold">[ERR]</span>;
      default:
        return <span className="text-spotify-subtext font-semibold">[INFO]</span>;
    }
  };

  return (
    <div className="p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-spotify-subtext uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-spotify-green" />
          Registro del Centinela
        </div>
        <button
          onClick={onClearLogs}
          title="Limpiar registro visual"
          className="p-1 text-spotify-subtext hover:text-white transition-colors"
        >
          <Trash className="w-3 h-3" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-black/40 border border-spotify-border/80 rounded-lg p-2.5 overflow-y-auto font-mono text-[11px] space-y-1.5 min-h-[140px] max-h-[170px]"
      >
        {logs.length === 0 ? (
          <div className="text-spotify-subtext/60 text-center py-6">
            Sin eventos registrados. El centinela está esperando cambios.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-tight">
              <span className="text-spotify-subtext/60 shrink-0 select-none">
                {log.timestamp}
              </span>
              <span className="shrink-0 select-none">{getLevelBadge(log.level)}</span>
              <span className="text-white/90 break-words flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
