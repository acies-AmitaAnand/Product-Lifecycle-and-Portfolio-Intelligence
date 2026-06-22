$dir = "C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence"
$files = Get-ChildItem -Path $dir -Recurse -File -Exclude "*.png", "*.jpg", "*.git", "*.json", "*.lock"
$sb = New-Object System.Text.StringBuilder

foreach ($f in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($f.FullName)
        if ($content.Contains("gemini") -or $content.Contains("Gemini") -or $content.Contains("genai") -or $content.Contains("GenAI")) {
            $sb.AppendLine("Found in file: $($f.Name)") | Out-Null
            $lines = Get-Content $f.FullName
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i].Contains("gemini") -or $lines[$i].Contains("Gemini") -or $lines[$i].Contains("genai") -or $lines[$i].Contains("GenAI")) {
                    $sb.AppendLine("  Line $($i+1): $($lines[$i])") | Out-Null
                }
            }
        }
    } catch {
        # ignore read errors
    }
}

[System.IO.File]::WriteAllText("C:\Users\Sree Vyshnavi\.gemini\antigravity\scratch\Product-Lifecycle-and-Portfolio-Intelligence\all_files_search_output.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Search completed"
