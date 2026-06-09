$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$idx = $content.IndexOf("Close Audit Drawer")
if ($idx -ne -1) {
    $start = [Math]::Max(0, $idx - 3000)
    $sub = $content.Substring($start, 25000)
    [System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\audit_drawer_code.txt", $sub, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote audit drawer code starting near index $start"
} else {
    Write-Output "Could not find Close Audit Drawer"
}
