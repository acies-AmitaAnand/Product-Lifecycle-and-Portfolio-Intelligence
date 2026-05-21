import pypdf

reader = pypdf.PdfReader("docs/Initial Brief - Product Lifecycle and Portfolio Intelligence.md.pdf")
text = ""
for i, page in enumerate(reader.pages):
    text += f"--- Page {i+1} ---\n"
    text += page.extract_text() or ""
    text += "\n"

with open("docs/initial_brief_text.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("PDF text extracted successfully to docs/initial_brief_text.txt")
