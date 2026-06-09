$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)
$sb = New-Object System.Text.StringBuilder

# Find positions of "Zz" usage
$pattern = [regex]"s\.jsx\(Zz,"
$matches = $pattern.Matches($content)
$sb.AppendLine("Found s.jsx(Zz $($matches.Count) times") | Out-Null

foreach ($m in $matches) {
    $start = [Math]::Max(0, $m.Index - 500)
    $len = [Math]::Min($content.Length - $start, 1000)
    $sb.AppendLine("=== Snippet around Zz at index $($m.Index) ===") | Out-Null
    $sb.AppendLine($content.Substring($start, $len)) | Out-Null
    $sb.AppendLine("================================================") | Out-Null
}

[System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\zz_usage_output.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Search completed"
