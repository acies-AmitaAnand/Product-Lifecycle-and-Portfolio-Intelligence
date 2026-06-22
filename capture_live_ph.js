import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  console.log("Navigating to live Vercel Portfolio Health page...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Select the VP role if welcome gate is shown
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

  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_live_vercel_ph.png' });
  console.log("Screenshot saved successfully.");
  await browser.close();
}

run().catch(console.error);
