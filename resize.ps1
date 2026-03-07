Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\jawad\Desktop\Coding\my websites\Astrova\zip\public\cosmos\pillars of creation_original.jpg"
$destPath = "c:\Users\jawad\Desktop\Coding\my websites\Astrova\zip\public\cosmos\pillars of creation.jpg"

if (-not (Test-Path $srcPath)) {
    Copy-Item $destPath $srcPath
}

$img = [System.Drawing.Image]::FromFile($srcPath)

$maxWidth = 4096
$maxHeight = 4096

$factor = [math]::Min($maxWidth / $img.Width, $maxHeight / $img.Height)

if ($factor -lt 1) {
    $newW = [int]($img.Width * $factor)
    $newH = [int]($img.Height * $factor)
    
    $bmp = New-Object System.Drawing.Bitmap $newW, $newH
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graph.DrawImage($img, 0, 0, $newW, $newH)
    
    $img.Dispose()
    
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Resized to $newW x $newH"
} else {
    $img.Dispose()
    Write-Host "Image is already $maxWidth or smaller."
}
