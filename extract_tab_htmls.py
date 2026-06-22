import re
import os

html_path = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_artifact_decoded.html"
tabs_dir = r"C:\Users\Amita\Downloads\ILP_PPL_DashBoard-main\ILP_PPL_DashBoard-main\extracted_tabs"

if not os.path.exists(tabs_dir):
    os.makedirs(tabs_dir)

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# main section ids in the HTML:
sections = ['vp-exec', 'portfolio', 'launch', 'profitability', 'sku', 'signals']

for sec in sections:
    # Let's find the div with id="section-{sec}" or id="{sec}"
    # Wait, in the code we saw id="section-portfolio", id="section-launch" etc., and id="section-vp-exec"
    full_id = f'id="section-{sec}"'
    idx = html.find(full_id)
    if idx == -1:
        # maybe it's just id="{sec}"
        full_id = f'id="{sec}"'
        idx = html.find(full_id)
    
    if idx != -1:
        # We need to find the matching closing div for this section.
        # Since the section is a top-level div, let's write a simple tag-balancer to extract it
        # Start looking from the '<div' before the id match
        tag_start = html.rfind("<div", 0, idx)
        if tag_start == -1:
            tag_start = html.rfind("<section", 0, idx)
        
        if tag_start != -1:
            # tag balancer
            pos = tag_start
            depth = 0
            # Let's scan forward and balance divs
            # For simplicity, we can count '<div' and '</div'
            # Or we can write a simple state machine:
            # When we see '<div', depth += 1. When we see '</div', depth -= 1.
            # If depth == 0, we have found the end of the section!
            in_tag = False
            tag_name = ""
            tag_content = ""
            
            # Let's do a simple count of <div and </div using regex finditer from tag_start
            # but wait, there could be other tags, so we should be careful.
            # A robust div matching loop:
            depth = 0
            end_pos = -1
            # Let's find matches of '<div' and '</div' in the substring starting from tag_start
            matches = list(re.finditer(r'<(div|/div)(?:\s|>|$)', html[tag_start:]))
            for m in matches:
                m_type = m.group(1)
                if m_type == 'div':
                    depth += 1
                elif m_type == '/div':
                    depth -= 1
                    if depth == 0:
                        end_pos = tag_start + m.end()
                        break
            
            if end_pos != -1:
                section_html = html[tag_start:end_pos]
                out_file = os.path.join(tabs_dir, f"{sec}.html")
                with open(out_file, "w", encoding="utf-8") as out:
                    out.write(section_html)
                print(f"Extracted section '{sec}' -> {out_file} (size: {len(section_html)} chars)")
            else:
                # fallback: write 15000 chars
                section_html = html[tag_start:tag_start+15000]
                out_file = os.path.join(tabs_dir, f"{sec}_fallback.html")
                with open(out_file, "w", encoding="utf-8") as out:
                    out.write(section_html)
                print(f"Extracted section '{sec}' (fallback) -> {out_file}")
        else:
            print(f"Could not find tag start for section '{sec}'")
    else:
        print(f"Section ID 'section-{sec}' or '{sec}' not found in HTML")
