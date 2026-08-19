import React, { useRef, useEffect } from 'react';
import { SentinelLog } from '../types';
import { Terminal, Trash2 } from 'lucide-react';
import { translations, Language, translateLogMessage } from '../i18n/translations';

interface LogConsoleProps {
  logs: SentinelLog[];
  onClearLogs: () => void;
  lang: Language;
}

export const LogConsole: React.FC<LogConsoleProps> = ({ logs, onClearLogs, lang }) => {
  const t = translations[lang];
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-spotify-green';
      case 'warn':
        return 'text-spotify-warning';
      case 'error':
        return 'text-spotify-error';
      default:
        return 'text-sky-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 mx-4 mb-3 mt-2 bg-black/40 border border-spotify-border/60 rounded-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-spotify-surface/80 border-b border-spotify-border/40 select-none">
        <div className="flex items-center gap-1.5 text-spotify-subtext text-[11px] font-mono">
          <Terminal className="w-3.5 h-3.5 text-spotify-green" />
          <span>{t.activityLog}</span>
        </div>
        <button
          onClick={onClearLogs}
          title={t.clearLogs}
          className="text-spotify-subtext hover:text-white transition-colors p-1 rounded hover:bg-spotify-elevated"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Log Output Area */}
      <div className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] space-y-1 select-text">
        {logs.length === 0 ? (
          <div className="text-spotify-subtext italic text-center py-4 select-none">
            {t.emptyLogs}
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start gap-2 break-all">
              <span className="text-spotify-subtext select-none shrink-0 font-mono text-[10px]">
                {log.timestamp}
              </span>
              <span className={`font-bold uppercase text-[10px] shrink-0 ${getBadgeColor(log.level)}`}>
                [{log.level === 'warn' ? 'WARN' : log.level === 'error' ? 'ERR' : log.level === 'success' ? 'OK' : 'INFO'}]
              </span>
              <span className="text-white/90">{translateLogMessage(log.message, lang)}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};
