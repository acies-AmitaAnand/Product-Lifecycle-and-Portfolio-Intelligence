import re

html_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"
js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)

# Script 1 is the large one (length ~69k)
large_script = ""
for scr in scripts:
    if len(scr) > 10000:
        large_script = scr
        break

if large_script:
    with open(js_path, "w", encoding="utf-8") as out:
        out.write(large_script)
    print("Large inline script extracted! Written to", js_path, "size:", len(large_script))
else:
    print("Could not find large script in HTML file.")
