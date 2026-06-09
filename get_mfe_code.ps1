$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$idx = $content.IndexOf("mfe=({activeKpi:")
if ($idx -ne -1) {
    $sub = $content.Substring($idx, 30000)
    [System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\mfe_code.txt", $sub, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote mfe code successfully starting at index $idx"
} else {
    Write-Output "Could not find mfe=({activeKpi:"
}
