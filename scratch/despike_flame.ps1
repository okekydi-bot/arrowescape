Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('assets/logo_clean.png')
$w = $src.Width
$h = $src.Height

$outBmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Copy everything first
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $outBmp.SetPixel($x, $y, $src.GetPixel($x, $y))
    }
}

# The circuit spikes are thin brown/orange lines (thickness 1-3 px) that are mostly horizontal or vertical
# and exist on the left/lower perimeter of the flame.
# Specifically, for any pixel with Alpha > 0:
# If it has very low neighborhood density (e.g., within radius 4, fewer than 18 pixels are opaque), it's a spike or isolated trace!
# Let's count opaque neighbors in a 7x7 or 9x9 box:
for ($y = 4; $y -lt $h - 4; $y++) {
    for ($x = 4; $x -lt $w - 4; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.A -gt 30) {
            # Check if this pixel is in the flame area (R > B + 30)
            if ($p.R -gt $p.B + 20) {
                # Count opaque pixels in 9x9 box (radius 4)
                $opaqueCount = 0
                for ($dy = -4; $dy -le 4; $dy++) {
                    for ($dx = -4; $dx -le 4; $dx++) {
                        if ($src.GetPixel($x + $dx, $y + $dy).A -gt 30) {
                            $opaqueCount++
                        }
                    }
                }
                # A 9x9 window has 81 pixels. A solid edge has ~40 pixels. A thin 1-2px line spike has <= 22 pixels!
                if ($opaqueCount -lt 24) {
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                }
            }
        }
    }
}

# Run a second pass to remove anything made thin by pass 1
$finalBmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $finalBmp.SetPixel($x, $y, $outBmp.GetPixel($x, $y))
    }
}

for ($y = 3; $y -lt $h - 3; $y++) {
    for ($x = 3; $x -lt $w - 3; $x++) {
        $p = $outBmp.GetPixel($x, $y)
        if ($p.A -gt 30 -and $p.R -gt $p.B + 20) {
            $opaqueCount = 0
            for ($dy = -3; $dy -le 3; $dy++) {
                for ($dx = -3; $dx -le 3; $dx++) {
                    if ($outBmp.GetPixel($x + $dx, $y + $dy).A -gt 30) {
                        $opaqueCount++
                    }
                }
            }
            # 7x7 window has 49 pixels.
            if ($opaqueCount -lt 15) {
                $finalBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }
}

$finalBmp.Save("assets/logo_perfect.png", [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Save("C:\Users\Lenovo\.gemini\antigravity-ide\brain\6fd2697c-585e-4a9f-9cf9-026dd960f0e8\logo_perfect.png", [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$outBmp.Dispose()
$finalBmp.Dispose()
Write-Host "Filtered spikes successfully!"
