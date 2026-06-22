import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1050 });

  // Forward console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // ==========================================
  // Test Case 1: VP View Matrix Verification
  // ==========================================
  console.log("Navigating to VP Product Management View...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Verify matrix title is rendered in VP view
  const hasTitleVP = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.some(s => s.innerText && s.innerText.toUpperCase().includes("REVENUE VS. PERFORMANCE MATRIX"));
  });
  console.log(`[TEST 1] Revenue vs. Performance Matrix rendered in VP View: ${hasTitleVP}`);
  if (!hasTitleVP) {
    throw new Error("Revenue vs. Performance Matrix not found in VP View");
  }

  // Click on first SKU card (Mango Fizz 500ml or Oat Cookies)
  console.log("Clicking SKU card to open SKU Details Modal in VP view...");
  const openedModalVP = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h4'));
    const heading = headings.find(h => h.innerText && h.innerText.toUpperCase().includes('MANGO FIZZ 500ML') || h.innerText.toUpperCase().includes('OAT COOKIES'));
    if (heading) {
      heading.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 2] Opened SKU Details modal in VP view: ${openedModalVP}`);
  if (!openedModalVP) {
    throw new Error("Could not click on first SKU card in VP view");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Close SKU details modal
  console.log("Closing SKU Details Modal in VP view...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'CLOSE ANALYSIS');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click 'Authorize Strategy' button and verify Toast in VP view
  console.log("Clicking 'Authorize Strategy' button in VP view...");
  const toastMessageVP = await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const authBtn = buttons.find(btn => btn.innerText.toUpperCase().includes("AUTHORIZE STRATEGY"));
    if (authBtn) {
      authBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      // Look for toasts
      const toast = Array.from(document.querySelectorAll('div')).find(div => div.innerText && div.innerText.toUpperCase().includes("STRATEGY ACTIVE"));
      return toast ? toast.innerText.replace(/\n/g, ' | ') : 'Toast not found';
    }
    return 'Authorize button not found';
  });
  console.log(`[TEST 3] Toast notification output in VP view: ${toastMessageVP}`);
  if (toastMessageVP === 'Toast not found' || toastMessageVP === 'Authorize button not found') {
    throw new Error(`Failed to authorize strategy or get toast in VP view: ${toastMessageVP}`);
  }

  // Save screenshot of VP view matrix to scratch
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_rev_perf_vp.png' });
  console.log("Saved VP view screenshot to scratch folder");

  // Save screenshot of VP view matrix to brain artifact folder
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\screenshot_rev_perf_vp.png' });
  console.log("Saved VP view screenshot to brain artifact folder");

  // ==========================================
  // Test Case 2: PM View Sub-tab Navigation
  // ==========================================
  console.log("Switching role to Product Manager...");
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const roleSelect = selects.find(sel => Array.from(sel.options).some(opt => opt.value === 'Product Manager'));
    if (roleSelect) {
      roleSelect.value = 'Product Manager';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  // Click on "Revenue vs Performance" sub-tab
  console.log("Clicking on 'Revenue vs Performance' sub-tab in PM view...");
  const clickedSubTab = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const subTabBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'REVENUE VS PERFORMANCE');
    if (subTabBtn) {
      subTabBtn.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 4] Clicked sub-tab in PM view: ${clickedSubTab}`);
  if (!clickedSubTab) {
    throw new Error("Could not find or click 'Revenue vs Performance' sub-tab in PM view");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Verify matrix title is rendered in PM view
  const hasTitlePM = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.some(s => s.innerText && s.innerText.toUpperCase().includes("REVENUE VS. PERFORMANCE MATRIX"));
  });
  console.log(`[TEST 5] Revenue vs. Performance Matrix rendered in PM View: ${hasTitlePM}`);
  if (!hasTitlePM) {
    throw new Error("Revenue vs. Performance Matrix not found in PM View");
  }

  // Save screenshot of PM view matrix to scratch
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_rev_perf_pm.png' });
  console.log("Saved PM view screenshot to scratch folder");

  // Save screenshot of PM view matrix to brain artifact folder
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\screenshot_rev_perf_pm.png' });
  console.log("Saved PM view screenshot to brain artifact folder");

  await browser.close();
  console.log("All Revenue vs Performance Matrix tests completed successfully!");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
