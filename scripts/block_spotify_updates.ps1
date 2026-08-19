<#
.SYNOPSIS
    Bloqueador permanente de actualizaciones de Spotify a nivel sistema (NTFS ACL).
.DESCRIPTION
    Elimina la carpeta Update de Spotify, crea un archivo centinela de 0 bytes y aplica permisos
    de denegación de escritura/borrado a través del SID universal *S-1-1-0 (Everyone/Todos).
#>

Write-Host "==============================================" -ForegroundColor Green
Write-Host "  Spicetify Sentinel - Update Blocker (CLI)   " -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# 1. Terminar SpotifyUpdate.exe si está activo
Get-Process -Name "SpotifyUpdate" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

$paths = @(
    (Join-Path $env:LOCALAPPDATA "Spotify\Update"),
    (Join-Path $env:APPDATA "Spotify\Update")
)

foreach ($path in $paths) {
    $parent = Split-Path $path -Parent
    if (!(Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    if (Test-Path $path) {
        # Reset permissions if needed
        icacls $path /reset | Out-Null
        if (Test-Path $path -PathType Container) {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            Remove-Item -Path $path -Force -ErrorAction SilentlyContinue
        }
    }

    # Create 0-byte dummy file
    New-Item -ItemType File -Path $path -Force | Out-Null

    # Apply ACL deny
    $aclRes = icacls $path /deny "*S-1-1-0:(WD,AD,DE)"
    Write-Host "[+] Bloqueo aplicado en: $path" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "[OK] Las actualizaciones de Spotify han sido bloqueadas a nivel sistema." -ForegroundColor Green
Write-Host "[OK] Spicetify ya no se romperá por actualizaciones automáticas." -ForegroundColor Green
