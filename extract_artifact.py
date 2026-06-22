import re

content_path = r"C:\Users\Amita\.gemini\antigravity\brain\b74d4ee7-8698-4d96-b005-78a14541a707\.system_generated\steps\167\content.md"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact.html"

with open(content_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Number of lines:", len(lines))

# The HTML content should be around line 10 (0-indexed line 9 or 10)
# Let's search for '<!DOCTYPE html>' or '<html'
html_content = ""
for line in lines:
    if "<!DOCTYPE html>" in line or "<html" in line:
        # Get everything from '<!DOCTYPE html>' onwards
        idx = line.find("<!DOCTYPE html>")
        if idx != -1:
            html_content = line[idx:]
        else:
            idx = line.find("<html")
            if idx != -1:
                html_content = line[idx:]
        break

if html_content:
    # If the HTML is followed by self.__next_f.push or similar scripts, let's extract only the HTML or clean it up
    # In Next.js artifacts, the public artifact is usually embedded in a JS string inside a script tag or next data.
    # Let's see if there is a clean HTML string.
    # Next.js page data has the full HTML string or the artifact body.
    # Let's inspect if the HTML string is a standalone HTML document.
    # If it is, let's write it to the output.
    # Let's write the whole found html_content first to check its structure.
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(html_content)
    print("HTML Content extracted and written to", output_path)
    print("Size of extracted HTML:", len(html_content))
else:
    print("Could not find HTML start in content.md lines")
