import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });
  
  console.log("On page:", await page.evaluate(() => document.body.innerText.substring(0, 500)));

  const selector = 'div.group';
  try {
    await page.waitForSelector(selector, { timeout: 4000 });
    const cards = await page.$$(selector);
    console.log(`Found ${cards.length} role cards`);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        console.log("Clicking role card: VP Product Management");
        await card.click();
        break;
      }
    }
  } catch (e) {
    console.log("No onboarding role cards found");
  }

  await new Promise(r => setTimeout(r, 3000));
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("--- FULL BODY TEXT ---");
  console.log(bodyText);
  console.log("----------------------");

  await browser.close();
}

run().catch(console.error);
