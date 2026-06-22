import puppeteer from 'puppeteer';

async function runTest() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', (msg) => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    console.error(`[BROWSER EXCEPTION] ${err.toString()}`);
  });

  console.log("Navigating to staging dashboard...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', {
    waitUntil: 'networkidle2'
  });

  console.log("Taking screenshot of initial load...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_initial.png' });

  console.log("Clicking role card if onboarding is visible...");
  try {
    const selector = 'div.group';
    await page.waitForSelector(selector, { timeout: 4000 });
    console.log("Found WelcomeGate role cards. Clicking the first one...");
    
    const cards = await page.$$(selector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        console.log("Clicked VP Product Management role card.");
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log("No onboarding selector screen detected or timeout, checking for dashboard...");
  }

  console.log("Taking screenshot of dashboard load...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_dashboard.png' });

  console.log("Checking if 'Total Revenue' is on page...");
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasRevenue = bodyText.includes("Total Revenue");
  console.log("Contains 'Total Revenue'? ", hasRevenue);

  if (hasRevenue) {
    console.log("Locating 'Total Revenue' KPI card...");
    const elements = await page.$$('div.glass-card');
    let targetCard = null;

    for (const el of elements) {
      const text = await page.evaluate(element => element.innerText, el);
      if (text.includes("Total Revenue")) {
        targetCard = el;
        break;
      }
    }

    if (targetCard) {
      console.log("Clicking 'Total Revenue' card...");
      await targetCard.click();
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Taking screenshot after clicking card...");
      await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_after_click.png' });
    } else {
      console.log("Could not find card element containing 'Total Revenue'.");
    }
  }

  console.log("Closing browser...");
  await browser.close();
}

runTest().catch(console.error);
