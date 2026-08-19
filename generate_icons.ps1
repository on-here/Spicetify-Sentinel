Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot "src-tauri\icons"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

function Generate-SpotifyIcon([int]$size, [string]$filename) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Spotify Green Circle
    $color = [System.Drawing.Color]::FromArgb(255, 29, 185, 84)
    $brush = [System.Drawing.SolidBrush]::new($color)
    $g.FillEllipse($brush, 2, 2, $size - 4, $size - 4)

    # Dark Waves
    $darkColor = [System.Drawing.Color]::FromArgb(255, 18, 18, 18)
    $penWidth = [float]($size / 12)
    $pen = [System.Drawing.Pen]::new($darkColor, $penWidth)

    $g.DrawArc($pen, [float]($size * 0.2), [float]($size * 0.22), [float]($size * 0.6), [float]($size * 0.45), 200, 140)
    $g.DrawArc($pen, [float]($size * 0.25), [float]($size * 0.38), [float]($size * 0.5), [float]($size * 0.4), 200, 140)
    $g.DrawArc($pen, [float]($size * 0.3), [float]($size * 0.54), [float]($size * 0.4), [float]($size * 0.35), 200, 140)

    $target = Join-Path $dir $filename
    $bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)

    $pen.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Generate-SpotifyIcon 32 "32x32.png"
Generate-SpotifyIcon 128 "128x128.png"
Generate-SpotifyIcon 256 "128x128@2x.png"
Generate-SpotifyIcon 256 "icon.png"

# Copy as ico and icns
Copy-Item (Join-Path $dir "128x128.png") (Join-Path $dir "icon.ico") -Force
Copy-Item (Join-Path $dir "128x128.png") (Join-Path $dir "icon.icns") -Force
Write-Host "Icons generated without errors in $dir"
