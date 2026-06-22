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

  page.on('console', msg => console.log(`[BROWSER CONSOLE]: ${msg.text()}`));
  page.on('pageerror', err => console.error(`[BROWSER ERROR]:`, err));

  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  console.log("Selecting VP Product Management role...");
  const cards = await page.$$('div.group');
  if (cards.length > 0) {
    await cards[0].click();
  }
  await new Promise(r => setTimeout(r, 2000));

  console.log("Navigating to SKU Rationalize tab...");
  const buttons = await page.$$('aside button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('SKU Rationalize')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 2500));
      break;
    }
  }

  // Get active view buttons
  console.log("Finding switcher buttons in SkuToolbar...");
  const switcherBtns = await page.$$('button');
  let clicked = false;
  for (const btn of switcherBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    console.log("Found button text:", text);
    if (text.includes('Simplify to Grow')) {
      console.log("Clicking Simplify to Grow switcher button!");
      await btn.click();
      clicked = true;
      await new Promise(r => setTimeout(r, 3000));
      break;
    }
  }

  if (!clicked) {
    console.log("WARNING: Did not find Simplify to Grow switcher button!");
  }

  const screenshotPath = path.join(brainDir, 'simplify_grow_verification.png');
  console.log(`Taking screenshot: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved!");

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
