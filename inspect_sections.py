import re

html_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\sections_summary.txt"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for '<div class="section" id="section-...'
# We can find the starting and ending index of each section block
sections = re.findall(r'<div[^>]*class="[^"]*section[^"]*"[^>]*id="([^"]*)"', html)
print("Found sections in HTML:", sections)

summary = []
summary.append(f"Found sections: {sections}")

for sec_id in sections:
    # Find start index
    pattern = f'id="{sec_id}"'
    start_match = list(re.finditer(pattern, html))
    if not start_match:
        continue
    
    # We want to extract around 1000 characters of the section to see its markup structure
    start_pos = start_match[0].start()
    snippet = html[start_pos:start_pos+3000]
    summary.append(f"\n=========================================\nSECTION: {sec_id}\n=========================================\n{snippet}\n")

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n".join(summary))

print("Sections summary written to", output_path)
