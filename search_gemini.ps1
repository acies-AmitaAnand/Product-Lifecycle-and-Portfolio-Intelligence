$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)
$sb = New-Object System.Text.StringBuilder

$patterns = @("gemini", "google", "model", "api", "genai", "prompt", "flash", "pro")

foreach ($p in $patterns) {
    $regex = New-Object System.Text.RegularExpressions.Regex($p, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $matches = $regex.Matches($content)
    $sb.AppendLine("Pattern '$p' found $($matches.Count) times") | Out-Null
    
    $count = 0
    foreach ($m in $matches) {
        if ($count -ge 5) { break }
        $start = [Math]::Max(0, $m.Index - 500)
        $len = [Math]::Min($content.Length - $start, 1000)
        $sb.AppendLine("  Snippet at index $($m.Index):") | Out-Null
        $sb.AppendLine("  " + $content.Substring($start, $len)) | Out-Null
        $sb.AppendLine("  --------------------------------------") | Out-Null
        $count++
    }
}

[System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\gemini_search_output.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Search completed"
