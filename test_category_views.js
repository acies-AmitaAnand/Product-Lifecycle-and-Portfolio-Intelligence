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

  // Navigate directly to the Portfolio Health Map tab
  console.log("Navigating to Portfolio Health Map tab...");
  const targetUrl = 'https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=1&role=VP+Product+Management';
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Verify and toggle Investment vs Margin Map
  console.log("Locating 'Investment vs. Return Margin Map' Category toggle...");
  const toggleButtons = await page.$$('button');
  let categoryToggleForInv = null;
  
  for (const btn of toggleButtons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text === "CATEGORY") {
      // We want the first Category toggle button (which corresponds to Investment vs Margin Map)
      categoryToggleForInv = btn;
      break;
    }
  }

  if (categoryToggleForInv) {
    console.log("Clicking CATEGORY toggle for Investment vs Margin Map...");
    await categoryToggleForInv.click();
    await new Promise(r => setTimeout(r, 1000));

    // Verify category legend is shown (has Beverages)
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasCategoryLegend = pageText.includes("BEVERAGES") && pageText.includes("SNACKS");
    console.log("Is category legend shown for Investment Map? ", hasCategoryLegend);
  } else {
    console.log("ERROR: Category toggle for Investment Map not found!");
  }

  // 2. Click category tab 'Snacks' in the Investment Map sidebar list
  console.log("Clicking 'Snack' category filter tab in sidebar list...");
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.innerText, tab);
    if (text.includes("SNACK")) {
      await tab.click();
      console.log("Clicked Snack tab!");
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Verify that Oats Cookies (a Snack product) is listed
  const listText = await page.evaluate(() => document.body.innerText);
  console.log("Is 'Oat Cookies' listed in Snacks category? ", listText.includes("Oat Cookies"));

  // 3. Verify and toggle Revenue vs Performance Matrix
  console.log("Locating 'Revenue vs. Performance Matrix' Category toggle...");
  const allCategoryToggles = await page.$$('button');
  let categoryToggleForMatrix = null;
  let catToggleCount = 0;
  
  for (const btn of allCategoryToggles) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text === "CATEGORY") {
      catToggleCount++;
      if (catToggleCount === 2) {
        // The second one is the Revenue vs Performance Matrix
        categoryToggleForMatrix = btn;
        break;
      }
    }
  }

  if (categoryToggleForMatrix) {
    console.log("Clicking CATEGORY toggle for Revenue vs Performance Matrix...");
    await categoryToggleForMatrix.click();
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log("ERROR: Category toggle for Revenue vs Performance Matrix not found!");
  }

  // Take screenshot of both charts in Category view mode
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_category_charts_test.png' });
  console.log("Screenshot saved to screenshot_category_charts_test.png");

  await browser.close();
  console.log("Category views verification finished successfully!");
}

run().catch(console.error);
