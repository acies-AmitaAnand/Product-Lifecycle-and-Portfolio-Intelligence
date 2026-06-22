data_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\src\constants\data.ts"

with open(data_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Original lines:", len(lines))

# We want to remove the duplicate declarations.
# Let's see where the duplicates are.
# In the lint output:
# Line 274: Cannot redeclare block-scoped variable 'SKUS'.
# Line 289: Cannot redeclare block-scoped variable 'VP_ALERTS'.
# Line 298: Cannot redeclare block-scoped variable 'VP_APPROVALS'.
# Line 304: Cannot redeclare block-scoped variable 'VP_FORECAST'.
# This means there is a second set of these variables declared from line 274 onwards!
# Let's inspect what is in lines 270 to 320 in the file.
# Let's print them to a temporary file.

with open("temp_lines.txt", "w", encoding="utf-8") as out:
    for idx, line in enumerate(lines):
        out.write(f"{idx+1}: {line}")

print("Lines written to temp_lines.txt")
