import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER RUNTIME ERROR]', err.toString()));

  console.log("Navigating to http://localhost:3000/#tab=2&role=VP+Product+Management...");
  await page.goto('http://localhost:3000/#tab=2&role=VP+Product+Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // Verify Stage Gate Status Tracker dropdowns exist
  console.log("Locating the Stage Gate Status Tracker selectors...");
  const selects = await page.evaluate(() => {
    // Find all select elements inside the Stage Gate Status Tracker panel
    const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
    if (!trackerSpan) return [];
    const container = trackerSpan.closest('div');
    if (!container) return [];
    const parentBlock = container.parentElement;
    if (!parentBlock) return [];
    
    const selectElements = Array.from(parentBlock.querySelectorAll('select'));
    return selectElements.map((s, idx) => ({
      index: idx,
      value: s.value,
      options: Array.from(s.options).map(opt => opt.value || opt.text)
    }));
  });

  console.log("Tracker Selects Info:", JSON.stringify(selects, null, 2));

  if (selects.length < 2) {
    console.error("FAIL: Did not find both Category and Product dropdowns in Stage Gate Status Tracker.");
    process.exit(1);
  }

  const categorySelectVal = selects[0].value;
  const productSelectVal = selects[1].value;

  console.log(`Default Category: "${categorySelectVal}", Default Product: "${productSelectVal}"`);
  if (categorySelectVal !== "Beverages" || productSelectVal !== "LP01") {
    console.error("FAIL: Incorrect defaults for Category or Product selector.");
    process.exit(1);
  }

  // Test Case 1: Select "Snacks" category and check product selector updates
  console.log("\n--- Testing Select Category -> Updates Product dropdown ---");
  await page.evaluate(() => {
    const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
    const container = trackerSpan.closest('div');
    const parentBlock = container.parentElement;
    const selectElements = Array.from(parentBlock.querySelectorAll('select'));
    
    // Change Category to Snacks
    selectElements[0].value = 'Snacks';
    selectElements[0].dispatchEvent(new Event('change', { bubbles: true }));
  });

  await new Promise(r => setTimeout(r, 2000));

  const selectsAfterCatChange = await page.evaluate(() => {
    const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
    const container = trackerSpan.closest('div');
    const parentBlock = container.parentElement;
    const selectElements = Array.from(parentBlock.querySelectorAll('select'));
    return selectElements.map((s, idx) => ({
      index: idx,
      value: s.value,
      options: Array.from(s.options).map(opt => opt.value || opt.text)
    }));
  });

  console.log("Tracker Selects Info after Category -> Snacks:", JSON.stringify(selectsAfterCatChange, null, 2));

  const newCategoryVal = selectsAfterCatChange[0].value;
  const newProductVal = selectsAfterCatChange[1].value;

  if (newCategoryVal !== "Snacks" || newProductVal !== "LP02") {
    console.error("FAIL: Category or Product selector did not update correctly after selecting Snacks.");
    process.exit(1);
  }
  console.log("SUCCESS: Product dropdown correctly filtered to Snacks products, and selected first Snacks LP (LP02)!");

  // Test Case 2: Select a different product in the same category
  console.log("\n--- Testing Select Product -> Updates Stage Gates ---");
  await page.evaluate(() => {
    const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
    const container = trackerSpan.closest('div');
    const parentBlock = container.parentElement;
    const selectElements = Array.from(parentBlock.querySelectorAll('select'));
    
    // Select LP05 (another Snacks product)
    selectElements[1].value = 'LP05';
    selectElements[1].dispatchEvent(new Event('change', { bubbles: true }));
  });

  await new Promise(r => setTimeout(r, 2000));

  const selectedProductAfterChange = await page.evaluate(() => {
    const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
    const container = trackerSpan.closest('div');
    const parentBlock = container.parentElement;
    const selectElements = Array.from(parentBlock.querySelectorAll('select'));
    return selectElements[1].value;
  });

  if (selectedProductAfterChange !== "LP05") {
    console.error("FAIL: Product selector did not update to LP05.");
    process.exit(1);
  }
  console.log("SUCCESS: Selected Product updated to LP05.");

  // Test Case 3: Sync check when an external click updates the product (e.g. alert card click)
  console.log("\n--- Testing External Click (Alert card) -> Sync Category & Product selects ---");
  
  // Let's find an alert card that triggers a category change. 
  // Let's click on the first alert card if available, or force click an alert.
  // Wait, let's find the alert cards on the page.
  const alertClicked = await page.evaluate(() => {
    // Find alert items
    const alertDivs = Array.from(document.querySelectorAll('div.cursor-pointer'));
    // Find an alert that corresponds to a non-Snacks product (e.g., LP12 which is Household, or LP19/LP20 etc)
    // Actually let's look for any alert that contains a product name
    const alertItem = alertDivs.find(el => el.innerText && el.innerText.includes('LP12') || el.innerText.includes('Fabric Sheets'));
    if (alertItem) {
      alertItem.click();
      return true;
    }
    // Fallback: click any element that has product triggers
    return false;
  });

  console.log("Alert clicked: ", alertClicked);

  if (alertClicked) {
    await new Promise(r => setTimeout(r, 2000));

    const selectsAfterAlertClick = await page.evaluate(() => {
      const trackerSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim().includes("Stage Gate Status Tracker"));
      const container = trackerSpan.closest('div');
      const parentBlock = container.parentElement;
      const selectElements = Array.from(parentBlock.querySelectorAll('select'));
      return selectElements.map((s, idx) => ({
        index: idx,
        value: s.value,
        options: Array.from(s.options).map(opt => opt.value || opt.text)
      }));
    });

    console.log("Tracker Selects Info after Alert Click:", JSON.stringify(selectsAfterAlertClick, null, 2));

    const finalCategoryVal = selectsAfterAlertClick[0].value;
    const finalProductVal = selectsAfterAlertClick[1].value;

    if (finalCategoryVal !== "Household" || finalProductVal !== "LP12") {
      console.error("FAIL: Dropdowns did not synchronize to Household / LP12 after alert card click.");
      process.exit(1);
    }
    console.log("SUCCESS: Dropdowns correctly synchronized to Household/LP12!");
  } else {
    console.log("Skipping Alert Card click sync test (no matching alert card found on current page state).");
  }

  // Take screenshot for verification
  const screenshotPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_tracker_category_dropdown.png';
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to: ${screenshotPath}`);

  console.log("\nCategory/Product dropdown integration test completed successfully!");
  await browser.close();
}

run().catch(err => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
