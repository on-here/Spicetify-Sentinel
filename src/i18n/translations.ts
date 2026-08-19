export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Brand
    appTitle: "Spicetify Sentinel",
    versionTag: "v1.0",
    
    // Status Grid
    spotifyDesktop: "Spotify Desktop",
    spotifyDetected: "Detected (Desktop)",
    spotifyRunning: "Running",
    spotifyClosed: "Closed",
    spotifyNotFound: "Not Found",
    
    spicetifyCli: "Spicetify CLI",
    patched: "Patched",
    unpatched: "Unpatched",
    notInstalled: "Not Installed",
    
    updateBlocker: "Update Blocker",
    shieldImmune: "Immune",
    shieldVulnerable: "Vulnerable",
    shieldBlockedSub: "NTFS permissions denied",
    shieldAllowedSub: "Updates allowed",
    
    adblockExtras: "Adblock & Extras",
    adblockActive: "Active",
    adblockInactive: "Inactive",
    adblockSubActive: "Injecting extensions",
    adblockSubInactive: "No extensions",
    
    // Action Buttons
    autoHealBtn: "Auto-Repair & Apply Spicetify",
    applying: "Applying Spicetify...",
    btnBlocked: "🛡️ Blocked",
    btnAllowed: "⚠️ Allowed",
    btnBlockedTitle: "Click to Allow Updates",
    btnAllowedTitle: "Click to Block Updates",
    openApp: "Open App",
    openAppTitle: "Launch Spotify Desktop",
    cleanCache: "Cache",
    cleanCacheTitle: "Clean temporary Spotify cache files",
    reapply: "Re-apply",
    reapplyTitle: "Re-apply current Spicetify configuration",
    reinstall: "Reinstall",
    reinstallTitle: "Clean reinstallation while preserving your themes and settings",
    
    // Activity Log
    activityLog: "SENTINEL ACTIVITY LOG",
    clearLogs: "Clear log",
    emptyLogs: "Sentinel is idle and monitoring Spotify in background.",
    
    // Settings Modal
    settingsTitle: "Sentinel Settings",
    languageTitle: "Language",
    autostartTitle: "Start with Windows",
    autostartDesc: "Launch minimized to System Tray on system boot (~2.5 MB RAM).",
    adblockSettingTitle: "Mandatory Adblock Injection",
    adblockSettingBadge: "Enforced",
    adblockSettingDesc: "Guarantees adblock.js active on any recovery",
    healingSettingTitle: "Silent Self-Healing",
    healingSettingBadge: "Enforced",
    healingSettingDesc: "Automatically re-patches in background without prompts",
    restartAppTitle: "Restart Sentinel",
    restartAppDesc: "Relaunches the sentinel application",
    restartAppBtn: "Restart App",
    efficiencyNote: "Extreme efficiency: The sentinel runs in native Rust suspended in Windows kernel calls (<3 MB RAM & 0% CPU in tray).",
    doneBtn: "Done",
    
    // Nuclear Confirm Modal
    nuclearTitle: "Clean Nuclear Reinstall",
    nuclearWarning: "This will completely uninstall and reinstall Spotify from official sources, while backing up and restoring your preferences, themes, and extensions.",
    nuclearCancel: "Cancel",
    nuclearConfirm: "Start Clean Reinstall",
    nuclearProgress: "Reinstalling Spotify...",
    
    // Window control titles
    minimizeTitle: "Minimize",
    hideTitle: "Hide to System Tray",
    settingsIconTitle: "Settings",
  },
  es: {
    // Brand
    appTitle: "Spicetify Sentinel",
    versionTag: "v1.0",
    
    // Status Grid
    spotifyDesktop: "Spotify Desktop",
    spotifyDetected: "Detectado (Desktop)",
    spotifyRunning: "Abierto",
    spotifyClosed: "Cerrado",
    spotifyNotFound: "No Detectado",
    
    spicetifyCli: "Spicetify CLI",
    patched: "Parcheado",
    unpatched: "Sin Parche",
    notInstalled: "No Instalado",
    
    updateBlocker: "Bloqueo de Updates",
    shieldImmune: "Inmune",
    shieldVulnerable: "Vulnerable",
    shieldBlockedSub: "Permisos NTFS denegados",
    shieldAllowedSub: "Updates permitidas",
    
    adblockExtras: "Adblock & Extras",
    adblockActive: "Activo",
    adblockInactive: "Inactivo",
    adblockSubActive: "Inyectando extensiones",
    adblockSubInactive: "Sin extensiones",
    
    // Action Buttons
    autoHealBtn: "Auto-Reparar & Re-aplicar Spicetify",
    applying: "Aplicando Spicetify...",
    btnBlocked: "🛡️ Bloqueado",
    btnAllowed: "⚠️ Permitido",
    btnBlockedTitle: "Clic para Desbloquear Actualizaciones",
    btnAllowedTitle: "Clic para Bloquear Actualizaciones",
    openApp: "Abrir App",
    openAppTitle: "Abrir Spotify Desktop",
    cleanCache: "Caché",
    cleanCacheTitle: "Limpiar archivos temporales y caché de Spotify",
    reapply: "Re-aplicar",
    reapplyTitle: "Re-aplicar configuración actual de Spicetify",
    reinstall: "Reinstalar",
    reinstallTitle: "Reinstalación limpia conservando tus temas y configuraciones",
    
    // Activity Log
    activityLog: "REGISTRO DEL CENTINELA",
    clearLogs: "Limpiar registro",
    emptyLogs: "Centinela en reposo monitorizando Spotify en segundo plano.",
    
    // Settings Modal
    settingsTitle: "Configuración del Centinela",
    languageTitle: "Idioma",
    autostartTitle: "Iniciar con Windows",
    autostartDesc: "Arrancar minimizado en la bandeja del sistema (~2.5 MB RAM).",
    adblockSettingTitle: "Inyección de Adblock Obligatoria",
    adblockSettingBadge: "Fijado",
    adblockSettingDesc: "Garantiza adblock.js activo en cualquier recuperación",
    healingSettingTitle: "Auto-Sanación Silenciosa",
    healingSettingBadge: "Fijado",
    healingSettingDesc: "Re-parchea automáticamente en segundo plano sin pedir confirmaciones",
    restartAppTitle: "Reiniciar Centinela",
    restartAppDesc: "Vuelve a cargar y reiniciar la aplicación",
    restartAppBtn: "Reiniciar",
    efficiencyNote: "Eficiencia extrema: El centinela corre en Rust nativo suspendido en llamadas al kernel de Windows (<3 MB de RAM y 0% de CPU en tray).",
    doneBtn: "Listo",
    
    // Nuclear Confirm Modal
    nuclearTitle: "Reinstalación Nuclear Limpia",
    nuclearWarning: "Esto reinstalará Spotify desde cero descargando la versión oficial, respaldando y restaurando automáticamente tus preferencias, temas y extensiones.",
    nuclearCancel: "Cancelar",
    nuclearConfirm: "Iniciar Reinstalación Limpia",
    nuclearProgress: "Reinstalando Spotify...",
    
    // Window control titles
    minimizeTitle: "Minimizar",
    hideTitle: "Ocultar a la bandeja del sistema",
    settingsIconTitle: "Configuración",
  }
};

