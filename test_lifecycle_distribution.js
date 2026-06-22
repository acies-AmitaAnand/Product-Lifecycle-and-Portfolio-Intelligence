import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1050 });

  // Test Case 1: VP View Lifecycle Health Panel
  console.log("Navigating to VP Product Management View...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Verify the circular progress and rating
  const panelExists = await page.evaluate(() => {
    const panels = Array.from(document.querySelectorAll('div'));
    const healthPanel = panels.find(el => el.innerText && el.innerText.includes("PORTFOLIO HEALTH SCORE") && el.innerText.includes("PRODUCT LIFECYCLE DISTRIBUTION"));
    return !!healthPanel;
  });
  console.log(`[TEST 1] Lifecycle Health Panel exists in VP View: ${panelExists}`);

  if (!panelExists) {
    throw new Error("Lifecycle Health Panel not found in VP View");
  }

  // Hover over the Decline card to trigger the popup
  console.log("Hovering over Decline card to verify popover...");
  const declineCard = await page.evaluateHandle(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    return divs.find(el => el.innerText && el.innerText.startsWith("DECLINE") && el.innerText.includes("SKUs"));
  });

  if (declineCard) {
    // Scroll into view
    await page.evaluate(el => el.scrollIntoView(), declineCard);
    await declineCard.hover();
    await new Promise(r => setTimeout(r, 1000));

    // Verify popover shows list of Decline SKUs
    const popoverData = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      // Find a div with a title or text of Decline SKUs (case insensitive check for uppercase CSS styling)
      const popover = elements.find(el => el.innerText && el.innerText.toUpperCase().includes("DECLINE SKUS"));
      return popover ? popover.innerText : null;
    });

    console.log(`[TEST 2] Hover popover content:`, popoverData ? popoverData.replace(/\n/g, ' | ') : 'Not found');
    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_lifecycle_hover.png' });
    console.log("Saved hover screenshot to screenshot_lifecycle_hover.png");
  } else {
    console.log("Decline card hover target not found");
  }

  // Test Case 2: Standard View & Dynamic Filters
  console.log("Switching role to Product Manager via Header dropdown...");
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const roleSelect = selects.find(sel => Array.from(sel.options).some(opt => opt.value === 'Product Manager'));
    if (roleSelect) {
      roleSelect.value = 'Product Manager';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  // Get initial Health Score
  const initialScore = await page.evaluate(() => {
    const scoreSpan = Array.from(document.querySelectorAll('span')).find(el => el.innerText && el.innerText.endsWith("%") && el.nextSibling && el.nextSibling.innerText === "HEALTH");
    return scoreSpan ? scoreSpan.innerText : 'Unknown';
  });
  console.log(`[TEST 3] Initial health score in standard view: ${initialScore}`);

  // Apply a filter (e.g., Category: Snacks)
  console.log("Filtering by Snacks category...");
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const catSelect = selects.find(sel => Array.from(sel.options).some(opt => opt.value === 'Snacks'));
    if (catSelect) {
      catSelect.value = 'Snacks';
      catSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Apply Filters
  const applyButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(el => el.innerText && el.innerText.includes("APPLY FILTERS"));
  });

  if (applyButton) {
    await applyButton.click();
    await new Promise(r => setTimeout(r, 1500));

    // Get new Health Score after filter
    const filteredScore = await page.evaluate(() => {
      const scoreSpan = Array.from(document.querySelectorAll('span')).find(el => el.innerText && el.innerText.endsWith("%") && el.nextSibling && el.nextSibling.innerText === "HEALTH");
      return scoreSpan ? scoreSpan.innerText : 'Unknown';
    });
    console.log(`[TEST 4] Health score after filtering Snacks: ${filteredScore}`);
    
    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_lifecycle_filtered.png' });
    console.log("Saved filtered screenshot to screenshot_lifecycle_filtered.png");
  } else {
    console.log("Apply Filters button not found");
  }

  await browser.close();
  console.log("Automation testing completed successfully.");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
