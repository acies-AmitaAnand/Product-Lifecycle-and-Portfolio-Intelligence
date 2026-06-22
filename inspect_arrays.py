js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Let's search for vpAlerts and vpApprovals array definitions
import re
vp_alerts_match = re.search(r'let\s+vpAlerts\s*=\s*(\[.*?\]);', js, re.DOTALL)
if vp_alerts_match:
    print("--- vpAlerts DEFINITION ---")
    print(vp_alerts_match.group(1))
else:
    # search for vpAlerts in other formats
    idx = js.find("vpAlerts")
    if idx != -1:
        print("vpAlerts found. Snippet:")
        print(js[idx:idx+800])

print("\n" + "="*50 + "\n")

vp_appr_match = re.search(r'let\s+vpApprovals\s*=\s*(\[.*?\]);', js, re.DOTALL)
if vp_appr_match:
    print("--- vpApprovals DEFINITION ---")
    print(vp_appr_match.group(1))
else:
    idx = js.find("vpApprovals")
    if idx != -1:
        print("vpApprovals found. Snippet:")
        print(js[idx:idx+800])
