import re

with open("docs/capstone_guidance_text.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Replace multiple spaces with a single space
clean_content = re.sub(r' +', ' ', content)

with open("docs/capstone_guidance_text_clean.txt", "w", encoding="utf-8") as f:
    f.write(clean_content)

search_terms = ["supply chain", "complexity", "portfolio", "tab"]
lines = clean_content.split('\n')
matches = []
for i, line in enumerate(lines):
    for term in search_terms:
        if term in line.lower():
            matches.append((i+1, term, line))
            break

with open("docs/search_results.txt", "w", encoding="utf-8") as f:
    f.write(f"Found {len(matches)} matches:\n")
    for line_no, term, text in matches:
        f.write(f"L{line_no} [{term}]: {text}\n")

print("Matches written to docs/search_results.txt")
