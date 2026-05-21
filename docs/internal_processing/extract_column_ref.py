import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            tree = ET.parse(docx.open('word/document.xml'))
            root = tree.getroot()
            text = ""
            # The namespaces are usually:
            # {http://schemas.openxmlformats.org/wordprocessingml/2006/main}p
            # {http://schemas.openxmlformats.org/wordprocessingml/2006/main}t
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            for node in root.iter():
                if node.tag.endswith('}t'):
                    text += node.text or ""
                elif node.tag.endswith('}p') or node.tag.endswith('}row') or node.tag.endswith('}tr'):
                    text += "\n"
            return text
    except Exception as e:
        return f"Error: {e}"

text = get_docx_text(r'c:\Users\Jaiadithya\Personal_Work_Related\SPS Agentic Bus\agentic_bus_PPL\docs\FMCG Multi-Country Sales Dataset — Column Reference.docx')
with open(r'c:\Users\Jaiadithya\Personal_Work_Related\SPS Agentic Bus\agentic_bus_PPL\docs\internal_processing\column_reference_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Extracted text successfully, length:", len(text))
print("Preview:")
print(text[:2000])
