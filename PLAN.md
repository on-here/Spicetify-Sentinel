# 📋 Plan de Implementación: Spicetify Sentinel (Auto-Spicetify)

## 🎯 Resumen Ejecutivo

**Spicetify Sentinel** es una solución todo-en-uno de alto rendimiento para Windows diseñada para que **nunca más tengas que reinstalar ni re-aplicar Spicetify a mano**.

Combina:
1. **Bloqueo a Nivel Sistema (ACL Lock / 0 MB RAM):** Inhabilita las actualizaciones forzadas de Spotify modificando los permisos de seguridad en `%LOCALAPPDATA%\Spotify\Update` mediante `icacls` y archivos centinela de 0 bytes.
2. **Daemon Centinela en Rust (<10 MB RAM / 0% CPU):** Monitoreo continuo mediante `ReadDirectoryChangesW` de Windows. Si Spotify sufre modificaciones o se actualiza externamente, el daemon corre automáticamente `spicetify upgrade` y `spicetify backup apply` sin confirmaciones.
3. **Asistente de Recuperación Nuclear (Clean Reinstall):** Respalda `prefs`, temas y extensiones, desinstala la versión rota de Spotify, descarga e instala la versión oficial limpia, restaura los datos y vuelve a parchar.
4. **UI Spotify Dark Minimalista:** Ventana de estado con estética oficial (#121212 / #1DB954), consola de actividad en vivo, controles de 1 clic y soporte completo de Systray con inicio automático en Windows.

---

## 🛠️ Stack Tecnológico

- **Backend & Core Daemon:** Rust 2024 (Tauri 2.0 shell, `notify` v6, `windows-rs`, `serde`)
- **Frontend:** React 19 + Vite 7 + TailwindCSS + Lucide Icons + Framer Motion
- **Integración con el SO:** Win32 APIs, Windows Registry (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`), Windows Toast Notifications (`tauri-plugin-notification`), ACLs (`icacls`).

---

## 📦 Módulos Principales a Desarrollar

### 1. `blocker` (Módulo de Bloqueo a Nivel Sistema)
- `check_update_blocked()`: Verifica si el canal de updates de Spotify tiene aplicados los permisos denegados y el archivo dummy de 0 bytes.
- `block_updates()`:
  - Elimina cualquier contenido previo en `%LOCALAPPDATA%\Spotify\Update` y `%APPDATA%\Spotify\Update`.
  - Crea un archivo de 0 bytes llamado `Update` en ambas ubicaciones.
  - Aplica `icacls <path> /deny Everyone:(WD,AD,DE)` para prohibir escritura, adición o borrado.
- `unblock_updates()`:
  - Restaura los permisos por defecto (`icacls <path> /reset`) y remueve los archivos centinela.

### 2. `spicetify` (Motor Inteligente de Spicetify)
- `check_spicetify_installed()`: Busca el binario de `spicetify` en el `PATH`, `%USERPROFILE%\.spicetify` o `%LOCALAPPDATA%\spicetify`.
- `install_spicetify_silent()`: Ejecuta desatendidamente PowerShell `iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex` y añade las rutas necesarias al entorno.
- `auto_heal_spicetify()`:
  - Paso 1: `spicetify upgrade -y`
  - Paso 2: `spicetify restore backup apply -n` o `spicetify backup apply -n`
  - Paso 3 (Fallback): Si ocurre error de hash de backup, corre `spicetify clear-backup` y luego `spicetify backup apply`.
- `check_marketplace()` / `install_marketplace()`: Asegura que Spicetify Marketplace esté instalado para gestión de temas.

### 3. `watcher` (Centinela en Segundo Plano)
- Utiliza la API nativa de Windows `ReadDirectoryChangesW` para observar cambios en `%APPDATA%\Spotify` y `%LOCALAPPDATA%\Spotify`.
- Debounce de 3 segundos para evitar ejecuciones múltiples mientras Spotify termina de escribir archivos.
- Espera la finalización de cualquier proceso `SpotifyUpdate.exe` antes de proceder al parcheo automático.

### 4. `recovery` (Recuperación y Reinstalación Limpia)
- `backup_user_data()`: Copia de seguridad temporal de `prefs`, `spicetify/Themes`, `spicetify/Extensions` y `config-xpui.ini`.
- `kill_spotify_processes()`: Cierra de forma segura `Spotify.exe` y `SpotifyUpdate.exe`.
- `download_and_install_clean_spotify()`: Descarga el instalador oficial standalone de Spotify y lo ejecuta con el flag `/silent`.
- `restore_user_data()`: Restaura configuraciones y aplica el bloqueo y parcheo automáticamente.

### 5. `autostart` & `tray`
- Permite configurar el inicio automático con Windows al iniciar sesión.
- Icono en Systray con opciones rápidas (Forzar Parcheo, Bloquear/Desbloquear Updates, Reinstalar, Abrir Dashboard, Salir).

---

## 🎨 Diseño de Interfaz (Spotify Dark Mode)

- **Fondo:** `#121212`
- **Tarjetas de Estado:** `#181818` con bordes sutiles `#282828`
- **Acento:** `#1DB954` (Spotify Green)
- **Estado Visual:**
  - 🟢 *Spotify:* Detectado vX.X.X
  - 🟢 *Spicetify CLI:* Instalado y Parcheado
  - 🛡️ *Protección de Updates:* Activa (Sistema Inmune)
  - ⚡ *Centinela:* Activo en segundo plano
- **Terminal de Eventos:** Registro visual de acciones del centinela con badges animados.
