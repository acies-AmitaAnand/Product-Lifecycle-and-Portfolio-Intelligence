with open("extracted_artifact_decoded.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for id="section-
import re
section_matches = re.findall(r'id="section-([^"]*)"', html)
print("Found section- matches:", section_matches)

summary = [f"Found section ids: {section_matches}"]

for sec_name in section_matches:
    full_id = f'id="section-{sec_name}"'
    idx = html.find(full_id)
    if idx != -1:
        # Let's find the start of the tag <div or whatever contains it
        tag_start = html.rfind("<", 0, idx)
        snippet = html[tag_start:tag_start+5000]
        summary.append(f"\n=========================================\nSECTION: {sec_name}\n=========================================\n{snippet}\n")

with open("sections_summary_fixed.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(summary))

print("Completed! Written to sections_summary_fixed.txt")
