import pypdf

reader = pypdf.PdfReader("docs/[Shared] Virtual Labs - Capstone Program Guidance.pdf")
text = ""
for i, page in enumerate(reader.pages):
    text += f"--- Page {i+1} ---\n"
    text += page.extract_text() or ""
    text += "\n"

with open("docs/capstone_guidance_text.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("PDF text extracted successfully to docs/capstone_guidance_text.txt")
