Add-Type -AssemblyName System.Drawing

$outDir = 'D:\Projectos_Secundarios\Auto_spicetify\src-tauri\icons'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$sizes = @(16, 32, 48, 64, 128, 256)
$bitmaps = @()

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $scale = [float]$s / 256.0

    # 1. Dark circular base
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, 0)),
        (New-Object System.Drawing.PointF($s, $s)),
        [System.Drawing.Color]::FromArgb(255, 12, 20, 38),
        [System.Drawing.Color]::FromArgb(255, 5, 10, 20)
    )
    $g.FillEllipse($bgBrush, (8.0 * $scale), (8.0 * $scale), (240.0 * $scale), (240.0 * $scale))

    # Outer electric blue ring
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 14, 165, 233), (4.0 * $scale))
    $g.DrawEllipse($ringPen, (8.0 * $scale), (8.0 * $scale), (240.0 * $scale), (240.0 * $scale))

    # 2. Main Shield Contour
    $shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $shieldPath.AddLine((128.0 * $scale), (36.0 * $scale), (198.0 * $scale), (66.0 * $scale))
    $shieldPath.AddLine((198.0 * $scale), (66.0 * $scale), (198.0 * $scale), (135.0 * $scale))
    $shieldPath.AddBezier((198.0 * $scale), (135.0 * $scale), (192.0 * $scale), (188.0 * $scale), (150.0 * $scale), (216.0 * $scale), (128.0 * $scale), (228.0 * $scale))
    $shieldPath.AddBezier((128.0 * $scale), (228.0 * $scale), (106.0 * $scale), (216.0 * $scale), (58.0 * $scale), (188.0 * $scale), (58.0 * $scale), (135.0 * $scale))
    $shieldPath.AddLine((58.0 * $scale), (135.0 * $scale), (58.0 * $scale), (66.0 * $scale))
    $shieldPath.CloseFigure()

    $shieldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF((128.0 * $scale), (36.0 * $scale))),
        (New-Object System.Drawing.PointF((128.0 * $scale), (228.0 * $scale))),
        [System.Drawing.Color]::FromArgb(255, 14, 165, 233),
        [System.Drawing.Color]::FromArgb(255, 2, 132, 199)
    )
    $g.FillPath($shieldBrush, $shieldPath)

    $shieldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 186, 230, 253), (5.0 * $scale))
    $g.DrawPath($shieldPen, $shieldPath)

    # 3. Spotify Sound Waves Inside Shield
    $wavePen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), (10.0 * $scale))
    $wavePen1.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $wavePen1.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $wavePen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 224, 242, 254), (8.5 * $scale))
    $wavePen2.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $wavePen2.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $wavePen3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 186, 230, 253), (7.0 * $scale))
    $wavePen3.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $wavePen3.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $g.DrawArc($wavePen1, (86.0 * $scale), (78.0 * $scale), (84.0 * $scale), (60.0 * $scale), 200, 140)
    $g.DrawArc($wavePen2, (92.0 * $scale), (104.0 * $scale), (72.0 * $scale), (52.0 * $scale), 200, 140)
    $g.DrawArc($wavePen3, (98.0 * $scale), (128.0 * $scale), (60.0 * $scale), (44.0 * $scale), 200, 140)

    # 4. Protection Padlock in center bottom
    $lockPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), (5.5 * $scale))
    $lockPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $lockPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($lockPen, (114.0 * $scale), (145.0 * $scale), (28.0 * $scale), (24.0 * $scale), 180, 180)

    $lockBodyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($lockBodyBrush, (111.0 * $scale), (156.0 * $scale), (34.0 * $scale), (24.0 * $scale))

    # Padlock Keyhole
    $holeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 2, 132, 199))
    $g.FillEllipse($holeBrush, (124.5 * $scale), (161.0 * $scale), (7.0 * $scale), (7.0 * $scale))
    $g.FillRectangle($holeBrush, (126.5 * $scale), (165.0 * $scale), (3.0 * $scale), (7.0 * $scale))

    $g.Dispose()

    if ($s -eq 32) { $bmp.Save((Join-Path $outDir '32x32.png'), [System.Drawing.Imaging.ImageFormat]::Png) }
    if ($s -eq 128) { 
        $bmp.Save((Join-Path $outDir '128x128.png'), [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save((Join-Path $outDir '128x128@2x.png'), [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save((Join-Path $outDir 'icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bitmaps += $bmp
}

# Generate multi-size ICO
$icoPath = Join-Path $outDir 'icon.ico'
$fs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($fs)

$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1 = ICO)
$bw.Write([uint16]$bitmaps.Count) # Count

$pngStreams = @()
foreach ($b in $bitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngStreams += $ms
}

$offset = 6 + ($bitmaps.Count * 16)

for ($i = 0; $i -lt $bitmaps.Count; $i++) {
    $b = $bitmaps[$i]
    $ms = $pngStreams[$i]
    $w = if ($b.Width -ge 256) { 0 } else { [byte]$b.Width }
    $h = if ($b.Height -ge 256) { 0 } else { [byte]$b.Height }

    $bw.Write([byte]$w)
    $bw.Write([byte]$h)
    $bw.Write([byte]0)
    $bw.Write([byte]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]32)
    $bw.Write([uint32]$ms.Length)
    $bw.Write([uint32]$offset)
    $offset += $ms.Length
}

foreach ($ms in $pngStreams) {
    $bw.Write($ms.ToArray())
    $ms.Dispose()
}

$bw.Close()
$fs.Close()
foreach ($b in $bitmaps) { $b.Dispose() }

Write-Host "Calm Blue Shield Icon generated successfully!"
