import re
import json

content_path = r"C:\Users\Amita\.gemini\antigravity\brain\b74d4ee7-8698-4d96-b005-78a14541a707\.system_generated\steps\509\content.md"
output_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"

with open(content_path, "r", encoding="utf-8") as f:
    text = f.read()

# Let's find all next_f pushes
# They look like: self.__next_f.push([1,"..."])
# The string part contains unicode escaped HTML, e.g., \u003c!DOCTYPE html\u003e
# We can find all instances of strings in the pushes and concatenate them.

# A simple way is to find all self.__next_f.push([1,"..."]) blocks
# Let's use a regex to find all self.__next_f.push([1,"<string>"]) patterns or similar.
# Since the text is huge, let's look at all occurrences of self.__next_f.push
pushes = re.findall(r'self\.__next_f\.push\(\[\d+,\s*"(.*?)"\]\)', text)
print("Found pushes:", len(pushes))

full_reconstructed = ""
for push in pushes:
    # Decode double escaped strings
    # We can use codecs.escape_decode or json.loads to decode the unicode escape sequences
    # Let's clean the string and decode it
    # We can wrap it in double quotes and parse with json.loads
    try:
        # replace double quotes with \" and wrap in double quotes
        # but wait, push already has escaped quotes. Let's make it a valid json string
        json_str = f'"{push}"'
        decoded = json.loads(json_str)
        full_reconstructed += decoded
    except Exception as e:
        # fallback string replacement
        s = push.replace('\\u003c', '<').replace('\\u003e', '>').replace('\\"', '"').replace('\\\\', '\\').replace('\\n', '\n')
        full_reconstructed += s

# Let's look for html tag in full_reconstructed
html_start = full_reconstructed.find("<!DOCTYPE html>")
if html_start == -1:
    html_start = full_reconstructed.find("<html")

if html_start != -1:
    html_data = full_reconstructed[html_start:]
    # Check if there is trailing next_f or other react garbage
    # Let's see if there is </html>
    html_end = html_data.find("</html>")
    if html_end != -1:
        html_data = html_data[:html_end + 7]
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(html_data)
    print("Decoded HTML written to", output_path)
    print("Decoded HTML size:", len(html_data))
    # Let's print the first 500 characters
    print("Preview:\n", html_data[:500])
else:
    print("Could not find HTML structure in decoded chunks.")
    # Let's write the whole decoded text to check what it is
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(full_reconstructed)
    print("Wrote whole decoded text to", output_path, "size:", len(full_reconstructed))
