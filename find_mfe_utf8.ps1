$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$outPath = "C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\mfe_search_output_utf8.txt"

if (-not (Test-Path $path)) {
    [System.IO.File]::WriteAllText($outPath, "Error: Desktop file not found at $path", [System.Text.Encoding]::UTF8)
    exit
}

$content = [System.IO.File]::ReadAllText($path)
$sb = New-Object System.Text.StringBuilder

# Find positions of "activeKpi"
$pattern = [regex]"activeKpi"
$matches = $pattern.Matches($content)
$sb.AppendLine("Found activeKpi $($matches.Count) times") | Out-Null

foreach ($m in $matches) {
    $start = [Math]::Max(0, $m.Index - 1000)
    $len = [Math]::Min($content.Length - $start, 2000)
    $sb.AppendLine("=== Snippet around activeKpi at index $($m.Index) ===") | Out-Null
    $sb.AppendLine($content.Substring($start, $len)) | Out-Null
    $sb.AppendLine("================================================") | Out-Null
}

# Find positions of "METHODOLOGY & LINEAGE AUDIT"
$pattern2 = [regex]"METHODOLOGY & LINEAGE AUDIT"
$matches2 = $pattern2.Matches($content)
$sb.AppendLine("Found METHODOLOGY & LINEAGE AUDIT $($matches2.Count) times") | Out-Null

foreach ($m in $matches2) {
    $start = [Math]::Max(0, $m.Index - 1000)
    $len = [Math]::Min($content.Length - $start, 2000)
    $sb.AppendLine("=== Snippet around METHODOLOGY at index $($m.Index) ===") | Out-Null
    $sb.AppendLine($content.Substring($start, $len)) | Out-Null
    $sb.AppendLine("================================================") | Out-Null
}

[System.IO.File]::WriteAllText($outPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Done writing to $outPath"
