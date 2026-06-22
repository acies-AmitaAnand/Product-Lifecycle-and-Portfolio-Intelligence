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
  await page.goto('http://localhost:3000/', {
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

  console.log("Locating the 'Jan' tick...");
  const janTicks = await page.evaluateHandle(() => {
    const texts = Array.from(document.querySelectorAll('text, span, div, button'));
    return texts.find(el => el.textContent === 'Jan');
  });

  if (janTicks) {
    const el = janTicks.asElement();
    if (el) {
      await el.click();
      console.log("Clicked Jan tick.");
    }
  }

  await new Promise(r => setTimeout(r, 1500));

  console.log("Locating and clicking 'View Forecast Methodology & Key Drivers →' link...");
  const toggleLink = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('View Forecast Methodology'));
  });

  if (toggleLink) {
    const el = toggleLink.asElement();
    if (el) {
      await el.click();
      console.log("Clicked methodology toggle link.");
    }
  } else {
    console.error("Methodology toggle link not found!");
  }

  await new Promise(r => setTimeout(r, 1500));

  console.log("Capturing screenshot of expanded modal...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_modal_methodology.png' });
  console.log("Screenshot saved to screenshot_modal_methodology.png");

  // Verify modal expanded content
  const modalContent = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
    return modal ? modal.textContent : null;
  });

  if (modalContent) {
    console.log("--- Modal Content Found ---");
    const hasHoltWinters = modalContent.includes("Holt-Winters Projections");
    const hasDrivers = modalContent.includes("Prediction Methodology & Key Drivers");
    const hasPriorityMatrix = modalContent.includes("AI Recommendation Priority Matrix");
    const hasTopPriority = modalContent.includes("Top Priority");

    console.log("Validation checklist:");
    console.log("- Has Holt-Winters Projections? ", hasHoltWinters);
    console.log("- Has Prediction Drivers? ", hasDrivers);
    console.log("- Has AI Recommendation Priority Matrix (Should be false)? ", hasPriorityMatrix);
    console.log("- Has Top Priority Block (Should be false)? ", hasTopPriority);

    if (hasHoltWinters && hasDrivers && !hasPriorityMatrix && !hasTopPriority) {
      console.log("SUCCESS: Expandable Forecast Methodology is rendering perfectly without AI Priority Matrix!");
    } else {
      console.error("FAIL: Expandable methodology details are incorrect or missing.");
    }
  } else {
    console.error("FAIL: Modal not open or visible.");
  }

  await browser.close();
}

run().catch(console.error);
