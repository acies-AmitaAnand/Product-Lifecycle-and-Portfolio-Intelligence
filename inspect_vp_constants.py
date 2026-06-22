js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\vp_constants_output.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

def find_const(name):
    idx = js.find(name)
    if idx != -1:
        summary.append(f"--- CONSTANT {name} ---")
        start = max(0, idx - 50)
        summary.append(js[start:start+1500])
        summary.append("\n" + "="*50 + "\n")
    else:
        summary.append(f"CONSTANT {name} not found")

find_const("VP_ALERTS")
find_const("VP_APPROVALS")
find_const("VP_KPI_BASE")

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("VP constants written to", output_path)
