import re

with open("docs/capstone_guidance_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Collapse all whitespace (newlines, carriage returns, tabs, spaces) into a single space
collapsed = re.sub(r'\s+', ' ', text)

with open("docs/capstone_guidance_collapsed.txt", "w", encoding="utf-8") as f:
    f.write(collapsed)

# Search for keywords
keywords = [
    "portfolio health",
    "launch readiness",
    "profitability tree",
    "sku rationalization",
    "signals board",
    "supply chain",
    "complexity",
    "lifecycle"
]

results = []
for kw in keywords:
    # Find all occurrences of kw in collapsed (case-insensitive)
    for match in re.finditer(re.escape(kw), collapsed, re.IGNORECASE):
        start = max(0, match.start() - 150)
        end = min(len(collapsed), match.end() + 150)
        context = collapsed[start:end]
        results.append(f"Keyword: '{kw}' found at position {match.start()}\nContext: ... {context} ...\n")

with open("docs/guidance_collapsed_search.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print(f"Done. Found {len(results)} matches. Results written to docs/guidance_collapsed_search.txt")
