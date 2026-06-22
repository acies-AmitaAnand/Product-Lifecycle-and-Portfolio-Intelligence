js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\sku_calc_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for scorePair
idx = js.find("function scorePair")
if idx != -1:
    summary.append("--- scorePair FUNCTION ---")
    summary.append(js[idx:idx+2500])

# Search for renderCannChart
idx = js.find("function renderCannChart")
if idx != -1:
    summary.append("--- renderCannChart FUNCTION ---")
    summary.append(js[idx:idx+2500])

# Search for renderPromoErosion
idx = js.find("function renderPromoErosion")
if idx != -1:
    summary.append("--- renderPromoErosion FUNCTION ---")
    summary.append(js[idx:idx+2500])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("SKU calculation summary written to", output_path)
