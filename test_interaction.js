import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  console.log("Navigating to local dev server...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 4000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        console.log("Clicking role card: VP Product Management");
        await card.click();
        break;
      }
    }
  } catch (e) {
    console.log("No welcome gate role cards found, continuing...");
  }

  await new Promise(r => setTimeout(r, 2000));
  
  // Find KPI Card containing "TOTAL REVENUE" or "Total Revenue"
  console.log("Finding KPI cards...");
  const kpiCards = await page.$$('div.glass-card');
  console.log(`Found ${kpiCards.length} glass cards`);
  
  let targetCard = null;
  for (const card of kpiCards) {
    const text = await page.evaluate(el => el.innerText, card);
    if (text.toUpperCase().includes("TOTAL REVENUE")) {
      targetCard = card;
      console.log("Target card 'TOTAL REVENUE' text:", text.replace(/\n/g, ' '));
      break;
    }
  }

  if (targetCard) {
    console.log("Clicking 'TOTAL REVENUE' card...");
    await targetCard.click();
    await new Promise(r => setTimeout(r, 2500));
    
    // Check if AuditDrawer is visible
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Does page contain 'AI-Powered Insights'? ", bodyText.includes("AI-Powered Insights"));
    console.log("Does page contain 'Revenue MTD'? ", bodyText.includes("Revenue MTD"));
    
    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_after_click_local.png' });
    console.log("Screenshot saved to screenshot_after_click_local.png");
  } else {
    console.log("TOTAL REVENUE card not found.");
  }

  await browser.close();
}

run().catch(console.error);
