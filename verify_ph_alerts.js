import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  console.log("Navigating to local Portfolio Health tab...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', {
    waitUntil: 'networkidle2'
  });

  // Onboarding
  console.log("Selecting VP Product Management role...");
  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 5000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        break;
      }
    }
  } catch (e) {
    console.log("No onboarding found.");
  }

  await new Promise(r => setTimeout(r, 3000));

  // Screenshot the Portfolio Health Map with the new alerts
  const tabScreenshot = path.join(brainDir, 'portfolio_health_alerts.png');
  console.log(`Taking Portfolio Health alerts screenshot: ${tabScreenshot}`);
  await page.screenshot({ path: tabScreenshot, fullPage: true });

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
