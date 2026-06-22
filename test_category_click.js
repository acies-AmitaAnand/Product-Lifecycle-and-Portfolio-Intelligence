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

  console.log("Locating the Category Performance chart 'Beverages' click target...");
  // Find all elements containing 'Beverages' in chart labels/legend and click them.
  const beveragesTicks = await page.evaluateHandle(() => {
    const texts = Array.from(document.querySelectorAll('text, span, div, button'));
    // Look specifically for elements with textContent === 'Beverages' that are inside SVG or charts
    return texts.find(el => el.textContent === 'Beverages');
  });

  if (beveragesTicks) {
    const el = beveragesTicks.asElement();
    if (el) {
      await el.click();
      console.log("Clicked Beverages tick.");
    }
  } else {
    console.log("Could not find 'Beverages' target element.");
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log("Capturing screenshot of Category Performance Details Modal...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_category_details_modal.png' });
  console.log("Screenshot saved to screenshot_category_details_modal.png");

  // Verify modal expanded content
  const modalContent = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
    return modal ? modal.textContent : null;
  });

  if (modalContent) {
    console.log("--- Modal Content Found ---");
    console.log(modalContent);
    console.log("----------------------------");

    const hasTitle = modalContent.includes("Category Insight Briefing: Beverages");
    const hasTop = modalContent.includes("Top Performer (Good)") && modalContent.includes("Mango Fizz 500ml");
    const hasUnder = modalContent.includes("Underperformer (Poor)") && modalContent.includes("BrandA Premium Energy 250ml");
    const hasBooming = modalContent.includes("Booming (Market)") && modalContent.includes("Coconut Water Eco-Pack 1L");

    console.log("Validation checklist:");
    console.log("- Has Correct Title? ", hasTitle);
    console.log("- Has Top Performer (Mango Fizz)? ", hasTop);
    console.log("- Has Underperformer (BrandA)? ", hasUnder);
    console.log("- Has Booming SKU (Coconut Water)? ", hasBooming);

    if (hasTitle && hasTop && hasUnder && hasBooming) {
      console.log("SUCCESS: Category Performance details modal validated perfectly!");
    } else {
      console.error("FAIL: Mismatch in Category Performance details modal content.");
    }
  } else {
    console.error("FAIL: Category Details modal not open or visible.");
  }

  await browser.close();
}

run().catch(console.error);
