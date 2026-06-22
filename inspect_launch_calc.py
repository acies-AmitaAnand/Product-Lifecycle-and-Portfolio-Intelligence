js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\launch_calc_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for scoreLaunch
idx = js.find("function scoreLaunch")
if idx != -1:
    summary.append("--- scoreLaunch FUNCTION ---")
    summary.append(js[idx:idx+3500])

# Search for resetLaunch
idx = js.find("function resetLaunch")
if idx != -1:
    summary.append("--- resetLaunch FUNCTION ---")
    summary.append(js[idx:idx+1000])

# Search for renderRadar or radar chart config
idx = js.find("chart-radar")
if idx != -1:
    summary.append("--- chart-radar CONFIG ---")
    start = max(0, idx - 200)
    summary.append(js[start:start+2500])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("Launch calculation summary written to", output_path)
