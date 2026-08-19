import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface NuclearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  lang: Language;
}

export const NuclearConfirmModal: React.FC<NuclearConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-spotify-surface border border-spotify-error/40 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-spotify-error/10 text-spotify-error flex items-center justify-center mx-auto mb-3 border border-spotify-error/20">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">{t.nuclearTitle}</h3>
          <p className="text-xs text-spotify-subtext leading-relaxed">
            {t.nuclearWarning}
          </p>
        </div>

        <div className="p-3 bg-spotify-card border-t border-spotify-border/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-xs text-spotify-subtext hover:text-white rounded-lg transition-colors"
          >
            {t.nuclearCancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 bg-spotify-error hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? t.nuclearProgress : t.nuclearConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};
