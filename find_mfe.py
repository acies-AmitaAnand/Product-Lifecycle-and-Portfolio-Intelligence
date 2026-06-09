import re

path = r"C:\Users\Sree Vyshnavi\Desktop\Capstone\portfolio_intelligence.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for "activeKpi" to find where mfe is defined or used.
matches = [m.start() for m in re.finditer("activeKpi", content)]
print(f"Found activeKpi at positions: {matches}")

for pos in matches:
    start = max(0, pos - 1500)
    end = min(len(content), pos + 1500)
    print(f"\n--- Snippet around activeKpi at {pos} ---")
    print(content[start:end])

# Let's search for "Methodology & Lineage Audit" or "Methodology" or "Lineage Audit"
matches_audit = [m.start() for m in re.finditer("METHODOLOGY & LINEAGE AUDIT", content)]
print(f"Found METHODOLOGY & LINEAGE AUDIT at positions: {matches_audit}")

for pos in matches_audit:
    start = max(0, pos - 1500)
    end = min(len(content), pos + 1500)
    print(f"\n--- Snippet around METHODOLOGY at {pos} ---")
    print(content[start:end])
