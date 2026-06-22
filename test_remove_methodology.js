import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER RUNTIME ERROR]', err.toString()));

  console.log("Navigating to live Vercel site...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=0&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  console.log("Waiting for chart to render...");
  await new Promise(r => setTimeout(r, 2000));

  try {
    const janTicks = await page.evaluateHandle(() => {
      const texts = Array.from(document.querySelectorAll('text, span, div, button'));
      const match = texts.find(el => el.textContent === 'Jan');
      return match;
    });

    if (janTicks) {
      console.log("Found 'Jan' tick element. Clicking it...");
      const janEl = janTicks.asElement();
      if (janEl) {
        await janEl.click();
        console.log("Clicked Jan tick.");
      } else {
        console.error("Could not convert handle to element.");
      }
    } else {
      console.error("Could not find 'Jan' tick on page.");
    }

    // Wait for modal to open
    await page.waitForSelector('.fixed.inset-0', { timeout: 4000 });

    // Verify modal content
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Does page contain 'Strategic Forecast & Pricing Review: January'? ", bodyText.includes("Strategic Forecast & Pricing Review: January"));
    console.log("Does page contain 'View Forecast Methodology & Key Drivers'? ", bodyText.includes("View Forecast Methodology & Key Drivers"));
    
    // Take screenshot of modal
    const screenshotPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\vercel_modal_no_methodology.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot to: ${screenshotPath}`);
  } catch (e) {
    console.error("Error clicking chart or verifying modal:", e.message);
  }

  await browser.close();
}

run().catch(console.error);
