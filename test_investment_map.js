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

  // Test Case 1: VP View Investment vs Margin Quadrant Map
  console.log("Navigating to VP Product Management View...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Check if Investment vs. Return Margin Map title is present
  const hasTitle = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.some(s => s.innerText && s.innerText.toUpperCase().includes("INVESTMENT VS. RETURN MARGIN MAP"));
  });
  console.log(`[TEST 1] Investment vs. Return Margin Map title rendered: ${hasTitle}`);
  if (!hasTitle) {
    throw new Error("Investment vs. Return Margin Map title not found");
  }

  // Click on Herbal Shampoo in the list
  console.log("Clicking 'Herbal Shampoo' in Quick Wins list to open SKU Details Modal...");
  const openedModal = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h4'));
    const herbalShampooHeading = headings.find(h => h.innerText && h.innerText.toUpperCase().trim() === 'HERBAL SHAMPOO');
    if (herbalShampooHeading) {
      herbalShampooHeading.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 2] Opened SKU Details modal: ${openedModal}`);
  if (!openedModal) {
    throw new Error("Could not click Herbal Shampoo");
  }

  await new Promise(r => setTimeout(r, 1500));

  // Verify modal is open showing Herbal Shampoo
  const modalTitle = await page.evaluate(() => {
    const modalContainers = Array.from(document.querySelectorAll('div.fixed.inset-0'));
    const modalContainer = modalContainers.find(el => el.innerText && el.innerText.toUpperCase().includes("QTD REVENUE"));
    if (!modalContainer) return 'None';
    const header = modalContainer.querySelector('h2');
    return header ? header.innerText.toUpperCase().trim() : 'None';
  });
  console.log(`[TEST 3] Modal SKU Title: ${modalTitle}`);
  if (modalTitle !== 'HERBAL SHAMPOO') {
    throw new Error(`Expected modal title 'HERBAL SHAMPOO', got '${modalTitle}'`);
  }

  // Close SKU details modal
  console.log("Closing SKU Details Modal...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'CLOSE ANALYSIS');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Approve Investment and verify Toast
  console.log("Clicking 'Approve Investment' button...");
  const toastMessage = await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const approveBtn = buttons.find(btn => btn.innerText.toUpperCase().includes("APPROVE INVESTMENT"));
    if (approveBtn) {
      approveBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      // Look for toasts
      const toast = Array.from(document.querySelectorAll('div')).find(div => div.innerText && div.innerText.toUpperCase().includes("INVESTMENT APPROVED"));
      return toast ? toast.innerText.replace(/\n/g, ' | ') : 'Toast not found';
    }
    return 'Approve button not found';
  });
  console.log(`[TEST 4] Toast notification output: ${toastMessage}`);
  if (toastMessage === 'Toast not found' || toastMessage === 'Approve button not found') {
    throw new Error(`Failed to approve investment or get toast: ${toastMessage}`);
  }

  // Save screenshot of VP view showing toast to scratch
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_investment_vp.png' });
  console.log("Saved VP view screenshot to scratch folder");

  // Save screenshot of VP view showing toast to brain artifact folder
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\screenshot_investment_vp.png' });
  console.log("Saved VP view screenshot to brain artifact folder");

  // Test Case 2: Standard PM View Sub-tab Navigation
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

  // Click on "Investment vs Margin" sub-tab
  console.log("Clicking on 'Investment vs Margin' sub-tab...");
  const clickedSubTab = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const subTabBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'INVESTMENT VS MARGIN');
    if (subTabBtn) {
      subTabBtn.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 5] Clicked sub-tab: ${clickedSubTab}`);
  if (!clickedSubTab) {
    throw new Error("Could not find or click 'Investment vs Margin' sub-tab");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Verify map rendered in PM view
  const mapRenderedPM = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.some(s => s.innerText && s.innerText.toUpperCase().includes("INVESTMENT VS. RETURN MARGIN MAP"));
  });
  console.log(`[TEST 6] Map rendered in PM view sub-tab: ${mapRenderedPM}`);
  if (!mapRenderedPM) {
    throw new Error("Investment vs Margin map not rendering on sub-tab");
  }

  // Save screenshot of PM view showing map subtab to scratch
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_investment_pm.png' });
  console.log("Saved PM view subtab screenshot to scratch folder");

  // Save screenshot of PM view showing map subtab to brain artifact folder
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\screenshot_investment_pm.png' });
  console.log("Saved PM view subtab screenshot to brain artifact folder");

  await browser.close();
  console.log("All AI Investment vs Return Margin Map tests completed successfully!");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
