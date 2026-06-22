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
  await page.setViewport({ width: 1440, height: 1500 });

  console.log("Navigating to http://localhost:3001...");
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });

  console.log("Selecting VP Product Management role...");
  const cards = await page.$$('div.group');
  if (cards.length > 0) {
    await cards[0].click();
  }
  await new Promise(r => setTimeout(r, 2000));

  console.log("Clicking Launch Readiness tab...");
  const buttons = await page.$$('aside button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Launch Readiness')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }

  // Find and click the button with title="Table View"
  console.log("Finding Table View button inside AI Predictions...");
  const tableViewBtn = await page.waitForSelector('button[title="Table View"]');
  if (tableViewBtn) {
    console.log("Clicking Table View button...");
    await tableViewBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log("Table View button not found!");
  }

  const screenshotPath = path.join(brainDir, 'vp_launch_readiness_tab_table.png');
  console.log(`Taking screenshot: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved!");

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
