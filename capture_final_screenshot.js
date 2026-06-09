import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

  // Onboarding
  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 4000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        break;
      }
    }
  } catch (e) {}
  await new Promise(r => setTimeout(r, 2000));

  console.log("Capturing dashboard screenshot...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_dashboard_final.png' });
  console.log("Screenshot saved to screenshot_dashboard_final.png");

  await browser.close();
}

run().catch(console.error);
