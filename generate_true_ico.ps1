Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot "src-tauri\icons"

function Create-TrueIco([int]$size, [string]$filename) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $color = [System.Drawing.Color]::FromArgb(255, 29, 185, 84)
    $brush = [System.Drawing.SolidBrush]::new($color)
    $g.FillEllipse($brush, 1, 1, $size - 2, $size - 2)

    $darkColor = [System.Drawing.Color]::FromArgb(255, 18, 18, 18)
    $penWidth = [float]([Math]::Max(1.0, $size / 10))
    $pen = [System.Drawing.Pen]::new($darkColor, $penWidth)

    $g.DrawArc($pen, [float]($size * 0.2), [float]($size * 0.22), [float]($size * 0.6), [float]($size * 0.45), 200, 140)
    $g.DrawArc($pen, [float]($size * 0.25), [float]($size * 0.38), [float]($size * 0.5), [float]($size * 0.4), 200, 140)
    $g.DrawArc($pen, [float]($size * 0.3), [float]($size * 0.54), [float]($size * 0.4), [float]($size * 0.35), 200, 140)

    # Convert to real Windows Icon handle and save
    $hIcon = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    $fileStream = [System.IO.File]::OpenWrite((Join-Path $dir $filename))
    $icon.Save($fileStream)
    $fileStream.Close()
    $icon.Dispose()

    $pen.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Create-TrueIco 32 "icon.ico"
Write-Host "True Windows icon.ico generated successfully"
