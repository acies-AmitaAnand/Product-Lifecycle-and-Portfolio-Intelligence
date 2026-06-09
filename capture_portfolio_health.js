import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  await page.goto('http://localhost:5173/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  try {
    const roleSelector = 'div.group';
    await page.waitForSelector(roleSelector, { timeout: 3000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        break;
      }
    }
  } catch (e) {}

  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_portfolio_health.png' });
  await browser.close();
}

run().catch(console.error);
