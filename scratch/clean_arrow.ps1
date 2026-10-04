Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('assets/logo_arrow_only.png')
$w = $src.Width
$h = $src.Height

# We want only the arrow and the flame.
# Let's inspect what's inside.
# Arrow is cyan: high G, high B, lower R (or very bright white-cyan).
# Flame is orange/yellow: high R, medium-high G, low B.
# Background shards: maze circuit lines.
# Notice the circuit lines in the upper-left and right are cyan maze lines.
# But they are separated from the arrow contour, or we can define a polygon / convex hull / distance or connected components!

# Let's find connected components where alpha > 40.
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

                # 4-neighbors
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

Write-Host "Total components found: $($compSizes.Count)"
$sorted = $compSizes.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10
foreach ($s in $sorted) {
    Write-Host "Comp $($s.Key): $($s.Value) pixels"
}

# The arrow + flame should be the top component(s).
# If the top component is huge (e.g. > 50,000 pixels), let's keep only components that belong to arrow + flame!
# Let's see if the circuit lines are separate components or attached.
