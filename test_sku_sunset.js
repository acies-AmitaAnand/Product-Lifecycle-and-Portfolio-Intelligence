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

  // Navigate to local dev server SKU Rationalization tab
  console.log("Navigating to SKU Rationalization tab...");
  const targetUrl = 'http://localhost:3000/#tab=4&role=Product+Manager';
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Switch activeView to 'simulator' (Portfolio Simulator Command)
  console.log("Switching to Portfolio Simulator view...");
  const mainViewButtons = await page.$$('button');
  let clickedView = false;
  for (const btn of mainViewButtons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.toUpperCase().includes("PORTFOLIO SIMULATOR") || text.toUpperCase().includes("SIMULATOR COMMAND")) {
      await btn.click();
      console.log("Clicked Portfolio Simulator view button.");
      clickedView = true;
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));

  // 2. Select the "Sunset SKU" scenario tab in the simulator
  console.log("Selecting the Sunset SKU scenario tab...");
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.innerText, tab);
    if (text.toUpperCase().includes("SUNSET SKU") || text.toUpperCase() === "SUNSET") {
      await tab.click();
      console.log("Clicked Sunset SKU scenario button.");
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // 2. Verify that the AI Sunset Business Justification card is rendered
  const pageText = await page.evaluate(() => document.body.innerText);
  const hasJustification = pageText.toUpperCase().includes("AI SUNSET BUSINESS JUSTIFICATION");
  console.log("Is AI Sunset Business Justification visible? ", hasJustification);

  // 3. Verify that Substitute Product dropdown is visible and select another item
  console.log("Checking for substitute product dropdown selector...");
  const selectElements = await page.$$('select');
  console.log(`Found ${selectElements.length} select elements on the page.`);

  let substituteSelect = null;
  for (const select of selectElements) {
    const isSubstitute = await page.evaluate(el => {
      // Find the select next to the label for substitute product
      const prevSibling = el.previousElementSibling;
      if (prevSibling && prevSibling.textContent && prevSibling.textContent.toUpperCase().includes("SUBSTITUTE PRODUCT")) {
        return true;
      }
      const parent = el.parentElement;
      if (parent && parent.textContent && parent.textContent.toUpperCase().includes("SUBSTITUTE PRODUCT")) {
        return true;
      }
      return false;
    }, select);

    if (isSubstitute) {
      substituteSelect = select;
      break;
    }
  }

  if (substituteSelect) {
    console.log("Found substitute SKU dropdown! Selecting another product...");
    const options = await page.evaluate(el => Array.from(el.options).map(o => o.value), substituteSelect);
    console.log("Available substitutes: ", options);
    if (options.length > 1) {
      await page.evaluate((el, val) => {
        el.value = val;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, substituteSelect, options[1]);
      console.log(`Selected substitute: ${options[1]}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log("Warning: Substitute SKU dropdown not found explicitly by label check, using fallback select selector.");
    if (selectElements.length >= 2) {
      const options = await page.evaluate(el => Array.from(el.options).map(o => o.value), selectElements[1]);
      console.log("Available substitutes (fallback): ", options);
      if (options.length > 1) {
        await page.evaluate((el, val) => {
          el.value = val;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, selectElements[1], options[1]);
        console.log(`Selected substitute (fallback): ${options[1]}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // 4. Verify that Redistribution Slider is present and adjust it
  console.log("Locating the transference rate range slider...");
  const rangeInputs = await page.$$('input[type="range"]');
  console.log(`Found ${rangeInputs.length} range sliders.`);

  if (rangeInputs.length > 0) {
    // The first slider in Sunset tab is the transference slider
    const slider = rangeInputs[0];
    console.log("Adjusting transference rate slider value to 80%...");
    await page.evaluate(el => {
      el.value = 80;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, slider);
    await new Promise(r => setTimeout(r, 1500));
  }

  // 5. Assert the dynamic values in the redistribution flow
  const updatedText = await page.evaluate(() => document.body.innerText);
  console.log("Has absolute profit impact updated? ", updatedText.includes("ABSOLUTE PROFIT IMPACT"));
  console.log("Is Transferred Revenue displayed? ", updatedText.includes("TRANSFERRED:"));
  console.log("Is Complexity Savings displayed? ", updatedText.includes("COMPLEXITY SAVINGS"));

  // Take screenshot of the simulation desk showing advanced sunset analysis
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_sku_sunset_simulation.png' });
  console.log("Screenshot saved to screenshot_sku_sunset_simulation.png");

  await browser.close();
  console.log("SKU sunset verification finished successfully!");
}

run().catch(console.error);
