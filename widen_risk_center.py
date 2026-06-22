with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Update Left column span (around line 712)
for i in range(710, 715):
    if 'Left: Overall Launch Readiness' in lines[i-1] or 'Overall Launch Readiness Gauge' in lines[i-1]:
        lines[i] = lines[i].replace('xl:col-span-3 lg:col-span-4', 'xl:col-span-2 lg:col-span-3')
        print("Updated Left column span on line:", i+1)
        break

# 2. Update Middle column span (around line 752)
for i in range(745, 760):
    if 'Middle: KPI Cards Grid' in lines[i-1]:
        lines[i] = lines[i].replace('xl:col-span-6 lg:col-span-8', 'xl:col-span-6 lg:col-span-9')
        print("Updated Middle column span on line:", i+1)
        break

# 3. Update Right column span (around line 851)
for i in range(845, 855):
    if 'Right: Risk & Escalation Center' in lines[i-1]:
        lines[i] = lines[i].replace('xl:col-span-3 lg:col-span-12', 'xl:col-span-4 lg:col-span-12')
        print("Updated Right column span on line:", i+1)
        break

with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
