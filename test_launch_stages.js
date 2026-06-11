import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  // 1. Verify VP view simulator
  console.log("Navigating to Launch Readiness VP view...");
  const vpUrl = 'http://localhost:3000/#tab=2&role=VP+Product+Management';
  await page.goto(vpUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  console.log("Checking if VP Simulator Card is rendered...");
  const pageTextVP = await page.evaluate(() => document.body.innerText);
  const hasVPCard = pageTextVP.toUpperCase().includes("LAUNCH PIPELINE STAGE RISK & COST SIMULATOR");
  console.log("Is VP Simulator Card visible? ", hasVPCard);

  console.log("Activating mitigation for 'Testing' stage...");
  const clickedTesting = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('h4'));
    const testingHeader = headers.find(el => el.textContent.trim() === 'Testing');
    if (testingHeader) {
      // Find the toggle button in the parent block
      const container = testingHeader.closest('div');
      if (container) {
        // The toggle button is next to the title text or in the same row
        const parentRow = container.parentElement;
        const toggleBtn = parentRow ? parentRow.querySelector('button') : null;
        if (toggleBtn) {
          toggleBtn.click();
          return true;
        }
      }
    }
    return false;
  });
  console.log("Clicked Testing stage toggle? ", clickedTesting);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Activating mitigation for 'Pre-market' stage...");
  const clickedPremarket = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('h4'));
    const pmHeader = headers.find(el => el.textContent.trim() === 'Pre-market');
    if (pmHeader) {
      const container = pmHeader.closest('div');
      if (container) {
        const parentRow = container.parentElement;
        const toggleBtn = parentRow ? parentRow.querySelector('button') : null;
        if (toggleBtn) {
          toggleBtn.click();
          return true;
        }
      }
    }
    return false;
  });
  console.log("Clicked Pre-market stage toggle? ", clickedPremarket);
  await new Promise(r => setTimeout(r, 2000));

  const pageTextSimVP = await page.evaluate(() => document.body.innerText);
  console.log("Checking for updated simulation metrics on VP view...");
  console.log("Contains simulated spent cost changes? ", !pageTextSimVP.includes("+₹0.00 Cr"));
  console.log("Contains mitigated risk exposure changes? ", !pageTextSimVP.includes("Total Cost Slippage\n+₹0.00 Cr"));

  console.log("Taking screenshot of VP view simulation...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_launch_vp_simulation.png' });
  console.log("Screenshot saved to screenshot_launch_vp_simulation.png");

  // 2. Verify PM view (Standard view)
  console.log("Navigating to Launch Readiness Product Manager (Standard) view...");
  const pmUrl = 'http://localhost:3000/#tab=2&role=Product+Manager';
  await page.goto(pmUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Selecting 'Product Manager' from header dropdown to trigger state change...");
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const roleSelect = selects.find(sel => {
      return Array.from(sel.options).some(opt => opt.text.includes('Product Manager'));
    });
    if (roleSelect) {
      roleSelect.value = 'Product Manager';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Submitting SKU Brief to score launch...");
  const clickedScore = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const scoreBtn = buttons.find(b => b.textContent.toUpperCase().includes('SCORE READINESS'));
    if (scoreBtn) {
      scoreBtn.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Score Readiness button? ", clickedScore);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Checking for Cost & Risk Impact analysis cards...");
  const pageTextPM = await page.evaluate(() => document.body.innerText);
  const hasCostRiskPM = pageTextPM.toUpperCase().includes("COST & RISK IMPACT");
  const hasMitigationPM = pageTextPM.toUpperCase().includes("SKU RISK MITIGATION & COST SIMULATOR");
  console.log("Is Cost & Risk Impact analysis visible? ", hasCostRiskPM);
  console.log("Is SKU Mitigation Simulator visible? ", hasMitigationPM);

  console.log("Toggling Mitigation Protocol switch in PM view...");
  const clickedMitigationPM = await page.evaluate(() => {
    // Find the button in the simulator card that acts as toggle
    const headers = Array.from(document.querySelectorAll('h3'));
    const simHeader = headers.find(h => h.textContent.toUpperCase().includes("SKU RISK MITIGATION & COST SIMULATOR"));
    if (simHeader) {
      const card = simHeader.closest('.glass-card');
      const toggleBtn = card ? card.querySelector('button') : null;
      if (toggleBtn) {
        toggleBtn.click();
        return true;
      }
    }
    return false;
  });
  console.log("Clicked PM mitigation toggle button? ", clickedMitigationPM);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Taking screenshot of PM view simulation...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_launch_pm_simulation.png' });
  console.log("Screenshot saved to screenshot_launch_pm_simulation.png");

  await browser.close();
  console.log("Launch readiness stages and simulation verification finished successfully!");
}

run().catch(console.error);
