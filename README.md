# 🎵 Spicetify Sentinel

<div align="center">

**The ultimate zero-footprint auto-repair sentinel and update blocker for Spotify & Spicetify on Windows.**  
*System-level NTFS update freezing, automatic silent healing, on-demand WebView2 lifecycle (~2.5 MB idle RAM), and Spotify dark theme.*

[![License: MIT](https://img.shields.io/badge/License-MIT-1DB954.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D4.svg)](https://microsoft.com)
[![Built with Rust & Tauri 2](https://img.shields.io/badge/Built%20with-Rust%20%7C%20Tauri%202.0-DEA584.svg)](https://v2.tauri.app/)
[![Idle Memory](https://img.shields.io/badge/Idle%20RAM-~2.5%20MB-1DB954.svg)]()
[![Idle CPU](https://img.shields.io/badge/Idle%20CPU-0.0%25-1DB954.svg)]()

</div>

---

## 💡 The Problem & The Solution

Every time Spotify performs a silent background update on Windows, it overwrites its core desktop binaries and **breaks your Spicetify installation, themes, extensions, and marketplace setup**.

**Spicetify Sentinel** permanently eliminates this frustration with a double-tier architecture:

1. **🛡️ NTFS ACL Update Shield (Prevention):**  
   Freezes Spotify's background updater (`%LOCALAPPDATA%\Spotify\Update`) using 0-byte sentinel files and Windows NTFS Access Control Lists (`icacls` deny write/delete). Spotify silently skips updates without breaking existing desktop functionality.
2. **⚡ Event-Driven Auto-Healing Daemon (Remediation):**  
   A lightweight native Rust daemon living in your Windows System Tray (Systray). It registers directly with Windows kernel file events (`ReadDirectoryChangesW`). If Spotify is ever overwritten or modified, the Sentinel detects it and reapplies Spicetify + Adblock in milliseconds with zero user intervention.

---

## ✨ Key Features

- **🪶 Ultra-Low Memory Footprint (~2.5 MB Idle RAM & 0.0% CPU):**  
  When minimized to the System Tray, the **WebView2 runtime is completely destroyed**, terminating all heavy Chromium subprocesses (GPU, renderers). Only the pure native Rust daemon stays alive in the background. Reopening from the tray takes ~100ms.
- **🛡️ 1-Click Update Blocker:**  
  Toggle Spotify update immunity on or off at will with zero background interceptors or network proxies.
- **⚡ Autonomous Auto-Healing:**  
  - Automatically installs Spicetify CLI silently if missing.
  - Automatically injects and configures default embedded **Adblock** and **Marketplace**.
  - Multi-tier healing fallback strategy (`apply` ➔ `restore backup apply` ➔ `backup apply`).
- **💾 Live Spotify Cache Analyzer & Cleaner:**  
  Calculates real-time disk space consumed by Spotify's cache (`Storage`, `Data`, `Users\cache`) and frees gigabytes with a single click.
- **☢️ Nuclear Clean Reinstaller:**  
  Backs up your user preferences (`prefs`), `config-xpui.ini`, custom `Themes`, and `Extensions`, performs a pristine uninstallation, downloads the latest official Spotify setup from Spotify CDN, restores your configs, reapplies the NTFS shield, and injects Spicetify in seconds.
- **🚀 Seamless Windows Autostart:**  
  Configures `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` for clean background startup with **zero UAC elevation prompts**.
- **🎨 Native Spotify Dark UI:**  
  Frameless custom dark interface built with official Spotify color palette (`#121212`, `#181818`, `#1DB954`), real-time diagnostic cards, live activity terminal, and native OS caption dragging.

---

## 🏗️ Architecture & How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Spicetify Sentinel                      │
│                                                             │
│   [ Window Visible ]  ──(Close to Tray)──► [ WebView2 Killed ]
│     React 19 + Vite                         Pure Rust Daemon│
│     (~130 MB RAM)                            (~2.5 MB RAM)  │
│                                                             │
│         ▲                                         │         │
│         │ (Click Tray Icon)                       │         │
│         └──────── Dynamic Re-creation ────────────┘         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
    🛡️ NTFS ACL File Blocker       👁️ Win32 Kernel Watcher
   Denies Write permissions to      ReadDirectoryChangesW event
   %LOCALAPPDATA%\Spotify\Update    Triggers silent "spicetify apply"
```

---

## 🛠️ Tech Stack

- **Backend & System Daemon:** [Rust 1.80+](https://www.rust-lang.org/) + [Tauri 2.0](https://v2.tauri.app/) (`notify`, `windows-rs`, `reqwest`)
- **Frontend UI:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **IPC Mechanism:** Tauri 2.0 Native Invocation with explicit window permission capabilities
- **Packaging:** Standalone Portable `.exe`, NSIS Windows Setup, and `.msi` installers

---

## ⬇️ Download & Installation

You **do not** need Node.js, Rust, or any developer tools to use Spicetify Sentinel. Ready-to-use binaries are available on the [**GitHub Releases**](../../releases) page:

| Format | File | Description |
| :--- | :--- | :--- |
| 🚀 **Portable (Recommended)** | `spicetify-sentinel.exe` | Zero installation. Just double-click to run from any folder. |
| 📦 **Windows Setup** | `Spicetify-Sentinel-Setup.exe` | Classic Windows installer with Start Menu shortcuts and uninstaller. |
| 🛡️ **MSI Package** | `Spicetify-Sentinel.msi` | Enterprise/standard Windows installer package. |

### ⚡ Quick Setup
1. Download `spicetify-sentinel.exe` from [**Releases**](../../releases/latest).
2. Run the application. It will automatically check your setup, block Spotify auto-updates, and inject Adblock.
3. Click the **Gear icon (⚙️)** in the top right and toggle **"Start with Windows"**.
4. Close the window to minimize it to the System Tray. You're fully protected!

---

## 🛠️ Building from Source (Developers)

If you'd like to contribute or build the application yourself:

### Prerequisites
- [Node.js](https://nodejs.org/) 20+
- [Rust & Cargo](https://rustup.rs/) 1.80+

```powershell
# 1. Clone the repository
git clone https://github.com/on-here/Spicetify-Sentinel.git
cd Spicetify-Sentinel

# 2. Install dependencies
npm install

# 3. Development mode (Hot-reload UI + Rust IPC)
npm run tauri dev

# 4. Production build (Generates portable .exe and installers)
npm run tauri build
```

Compiled outputs will be generated in `src-tauri/target/release/`.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
