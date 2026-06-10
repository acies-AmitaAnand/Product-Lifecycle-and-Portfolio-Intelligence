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

  // Navigate to PM role on Portfolio Health tab
  console.log("Navigating to Product Manager Portfolio Health View...");
  await page.goto('http://localhost:3000/#tab=1&role=Product+Manager', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Click on "Revenue vs Performance" sub-tab
  console.log("Clicking on 'Revenue vs Performance' sub-tab...");
  const clickedSubTab = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const subTabBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'REVENUE VS PERFORMANCE');
    if (subTabBtn) {
      subTabBtn.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 1] Clicked sub-tab: ${clickedSubTab}`);
  if (!clickedSubTab) {
    throw new Error("Could not find or click 'Revenue vs Performance' sub-tab");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Verify matrix title is rendered
  const hasTitle = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.some(s => s.innerText && s.innerText.toUpperCase().includes("REVENUE VS. PERFORMANCE MATRIX"));
  });
  console.log(`[TEST 2] Revenue vs. Performance Matrix title rendered: ${hasTitle}`);
  if (!hasTitle) {
    throw new Error("Revenue vs. Performance Matrix title not found");
  }

  // Click on the first SKU card in the list (default High Perf: Mango Fizz 500ml or Oat Cookies etc.)
  console.log("Clicking first SKU card to open SKU Details Modal...");
  const openedModal = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h4'));
    // Find the first heading that matches one of the high performers, e.g., MANGO FIZZ 500ML
    const heading = headings.find(h => h.innerText && h.innerText.toUpperCase().includes('MANGO FIZZ 500ML') || h.innerText.toUpperCase().includes('OAT COOKIES'));
    if (heading) {
      heading.click();
      return true;
    }
    return false;
  });
  console.log(`[TEST 3] Opened SKU Details modal: ${openedModal}`);
  if (!openedModal) {
    throw new Error("Could not click on first SKU card");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Verify modal is open
  const modalTitle = await page.evaluate(() => {
    const modalContainers = Array.from(document.querySelectorAll('div.fixed.inset-0'));
    const modalContainer = modalContainers.find(el => el.innerText && el.innerText.toUpperCase().includes("QTD REVENUE"));
    if (!modalContainer) return 'None';
    const header = modalContainer.querySelector('h2');
    return header ? header.innerText.toUpperCase().trim() : 'None';
  });
  console.log(`[TEST 4] Modal SKU Title: ${modalTitle}`);
  if (modalTitle === 'NONE') {
    throw new Error("SKU Details modal failed to load metrics");
  }

  // Close SKU details modal
  console.log("Closing SKU Details Modal...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'CLOSE ANALYSIS');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Authorize Strategy and verify Toast
  console.log("Clicking 'Authorize Strategy' button...");
  const toastMessage = await page.evaluate(async () => {
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
  console.log(`[TEST 5] Toast notification output: ${toastMessage}`);
  if (toastMessage === 'Toast not found' || toastMessage === 'Authorize button not found') {
    throw new Error(`Failed to authorize strategy or get toast: ${toastMessage}`);
  }

  // Save screenshot of matrix view showing toast to scratch
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_rev_perf_pm.png' });
  console.log("Saved PM view screenshot to scratch folder");

  // Save screenshot of matrix view showing toast to brain artifact folder
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\screenshot_rev_perf_pm.png' });
  console.log("Saved PM view screenshot to brain artifact folder");

  await browser.close();
  console.log("All Revenue vs Performance Matrix tests completed successfully!");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
