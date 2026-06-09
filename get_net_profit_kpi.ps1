$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$idx = $content.IndexOf("`"Net Profit`":")
if ($idx -eq -1) {
    $idx = $content.IndexOf("'Net Profit':")
}
if ($idx -eq -1) {
    $idx = $content.IndexOf("Net Profit")
}

if ($idx -ne -1) {
    # Let's search for Net Profit in the context of ufe. ufe has keys like "Overall Readiness %", "Net Profit", etc.
    # Let's grab 5000 characters around the match to see the full entry.
    $start = [Math]::Max(0, $idx - 500)
    $sub = $content.Substring($start, 5000)
    [System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\net_profit_kpi.txt", $sub, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote Net Profit KPI definition starting near index $start"
} else {
    Write-Output "Could not find Net Profit"
}
