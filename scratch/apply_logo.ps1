Add-Type -AssemblyName System.Drawing

$logoSrc = "assets/logo_perfect.png"
Copy-Item $logoSrc "assets/logo.png" -Force

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($logoSrc)

foreach ($folder in $sizes.Keys) {
    $dim = $sizes[$folder]
    $targetDir = "android/app/src/main/res/$folder"
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # 1. ic_launcher.png: Sleek dark rounded background (#070b14) with transparent logo centered inside
    $iconBmp = New-Object System.Drawing.Bitmap $dim, $dim, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($iconBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Dark background fill (#0b111e)
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 11, 17, 30))
    $g.FillRectangle($bgBrush, 0, 0, $dim, $dim)

    # Draw logo with 10% padding
    $pad = [int]($dim * 0.08)
    $drawDim = $dim - ($pad * 2)
    $destRect = New-Object System.Drawing.Rectangle $pad, $pad, $drawDim, $drawDim
    $g.DrawImage($srcBmp, $destRect)
    $g.Dispose()

    $iconBmp.Save("$targetDir/ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)

    # 2. ic_launcher_round.png: Circular icon
    $roundBmp = New-Object System.Drawing.Bitmap $dim, $dim, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gRound = [System.Drawing.Graphics]::FromImage($roundBmp)
    $gRound.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gRound.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $dim - 1, $dim - 1)
    $gRound.SetClip($path)
    $gRound.FillEllipse($bgBrush, 0, 0, $dim - 1, $dim - 1)

    $gRound.DrawImage($srcBmp, $destRect)
    $gRound.Dispose()
    $path.Dispose()

    $roundBmp.Save("$targetDir/ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)

    $iconBmp.Dispose()
    $roundBmp.Dispose()
    $bgBrush.Dispose()
}

$srcBmp.Dispose()
Write-Host "Icons generated successfully!"

# Sync assets
Copy-Item "assets/logo.png" "android/app/src/main/assets/assets/logo.png" -Force
Copy-Item "assets/logo_perfect.png" "android/app/src/main/assets/assets/logo_perfect.png" -Force
Write-Host "Assets synced successfully!"
