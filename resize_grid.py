with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Replace the grid container line (around line 752)
for i in range(745, 760):
    if 'Middle: KPI Cards Grid' in lines[i-1]:
        if 'max-w-[380px]' not in lines[i]:
            lines[i] = lines[i].replace('grid grid-cols-2 gap-4', 'grid grid-cols-2 gap-4 max-w-[380px] mx-auto')
            print("Grid container updated successfully on line:", i+1)
            break

with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
