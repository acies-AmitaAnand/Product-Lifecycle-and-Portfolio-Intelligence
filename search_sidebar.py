import re

html_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for class="sb-item" or all navigation button declarations
sb_items = re.findall(r'<button[^>]*class="[^"]*sb-item[^"]*"[^>]*>(.*?)</button>', html, re.DOTALL)
print("--- SIDEBAR NAV ITEMS ---")
for i, item in enumerate(sb_items):
    clean = re.sub(r'<[^>]*>', '', item).strip()
    # Check if there's any onclick or id
    onclick = re.findall(r'onclick="([^"]*)"', item)
    nav_id = re.findall(r'id="([^"]*)"', item)
    print(f"Item {i}: '{clean}' | OnClick: {onclick} | ID: {nav_id}")

# Let's search in the whole HTML for all button onclicks containing switchSection
switch_sections = re.findall(r'switchSection\(\'([^\']*)\'\)', html)
print("\nAll switchSection calls found:", list(set(switch_sections)))
