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

  console.log("Navigating to dashboard...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

  // Onboarding Screen
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
    console.log("No Welcome Gate screen found, continuing...");
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("Locating the Revenue Trend chart...");
  // Find all elements containing 'Jan' in chart ticks or click them.
  // Recharts uses SVG text for XAxis ticks. Let's find all svg text elements containing 'Jan'.
  const janTicks = await page.evaluateHandle(() => {
    const texts = Array.from(document.querySelectorAll('text, span, div, button'));
    // Find text containing exactly 'Jan' or close to it
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
      console.log("Could not convert handle to element.");
    }
  } else {
    console.log("Could not find 'Jan' tick on page.");
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("Taking screenshot after clicking 'Jan'...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_jan_click_modal.png' });
  console.log("Screenshot saved to screenshot_jan_click_modal.png");

  // Verify modal contents
  const modalText = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
    return modal ? modal.textContent : null;
  });

  if (modalText) {
    console.log("--- Modal Content Found ---");
    console.log(modalText);
    console.log("----------------------------");

    const hasTitle = modalText.includes("Strategic Forecast & Pricing Review: January");
    const hasLastYearActual = modalText.includes("Prior Year (Last Year) Sales");
    const hasNextYearForecast = modalText.includes("Next Year Forecast");
    const hasLastYearPrice = modalText.includes("Last Year Blended Price");
    const hasAIRecommendations = modalText.includes("AI Strategic Recommendations");

    console.log("Validation checklist:");
    console.log("- Has Correct Title? ", hasTitle);
    console.log("- Has Last Year Actual Sales? ", hasLastYearActual);
    console.log("- Has Next Year Forecast? ", hasNextYearForecast);
    console.log("- Has Last Year Price? ", hasLastYearPrice);
    console.log("- Has AI Recommendations? ", hasAIRecommendations);

    if (hasTitle && hasLastYearActual && hasNextYearForecast && hasLastYearPrice && hasAIRecommendations) {
      console.log("SUCCESS: All VP-level month forecast details are rendering perfectly!");
    } else {
      console.error("FAIL: Some key details are missing from the forecast modal.");
    }
  } else {
    console.error("FAIL: Trend month forecast modal did not open or is not visible.");
  }

  console.log("Closing browser...");
  await browser.close();
}

run().catch(console.error);
