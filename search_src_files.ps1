$dir = "C:\Users\Sree Vyshnavi\Desktop\Capstone\ILP_PPL_DashBoard\src"
$files = Get-ChildItem -Path $dir -Recurse -File -Include "*.ts", "*.tsx", "*.css"
$sb = New-Object System.Text.StringBuilder

foreach ($f in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($f.FullName)
        if ($content.ToLower().Contains("bottleneck") -or $content.ToLower().Contains("gemini") -or $content.ToLower().Contains("model")) {
            $sb.AppendLine("File: $($f.FullName)") | Out-Null
            $lines = Get-Content $f.FullName
            for ($i = 0; $i -lt $lines.Count; $i++) {
                $lineLower = $lines[$i].ToLower()
                if ($lineLower.Contains("bottleneck") -or $lineLower.Contains("gemini") -or $lineLower.Contains("model")) {
                    $sb.AppendLine("  Line $($i+1): $($lines[$i].Trim())") | Out-Null
                }
            }
        }
    } catch {
        # ignore read errors
    }
}

[System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\src_search_output.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Search completed"
