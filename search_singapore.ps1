$dir = "C:\Users\Sree Vyshnavi\Desktop\Capstone\ILP_PPL_DashBoard\src"
$files = Get-ChildItem -Path $dir -Recurse -File -Include "*.ts", "*.tsx"
$sb = New-Object System.Text.StringBuilder

foreach ($f in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($f.FullName)
        if ($content.Contains("Singapore") -or $content.Contains("singapore")) {
            $sb.AppendLine("File: $($f.FullName)") | Out-Null
            $lines = Get-Content $f.FullName
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i].Contains("Singapore") -or $lines[$i].Contains("singapore")) {
                    $sb.AppendLine("  Line $($i+1): $($lines[$i].Trim())") | Out-Null
                }
            }
        }
    } catch {
        # ignore read errors
    }
}

[System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\singapore_search_output.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Search completed"
