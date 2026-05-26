import re

html_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"
results_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\inspect_results.txt"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

results = []

results.append("--- RECONSTRUCTED HTML FILE SIZE ---")
results.append(f"Size: {len(html)} chars\n")

# 1. Find all tab elements
tabs_raw = re.findall(r'<button[^>]*class="[^"]*tab[^"]*"[^>]*>(.*?)</button>', html, re.DOTALL)
results.append("--- TABS FOUND (Regex) ---")
for i, tab in enumerate(tabs_raw):
    clean_tab = re.sub(r'<[^>]*>', '', tab).strip()
    # Replace non-ascii chars or print them as-is since writing to file supports utf-8
    results.append(f"Tab {i}: {clean_tab}")

# 2. Find sections
sections_raw = re.finditer(r'<div[^>]*class="[^"]*section[^"]*"[^>]*id="([^"]*)"', html)
results.append("\n--- SECTIONS FOUND (Regex) ---")
for sec in sections_raw:
    sec_id = sec.group(1)
    results.append(f"Section ID: {sec_id}")

# 3. Find scripts
scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
results.append("\n--- INLINE SCRIPTS ---")
results.append(f"Found {len(scripts)} inline scripts.")
for i, scr in enumerate(scripts):
    results.append(f"\nScript {i} - size: {len(scr)} chars")
    vars_found = re.findall(r'(?:const|let|var)\s+(\w+)\s*=', scr)
    if vars_found:
        results.append(f"  Variables defined: {', '.join(vars_found[:20])}")
        if len(vars_found) > 20:
            results.append(f"  ... and {len(vars_found)-20} more")
    funcs = re.findall(r'function\s+(\w+)\s*\(', scr)
    if funcs:
        results.append(f"  Functions defined: {', '.join(funcs[:20])}")
        if len(funcs) > 20:
            results.append(f"  ... and {len(funcs)-20} more")

with open(results_path, "w", encoding="utf-8") as out:
    out.write("\n".join(results))

print("Inspection complete! Written results to", results_path)
