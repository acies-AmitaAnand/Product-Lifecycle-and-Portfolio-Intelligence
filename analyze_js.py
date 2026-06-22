import re
import json

js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
analysis_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\analysis_output.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Let's extract array/object declarations using regex or simple search
# For example, const SKUS = [ ... ];
# We can search for the start of SKUS, signals, scenarios, etc.

summary = []

def extract_variable(var_name, count_chars=1000):
    idx = js.find(f"const {var_name}")
    if idx == -1:
        idx = js.find(f"let {var_name}")
    if idx == -1:
        idx = js.find(f"var {var_name}")
    
    if idx != -1:
        snippet = js[idx:idx+count_chars]
        return f"--- VARIABLE {var_name} ---\n{snippet}\n"
    return f"--- VARIABLE {var_name} NOT FOUND ---\n"

# Let's extract metadata and definitions
summary.append(extract_variable("SKUS", 3000))
summary.append(extract_variable("signals", 4000))
summary.append(extract_variable("scenarios", 3000))
summary.append(extract_variable("MONTHS", 500))
summary.append(extract_variable("CHANNELS", 500))

# Also search for the function switchSection to see how sections are switched
idx = js.find("function switchSection")
if idx != -1:
    summary.append(f"--- FUNCTION switchSection ---\n{js[idx:idx+1500]}\n")

idx = js.find("function switchTab")
if idx != -1:
    summary.append(f"--- FUNCTION switchTab ---\n{js[idx:idx+1500]}\n")

with open(analysis_path, "w", encoding="utf-8") as out:
    out.write("\n".join(summary))

print("JS analyzed! Results written to", analysis_path)
