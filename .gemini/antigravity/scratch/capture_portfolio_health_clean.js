import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });
  
  // Navigate to tab 1 (Portfolio Health Map) and set VP Product Management role
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Wait for page load
  await new Promise(r => setTimeout(r, 4000));

  const screenshotPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\vercel_portfolio_health_clean.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);
  
  await browser.close();
}

run().catch(console.error);
