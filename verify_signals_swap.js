import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1600 }); // larger height to capture Row 4 and Row 5

  page.on('console', msg => console.log(`[BROWSER CONSOLE]: ${msg.text()}`));
  page.on('pageerror', err => console.error(`[BROWSER ERROR]:`, err));

  console.log("Navigating to http://localhost:3000/#tab=5&role=VP%20Product%20Management...");
  await page.goto('http://localhost:3000/#tab=5&role=VP%20Product%20Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  const screenshotPath = path.join(brainDir, 'signals_swap_verification.png');
  console.log(`Taking full page screenshot of Signals Board: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log("Signals Board screenshot saved!");

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
