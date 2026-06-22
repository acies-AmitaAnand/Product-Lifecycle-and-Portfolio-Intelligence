js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\vp_logic_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for initVPDashboard
idx = js.find("function initVPDashboard")
if idx != -1:
    summary.append("--- initVPDashboard FUNCTION ---")
    summary.append(js[idx:idx+4000])

# Search for vpRefresh
idx = js.find("function vpRefresh")
if idx != -1:
    summary.append("--- vpRefresh FUNCTION ---")
    summary.append(js[idx:idx+2000])

# Search for alert acknowledgement in vp-exec
idx = js.find("function vpAckAll")
if idx != -1:
    summary.append("--- vpAckAll FUNCTION ---")
    summary.append(js[idx:idx+1000])

# Let's search for Canvas context rendering for vp-rev-chart and vp-cat-chart
# E.g. getContext('2d')
idx = js.find("vp-rev-chart")
if idx != -1:
    summary.append("--- vp-rev-chart USAGE ---")
    # print around that area
    start = max(0, idx - 200)
    summary.append(js[start:start+2500])

idx = js.find("vp-cat-chart")
if idx != -1:
    summary.append("--- vp-cat-chart USAGE ---")
    start = max(0, idx - 200)
    summary.append(js[start:start+2500])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("VP Exec JS logic written to", output_path)
