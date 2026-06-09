import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  console.log("Navigating to http://localhost:5173...");
  await page.goto('http://localhost:5173/#tab=2&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Wait for role card click if onboarding page is shown
  try {
    const roleSelector = 'div.group';
    await page.waitForSelector(roleSelector, { timeout: 3000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        console.log("Clicked VP Product Management");
        break;
      }
    }
  } catch (e) {
    console.log("Onboarding not showing or skipped");
  }

  await new Promise(r => setTimeout(r, 3000));

  console.log("Capturing screenshot...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_local.png' });
  console.log("Saved screenshot to C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_local.png");

  await browser.close();
}

run().catch(console.error);
