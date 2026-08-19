$dir = Join-Path $PSScriptRoot "src-tauri\icons"
$pngPath = Join-Path $dir "32x32.png"
$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)

$icoPath = Join-Path $dir "icon.ico"
$stream = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($stream)

# ICONDIR
$writer.Write([uint16]0)      # idReserved (0)
$writer.Write([uint16]1)      # idType (1 = icon)
$writer.Write([uint16]1)      # idCount (1 image)

# ICONDIRENTRY
$writer.Write([byte]32)       # bWidth (32)
$writer.Write([byte]32)       # bHeight (32)
$writer.Write([byte]0)        # bColorCount (0)
$writer.Write([byte]0)        # bReserved (MUST BE 0)
$writer.Write([uint16]1)      # wPlanes (1)
$writer.Write([uint16]32)     # wBitCount (32)
$writer.Write([uint32]$pngBytes.Length) # dwBytesInRes
$writer.Write([uint32]22)     # dwImageOffset (6 + 16 = 22)

# Image Data
$writer.Write($pngBytes)

$writer.Flush()
$stream.Close()
$writer.Dispose()
$stream.Dispose()

Write-Host "Standard-compliant icon.ico written successfully!"
