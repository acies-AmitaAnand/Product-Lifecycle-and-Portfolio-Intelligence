js_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_logic.js"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\signals_calc_summary.txt"

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

summary = []

# Search for addSignal
idx = js.find("function addSignal")
if idx != -1:
    summary.append("--- addSignal FUNCTION ---")
    summary.append(js[idx:idx+2000])

# Search for ackSignal
idx = js.find("function ackSignal")
if idx != -1:
    summary.append("--- ackSignal FUNCTION ---")
    summary.append(js[idx:idx+1000])

# Search for renderSignalTimeline or chart-signal-timeline
idx = js.find("chart-signal-timeline")
if idx != -1:
    summary.append("--- chart-signal-timeline CONFIG ---")
    start = max(0, idx - 200)
    summary.append(js[start:start+2500])

# Search for inbox-messages or renderInbox
idx = js.find("function renderInbox")
if idx != -1:
    summary.append("--- renderInbox FUNCTION ---")
    summary.append(js[idx:idx+2000])

with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n\n".join(summary))

print("Signals calculation summary written to", output_path)
