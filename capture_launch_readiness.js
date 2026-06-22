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
  await page.setViewport({ width: 1440, height: 1200 });

  page.on('console', msg => {
    console.log(`[BROWSER LOG]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGEERROR]:`, err);
  });

  console.log("Navigating to http://localhost:3001...");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  // 1. Wait for Welcome Gate to load
  console.log("Waiting for Welcome Gate...");
  await page.waitForSelector('h1', { timeout: 10000 });

  // 2. Select "VP Product Management" (first card)
  console.log("Selecting VP Product Management role...");
  const cards = await page.$$('div.group');
  if (cards.length > 0) {
    await cards[0].click();
  } else {
    console.log("Persona cards not found!");
  }
  await new Promise(r => setTimeout(r, 2000));

  // Verify we are inside the dashboard
  console.log("Checking if inside dashboard...");
  await page.waitForSelector('header', { timeout: 5000 });

  // Helper to click tabs
  async function clickTab(tabLabel) {
    console.log(`Clicking tab: ${tabLabel}`);
    const buttons = await page.$$('aside button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes(tabLabel)) {
        await btn.click();
        await new Promise(r => setTimeout(r, 2000));
        return;
      }
    }
    throw new Error(`Tab not found: ${tabLabel}`);
  }

  // 3. Go to Launch Readiness Tab
  await clickTab('Launch Readiness');

  // Take screenshot of the restored Launch Readiness tab
  const screenshotPath = path.join(brainDir, 'vp_launch_readiness_tab.png');
  console.log(`Taking screenshot: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved!");

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
