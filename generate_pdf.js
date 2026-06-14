import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Launching browser for PDF generation...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load HTML guide
  const htmlPath = path.resolve(__dirname, 'portfolio_health_guide.html');
  const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;
  console.log(`Loading HTML from: ${fileUrl}`);

  await page.goto(fileUrl, { waitUntil: 'networkidle2' });

  // Generate PDF
  const pdfPath = path.resolve(__dirname, 'portfolio_health_guide.pdf');
  console.log(`Generating PDF to: ${pdfPath}`);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: {
      top: '0.75in',
      bottom: '0.75in',
      left: '0.75in',
      right: '0.75in'
    },
    printBackground: true,
    displayHeaderFooter: false
  });

  console.log("✅ SUCCESS: PDF generated successfully!");
  await browser.close();
}

run().catch(err => {
  console.error("❌ ERROR: Failed to generate PDF:", err);
  process.exit(1);
});
