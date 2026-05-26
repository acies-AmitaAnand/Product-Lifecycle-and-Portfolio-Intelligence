js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\kpi_calc_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for computeKPIs
idx = js.find("function computeKPIs")
if idx != -1:
    summary.append("--- computeKPIs FUNCTION ---")
    summary.append(js[idx:idx+2500])

# Search for updateKPIs
idx = js.find("function updateKPIs")
if idx != -1:
    summary.append("--- updateKPIs FUNCTION ---")
    summary.append(js[idx:idx+2500])

# Search for renderTopSKUs
idx = js.find("function renderTopSKUs")
if idx != -1:
    summary.append("--- renderTopSKUs FUNCTION ---")
    summary.append(js[idx:idx+2000])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("KPI calculation summary written to", output_path)
