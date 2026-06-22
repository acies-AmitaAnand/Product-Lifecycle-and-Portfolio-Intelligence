$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$idx = $content.IndexOf("Customer Sentiment Score")
if ($idx -ne -1) {
    $start = [Math]::Max(0, $idx - 15000)
    $sub = $content.Substring($start, 35000)
    [System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\ufe_code.txt", $sub, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote ufe code starting near index $start"
} else {
    Write-Output "Could not find Customer Sentiment Score"
}
