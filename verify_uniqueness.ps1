$path = "C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
$content = [System.IO.File]::ReadAllText($path)

$pattern = [regex]'n==="action"&&'
$matches = $pattern.Matches($content)
Write-Output "Found n==='action'&& $($matches.Count) times"

foreach ($m in $matches) {
    Write-Output "Match at index $($m.Index):"
    Write-Output $content.Substring($m.Index, 300)
    Write-Output "--------------------"
}
