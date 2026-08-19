# 🎵 Spicetify Sentinel (Auto-Spicetify)

<div align="center">

![Spicetify Sentinel Banner](https://raw.githubusercontent.com/spicetify/spicetify-cli/main/assets/banner.png)

**El centinela definitivo para Spotify + Spicetify en Windows.**  
*Protección a nivel sistema, auto-reparación inteligente, consumo ultra-bajo (<10MB RAM) y estética Spotify Dark.*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue.svg)](https://microsoft.com)
[![Rust](https://img.shields.io/badge/Built%20with-Rust%20%7C%20Tauri-orange.svg)](https://www.rust-lang.org/)
[![Memory Footprint](https://img.shields.io/badge/RAM%20Idle-%3C10MB-brightgreen.svg)]()

</div>

---

## 🌟 ¿Qué es Spicetify Sentinel?

Cada vez que Spotify se actualiza automáticamente en segundo plano en Windows, sobreescribe sus archivos principales y **rompe por completo la instalación de Spicetify, sus temas y extensiones**. 

**Spicetify Sentinel** resuelve esto para siempre mediante un enfoque de doble capa:
1. **🛡️ Bloqueo a Nivel Sistema (ACL Lock):** Inhabilita de raíz el canal de actualizaciones de Spotify (`%LOCALAPPDATA%\Spotify\Update`) aplicando permisos de seguridad NTFS denegados y archivos centinela de 0 bytes. Spotify nunca más se actualiza solo ni rompe tus temas.
2. **⚡ Centinela de Auto-Sanación (Background Watcher):** Un daemon nativo en Rust ultra-ligero que vive en la bandeja del sistema (Systray). Si por cualquier motivo Spotify cambia o se reinstala, el centinela lo detecta en milisegundos y re-aplica Spicetify de forma 100% silenciosa y automática.

---

## ✨ Características Principales

- **🔋 Consumo Ultra-Bajo:** Desarrollado en Rust nativo. Consume menos de **10 MB de memoria RAM** y **0.0% de CPU** en reposo gracias al uso de eventos del kernel de Windows (`ReadDirectoryChangesW`).
- **🛡️ Bloqueo / Desbloqueo de Updates con 1 Clic:** Desactiva permanentemente `SpotifyUpdate.exe` sin necesidad de programas intermediarios ni interceptores lentos.
- **🔄 Auto-Sanación Inteligente:**
  - Detecta si Spicetify CLI está instalado (si no, lo descarga e instala de forma silenciosa).
  - Detecta si faltan extensiones clave como el **Marketplace** y las configura automáticamente.
  - Reintenta automáticamente con fallbacks (`spicetify upgrade` ➔ `spicetify backup apply` ➔ `clear-backup`).
- **☢️ Reinstalación Limpia con Respaldo (Nuclear Recovery):** Si Spotify se corrompe, respalda tus temas, extensiones y archivo `prefs`, desinstala la versión dañada, descarga la versión oficial limpia, restaura tus datos y vuelve a parchar todo en segundos.
- **🎨 Estética Spotify Dark Minimalista:** Interfaz visual con la paleta de colores oficial de Spotify (`#121212`, `#181818`, `#1DB954`), tarjetas de estado en tiempo real, consola de actividad y micro-animaciones suaves.
- **🚀 Inicio Automático con Windows:** Configurable con un solo interruptor para arrancar minimizado en el Systray.
- **🔔 Notificaciones Nativas:** Alertas Windows Toast opcionales para avisarte únicamente cuando el sistema se auto-reparó con éxito.

---

## 🛠️ Tecnologías

- **Núcleo & Daemon:** [Rust](https://www.rust-lang.org/) + [Tauri 2.0](https://v2.tauri.app/) (Win32 API, `notify`, `windows-rs`)
- **Frontend:** [React 19](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Gestión de Permisos:** Windows NTFS ACL (`icacls`) + Registry `Run` Handler

---

## 🚀 Instalación y Uso

### Compilar desde Código Fuente
Requisitos:
- Node.js 20+
- Rust & Cargo 1.80+

```powershell
# Clonar el repositorio
git clone https://github.com/tu-usuario/Auto_spicetify.git
cd Auto_spicetify

# Instalar dependencias del frontend
npm install

# Compilar en modo desarrollo
npm run tauri dev

# Compilar ejecutable optimizado para producción
npm run tauri build
```

---

## 📜 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más detalles.
