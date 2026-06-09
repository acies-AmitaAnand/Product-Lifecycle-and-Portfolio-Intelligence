$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

# Find positions of "activeKpi"
$pattern = [regex]"activeKpi"
$matches = $pattern.Matches($content)
Write-Output "Found activeKpi $($matches.Count) times"

foreach ($m in $matches) {
    $start = [Math]::Max(0, $m.Index - 1500)
    $len = [Math]::Min($content.Length - $start, 3000)
    Write-Output "=== Snippet around activeKpi at index $($m.Index) ==="
    Write-Output $content.Substring($start, $len)
    Write-Output "================================================"
}

# Find positions of "METHODOLOGY & LINEAGE AUDIT"
$pattern2 = [regex]"METHODOLOGY & LINEAGE AUDIT"
$matches2 = $pattern2.Matches($content)
Write-Output "Found METHODOLOGY & LINEAGE AUDIT $($matches2.Count) times"

foreach ($m in $matches2) {
    $start = [Math]::Max(0, $m.Index - 1500)
    $len = [Math]::Min($content.Length - $start, 3000)
    Write-Output "=== Snippet around METHODOLOGY at index $($m.Index) ==="
    Write-Output $content.Substring($start, $len)
    Write-Output "================================================"
}
