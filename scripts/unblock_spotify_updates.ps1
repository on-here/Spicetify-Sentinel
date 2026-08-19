<#
.SYNOPSIS
    Desbloqueador de actualizaciones de Spotify a nivel sistema.
#>

Write-Host "================================================" -ForegroundColor Yellow
Write-Host "  Spicetify Sentinel - Unblocker (CLI)          " -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

$paths = @(
    (Join-Path $env:LOCALAPPDATA "Spotify\Update"),
    (Join-Path $env:APPDATA "Spotify\Update")
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        icacls $path /reset | Out-Null
        if (Test-Path $path -PathType Container) {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            Remove-Item -Path $path -Force -ErrorAction SilentlyContinue
        }
        Write-Host "[+] Bloqueo retirado de: $path" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "[OK] Actualizaciones de Spotify restauradas a su comportamiento original." -ForegroundColor Yellow
