$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$idx = $content.IndexOf("ufe={")
if ($idx -eq -1) {
    $idx = $content.IndexOf("ufe = {")
}
if ($idx -eq -1) {
    # Let's search for "ufe=" where it might be minified
    $idx = $content.IndexOf("ufe=")
}

if ($idx -ne -1) {
    $start = $idx
    $sub = $content.Substring($start, 25000)
    [System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\ufe_details.txt", $sub, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote ufe details starting at index $start"
} else {
    Write-Output "Could not find ufe="
}
