import React from 'react';
import { X, Check, Globe, RotateCcw } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autostart: boolean;
  onToggleAutostart: (val: boolean) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onRestartApp?: () => void;
  loading: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  autostart,
  onToggleAutostart,
  lang,
  onLanguageChange,
  onRestartApp,
  loading,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-spotify-surface border border-spotify-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-border bg-spotify-card">
          <h2 className="text-sm font-bold text-white">{t.settingsTitle}</h2>
          <button
            onClick={onClose}
            className="text-spotify-subtext hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5">
          {/* Language Selector */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-semibold text-white">{t.languageTitle}</div>
                <div className="text-[11px] text-spotify-subtext">English / Español</div>
              </div>
            </div>
            <div className="flex items-center bg-spotify-base border border-spotify-border rounded-lg p-0.5">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-spotify-green text-black font-bold shadow'
                    : 'text-spotify-subtext hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  lang === 'es'
                    ? 'bg-spotify-green text-black font-bold shadow'
                    : 'text-spotify-subtext hover:text-white'
                }`}
              >
                ES
              </button>
            </div>
          </div>

          {/* Autostart Option */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
            <div>
              <div className="text-xs font-semibold text-white">{t.autostartTitle}</div>
              <div className="text-[11px] text-spotify-subtext">
                {t.autostartDesc}
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
                {t.adblockSettingTitle}
                <span className="text-[10px] bg-spotify-green/20 text-spotify-green px-1.5 rounded">
                  {t.adblockSettingBadge}
                </span>
              </div>
              <div className="text-[11px] text-spotify-subtext">
                {t.adblockSettingDesc}
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
                {t.healingSettingTitle}
                <span className="text-[10px] bg-spotify-green/20 text-spotify-green px-1.5 rounded">
                  {t.healingSettingBadge}
                </span>
              </div>
              <div className="text-[11px] text-spotify-subtext">
                {t.healingSettingDesc}
              </div>
            </div>
            <div className="text-spotify-green">
              <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Restart App Option */}
          {onRestartApp && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-spotify-card border border-spotify-border/60">
              <div>
                <div className="text-xs font-semibold text-white">{t.restartAppTitle}</div>
                <div className="text-[11px] text-spotify-subtext">
                  {t.restartAppDesc}
                </div>
              </div>
              <button
                onClick={onRestartApp}
                className="px-2.5 py-1 bg-spotify-elevated hover:bg-spotify-highlight text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 border border-spotify-border/40"
              >
                <RotateCcw className="w-3 h-3 text-spotify-green" />
                {t.restartAppBtn}
              </button>
            </div>
          )}

          {/* Memory Target Note */}
          <div className="p-3 bg-spotify-base/50 rounded-lg border border-spotify-border/40 text-[11px] text-spotify-subtext leading-relaxed">
            {t.efficiencyNote}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-spotify-card border-t border-spotify-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-spotify-green hover:bg-spotify-greenHover text-black text-xs font-bold rounded-full transition-colors"
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
