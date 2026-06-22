import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  page.on('console', msg => {
    console.log(`[BROWSER LOG]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGEERROR]:`, err);
  });

  console.log("Navigating to http://localhost:3003...");
  await page.goto('http://localhost:3003/', { waitUntil: 'networkidle2' });

  // 1. Wait for Welcome Gate to load
  console.log("Waiting for Welcome Gate...");
  await page.waitForSelector('h1', { timeout: 10000 });

  // 2. Select "VP Product Management" (first card)
  console.log("Selecting VP Product Management role...");
  const cards = await page.$$('div.group');
  if (cards.length > 0) {
    await cards[0].click();
  } else {
    console.log("Persona cards not found!");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Verify we are inside the dashboard
  console.log("Checking if inside dashboard...");
  await page.waitForSelector('header', { timeout: 5000 });

  // Helper to click tabs
  async function clickTab(tabLabel) {
    console.log(`Clicking tab: ${tabLabel}`);
    const buttons = await page.$$('aside button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes(tabLabel)) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        return;
      }
    }
    throw new Error(`Tab not found: ${tabLabel}`);
  }

  // 3. Go to Launch Readiness Tab
  await clickTab('Launch Readiness');
  
  // Verify that the simulation button is GONE
  const simulationButtonFound = await page.evaluate(() => {
    return document.body.innerText.includes("RUN CARGO DELAY SIMULATION") || 
           document.body.innerText.includes("Run Cargo Delay Simulation") ||
           document.body.innerText.includes("Stop Cargo Delay Sim");
  });
  console.log(`Cargo Delay Simulation button found? ${simulationButtonFound}`);
  if (simulationButtonFound) {
    console.error("FAIL: Simulation button should have been removed!");
  } else {
    console.log("SUCCESS: Simulation button was successfully removed.");
  }

  // Click on the AI prediction card "BrandC Products: 78% delay probability"
  console.log("Clicking the AI Prediction card...");
  const cardHandle = await page.evaluateHandle(() => {
    const pTags = Array.from(document.querySelectorAll('p'));
    const targetP = pTags.find(p => p.textContent.includes('BrandC Products: 78%'));
    return targetP ? targetP.closest('div') : null;
  });
  if (cardHandle && cardHandle.asElement()) {
    await cardHandle.asElement().click();
    console.log("Card clicked natively!");
  } else {
    console.error("BrandC Products card not found in DOM");
  }

  await new Promise(r => setTimeout(r, 1500));

  // Verify that the AI Prediction Explainer Modal popped up
  console.log("Verifying AI Prediction Modal is open...");
  await page.screenshot({ path: path.join(brainDir, 'vp_launch_readiness_ai_explainer_modal.png') });
  console.log("Saved vp_launch_readiness_ai_explainer_modal.png");

  // Click the first recommendation "Domestic Sourcing" inside the recommendations list in the modal
  console.log("Clicking Domestic Sourcing recommendation...");
  const recHandle = await page.evaluateHandle(() => {
    const pTags = Array.from(document.querySelectorAll('p'));
    const targetP = pTags.find(p => p.textContent.includes('Domestic Sourcing'));
    return targetP ? targetP.closest('div') : null;
  });
  if (recHandle && recHandle.asElement()) {
    await recHandle.asElement().click();
    console.log("Recommendation clicked natively!");
  } else {
    console.error("Domestic Sourcing card not found in modal");
  }
  await new Promise(r => setTimeout(r, 1500));

  // Take screenshot of detailed outcome page
  await page.screenshot({ path: path.join(brainDir, 'vp_launch_readiness_ai_recommendation_detail.png') });
  console.log("Saved vp_launch_readiness_ai_recommendation_detail.png");

  // Click "Acknowledge & Close" (or close button)
  console.log("Closing modal...");
  const closeBtnHandle = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Acknowledge & Close')) || null;
  });
  if (closeBtnHandle && closeBtnHandle.asElement()) {
    await closeBtnHandle.asElement().click();
    console.log("Close button clicked natively!");
  } else {
    console.error("Close button not found");
  }
  await new Promise(r => setTimeout(r, 1500));

  // 4. Click Profitability Tree Tab as VP
  await clickTab('Profitability');
  await page.screenshot({ path: path.join(brainDir, 'vp_profitability_tab.png') });
  console.log("Saved vp_profitability_tab.png");

  // 5. Switch Role in Header to "Product Manager"
  console.log("Switching role in Header to 'Product Manager'...");
  await page.select('header select', 'Product Manager');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(brainDir, 'pm_profitability_tab.png') });
  console.log("Saved pm_profitability_tab.png");

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