const exactLogMap: Record<string, { en: string; es: string }> = {
  "Canal de actualizaciones de Spotify bloqueado exitosamente a nivel sistema (NTFS ACL).": {
    en: "Spotify update channel successfully blocked at system level (NTFS ACL).",
    es: "Canal de actualizaciones de Spotify bloqueado exitosamente a nivel sistema (NTFS ACL)."
  },
  "Bloqueo de actualizaciones removido correctamente.": {
    en: "Spotify update blocker successfully removed.",
    es: "Bloqueo de actualizaciones removido correctamente."
  },
  "Centinela activo. Monitoreo por eventos de kernel en reposo (0% CPU).": {
    en: "Sentinel active. Kernel event monitoring in idle (0% CPU).",
    es: "Centinela activo. Monitoreo por eventos de kernel en reposo (0% CPU)."
  },
  "Iniciando auto-sanación e inyección...": {
    en: "Starting auto-healing and injection...",
    es: "Iniciando auto-sanación e inyección..."
  },
  "Spicetify aplicado y reparado correctamente con Adblock.": {
    en: "Spicetify applied and repaired successfully with Adblock.",
    es: "Spicetify aplicado y reparado correctamente con Adblock."
  },
  "Re-aplicando Spicetify...": {
    en: "Re-applying Spicetify...",
    es: "Re-aplicando Spicetify..."
  },
  "Descargando e instalando Spicetify CLI...": {
    en: "Downloading and installing Spicetify CLI...",
    es: "Descargando e instalando Spicetify CLI..."
  },
  "Verificando extensión Adblock...": {
    en: "Verifying Adblock extension...",
    es: "Verificando extensión Adblock..."
  },
  "Verificando Custom App Marketplace...": {
    en: "Verifying Custom App Marketplace...",
    es: "Verificando Custom App Marketplace..."
  },
  "Limpiando archivos de caché de Spotify...": {
    en: "Cleaning Spotify cache files...",
    es: "Limpiando archivos de caché de Spotify..."
  },
  "Spotify iniciado.": {
    en: "Spotify launched.",
    es: "Spotify iniciado."
  },
  "Spotify lanzado con éxito.": {
    en: "Spotify launched successfully.",
    es: "Spotify lanzado con éxito."
  },
  "Iniciando recuperación nuclear: reinstalación limpia conservando preferencias...": {
    en: "Starting nuclear recovery: clean reinstall preserving preferences...",
    es: "Iniciando recuperación nuclear: reinstalación limpia conservando preferencias..."
  },
  "Inicio automático activado con Windows.": {
    en: "Autostart enabled with Windows.",
    es: "Inicio automático activado con Windows."
  },
  "Inicio automático desactivado.": {
    en: "Autostart disabled.",
    es: "Inicio automático desactivado."
  },
  "Extensión Adblock inyectada y activada.": {
    en: "Adblock extension injected and activated.",
    es: "Extensión Adblock inyectada y activada."
  },
  "Marketplace instalado y activado.": {
    en: "Marketplace installed and activated.",
    es: "Marketplace instalado y activado."
  },
  "Reinstalación limpia completada con éxito. Spotify reinstalado, configuraciones restauradas, adblock inyectado y bloqueo de actualizaciones activo.": {
    en: "Clean reinstall completed successfully. Spotify reinstalled, preferences restored, adblock injected, and update blocker active.",
    es: "Reinstalación limpia completada con éxito. Spotify reinstalado, configuraciones restauradas, adblock inyectado y bloqueo de actualizaciones activo."
  }
};

