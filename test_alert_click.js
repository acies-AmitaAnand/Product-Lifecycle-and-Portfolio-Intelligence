import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  console.log("Navigating to staging dashboard...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', {
    waitUntil: 'networkidle2'
  });

  // Onboarding
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
    console.log("No onboarding found.");
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("Locating 'INVESTIGATE' button inside Smart Alerts...");
  
  // Find all elements containing 'Investigate' inside the alerts box
  const investigateButtons = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // Filter specifically for "Investigate" text buttons
    return buttons.filter(btn => btn.textContent && btn.textContent.trim() === 'Investigate');
  });

  const buttonsArray = await investigateButtons.getProperties();
  let clicked = false;
  for (const prop of buttonsArray.values()) {
    const el = prop.asElement();
    if (el) {
      const isVisible = await el.boundingBox();
      if (isVisible) {
        console.log("Clicking first visible Investigate button...");
        await el.click();
        clicked = true;
        break;
      }
    }
  }

  if (!clicked) {
    console.error("FAIL: Could not locate a visible Investigate button.");
    await browser.close();
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("Capturing screenshot of Smart Alert Briefing Modal...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_alert_details_modal.png' });
  console.log("Screenshot saved to screenshot_alert_details_modal.png");

  // Verify modal content
  const modalText = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
    return modal ? modal.textContent : null;
  });

  if (modalText) {
    console.log("--- Modal Content Found ---");
    console.log(modalText);
    console.log("----------------------------");

    const hasTitle = modalText.includes("Smart Alert Briefing");
    const hasImpact = modalText.includes("Impact Domain:");
    const hasSituation = modalText.includes("Situation Analysis");
    const hasFinancial = modalText.includes("Financial Implication");
    const hasRec = modalText.includes("Recommended Action Plan");

    console.log("Validation checklist:");
    console.log("- Has Briefing Title? ", hasTitle);
    console.log("- Has Impact Domain? ", hasImpact);
    console.log("- Has Situation Analysis? ", hasSituation);
    console.log("- Has Financial Implication? ", hasFinancial);
    console.log("- Has Action Plan? ", hasRec);

    if (hasTitle && hasImpact && hasSituation && hasFinancial && hasRec) {
      console.log("SUCCESS: Smart Alert details modal validated perfectly!");
    } else {
      console.error("FAIL: Mismatch in modal sections content.");
      process.exit(1);
    }
  } else {
    console.error("FAIL: Smart Alert details modal not open or visible.");
    process.exit(1);
  }

  await browser.close();
}

run().catch(console.error);
