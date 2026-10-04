Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('assets/logo_arrow_only.png')
$w = $src.Width
$h = $src.Height

$visited = New-Object 'bool[,]' $w, $h
$component = New-Object 'int[,]' $w, $h
$queueX = New-Object System.Collections.Generic.Queue[int]
$queueY = New-Object System.Collections.Generic.Queue[int]
$compSizes = @{}
$currentCompId = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $src.GetPixel($x, $y)
        if ($pixel.A -gt 40 -and -not $visited[$x, $y]) {
            $currentCompId++
            $count = 0
            $queueX.Enqueue($x)
            $queueY.Enqueue($y)
            $visited[$x, $y] = $true

            while ($queueX.Count -gt 0) {
                $cx = $queueX.Dequeue()
                $cy = $queueY.Dequeue()
                $component[$cx, $cy] = $currentCompId
                $count++

                $dxs = @(-1, 1, 0, 0)
                $dys = @(0, 0, -1, 1)
                for ($d = 0; $d -lt 4; $d++) {
                    $nx = $cx + $dxs[$d]
                    $ny = $cy + $dys[$d]
                    if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                        if (-not $visited[$nx, $ny]) {
                            $np = $src.GetPixel($nx, $ny)
                            if ($np.A -gt 40) {
                                $visited[$nx, $ny] = $true
                                $queueX.Enqueue($nx)
                                $queueY.Enqueue($ny)
                            }
                        }
                    }
                }
            }
            $compSizes[$currentCompId] = $count
        }
    }
}

# The two huge components are the arrow and the flame:
# Comp 5 and Comp 87
# Let's find any component with size > 10000
$targetComps = @()
foreach ($k in $compSizes.Keys) {
    if ($compSizes[$k] -gt 10000) {
        $targetComps += $k
    }
}

Write-Host "Target components: $($targetComps -join ', ')"

# Create new bitmap
$cleanBmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$minX = $w; $maxX = 0
$minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $cId = $component[$x, $y]
        if ($targetComps -contains $cId) {
            $p = $src.GetPixel($x, $y)
            $cleanBmp.SetPixel($x, $y, $p)
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        } else {
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

# Also dilate or add glow smoothing if needed, but original pixels are already anti-aliased.
# Add small padding
$pad = 20
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + ($pad * 2))

# Make it square centered
$maxDim = [Math]::Max($cropW, $cropH)
$sqBmp = New-Object System.Drawing.Bitmap $maxDim, $maxDim, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($sqBmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$destX = [int](($maxDim - $cropW) / 2)
$destY = [int](($maxDim - $cropH) / 2)

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$destRect = New-Object System.Drawing.Rectangle $destX, $destY, $cropW, $cropH
$g.DrawImage($cleanBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$outputPath = "assets/logo_clean.png"
$sqBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$sqBmp.Save("C:\Users\Lenovo\.gemini\antigravity-ide\brain\6fd2697c-585e-4a9f-9cf9-026dd960f0e8\logo_clean.png", [System.Drawing.Imaging.ImageFormat]::Png)

$cleanBmp.Dispose()
$sqBmp.Dispose()
$src.Dispose()

Write-Host "Saved logo_clean.png successfully! Dimensions: ${maxDim}x${maxDim}"
