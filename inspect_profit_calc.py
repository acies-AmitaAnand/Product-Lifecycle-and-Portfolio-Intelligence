js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\profit_calc_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for buildProfitTree
idx = js.find("function buildProfitTree")
if idx != -1:
    summary.append("--- buildProfitTree FUNCTION ---")
    summary.append(js[idx:idx+3500])

# Search for saveScenario
idx = js.find("function saveScenario")
if idx != -1:
    summary.append("--- saveScenario FUNCTION ---")
    summary.append(js[idx:idx+1500])

# Search for waterfall chart or chart-profit
idx = js.find("chart-profit")
if idx != -1:
    summary.append("--- chart-profit CONFIG ---")
    start = max(0, idx - 200)
    summary.append(js[start:start+2500])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("Profit calculation summary written to", output_path)