export function translateLogMessage(msg: string, lang: Language): string {
  if (!msg) return "";
  const trimmed = msg.trim();

  // 1. Direct exact match
  if (exactLogMap[trimmed]) {
    return exactLogMap[trimmed][lang];
  }

  // 2. Dynamic cache freed match: "Caché de Spotify liberada con éxito (Storage, Data, User Cache)."
  if (trimmed.startsWith("Caché de Spotify liberada con éxito")) {
    if (lang === 'en') {
      return trimmed.replace("Caché de Spotify liberada con éxito", "Spotify cache freed successfully");
    }
    return trimmed;
  }

  // 3. Spicetify applied match
  if (trimmed.startsWith("Spicetify aplicado con éxito:")) {
    return lang === 'en'
      ? trimmed.replace("Spicetify aplicado con éxito:", "Spicetify applied successfully:")
      : trimmed;
  }

  if (trimmed.startsWith("Spicetify restaurado y aplicado con éxito:")) {
    return lang === 'en'
      ? trimmed.replace("Spicetify restaurado y aplicado con éxito:", "Spicetify restored and applied successfully:")
      : trimmed;
  }

  if (trimmed.startsWith("Spicetify respaldado y aplicado con éxito:")) {
    return lang === 'en'
      ? trimmed.replace("Spicetify respaldado y aplicado con éxito:", "Spicetify backed up and applied successfully:")
      : trimmed;
  }

  if (trimmed.startsWith("Spicetify auto-reparado tras regeneración:")) {
    return lang === 'en'
      ? trimmed.replace("Spicetify auto-reparado tras regeneración:", "Spicetify auto-repaired after regeneration:")
      : trimmed;
  }

  if (trimmed.startsWith("Detectada modificación en Spotify")) {
    return lang === 'en'
      ? "Detected modification in Spotify. Triggering silent auto-healing..."
      : "Detectada modificación en Spotify. Iniciando auto-sanación silenciosa...";
  }

  if (trimmed.startsWith("Auto-sanación completada:")) {
    return lang === 'en'
      ? "Auto-healing completed: Spicetify re-patched successfully."
      : "Auto-sanación completada: Spicetify re-parcheado con éxito.";
  }

  if (trimmed.startsWith("Memoria RAM liberada/recortada")) {
    return lang === 'en'
      ? "RAM working set trimmed successfully."
      : "Memoria RAM liberada/recortada con éxito.";
  }

  if (trimmed.startsWith("Spicetify CLI instalado correctamente:")) {
    return lang === 'en'
      ? trimmed.replace("Spicetify CLI instalado correctamente:", "Spicetify CLI installed successfully:")
      : trimmed;
  }

  return msg;
}

export function getInitialLanguage(): Language {
  const saved = localStorage.getItem('sentinel_lang');
  if (saved === 'en' || saved === 'es') {
    return saved as Language;
  }
  const browserLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
  return browserLang.startsWith('es') ? 'es' : 'en';
}
