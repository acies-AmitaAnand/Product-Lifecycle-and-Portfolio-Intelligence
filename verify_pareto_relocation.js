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

  page.on('console', msg => console.log(`[BROWSER CONSOLE]: ${msg.text()}`));
  page.on('pageerror', err => console.error(`[BROWSER ERROR]:`, err));

  console.log("Navigating to http://localhost:3000/#tab=1&role=VP%20Product%20Management...");
  await page.goto('http://localhost:3000/#tab=1&role=VP%20Product%20Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  // Extra safety: click the Portfolio Health tab explicitly if needed
  console.log("Ensuring Portfolio Health tab is active...");
  const sidebarButtons = await page.$$('aside button');
  for (const btn of sidebarButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Portfolio Health')) {
      console.log("Clicking Portfolio Health tab in sidebar to guarantee active tab.");
      await btn.click();
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }

  // Verify that the quick jump navigation contains the "Pareto SKU Concentration" button,
  // and then let's scroll to the new section.
  console.log("Locating the Pareto Concentration section in Portfolio Health Map tab...");
  const paretoSection = await page.$('#vp-pareto-concentration');
  if (paretoSection) {
    console.log("Found Pareto Concentration section! Scrolling to it...");
    await page.evaluate(() => {
      const el = document.getElementById('vp-pareto-concentration');
      if (el) {
        el.scrollIntoView();
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    const screenshotPath = path.join(brainDir, 'pareto_relocation_verification.png');
    console.log(`Taking screenshot of Pareto Concentration under Portfolio Health Map: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath });
    console.log("Portfolio Health Map screenshot saved!");
  } else {
    console.error("ERROR: Could not find Pareto Concentration section (#vp-pareto-concentration) in Portfolio Health Map tab!");
  }

  // Now, navigate to SKU Assortment tab and verify Pareto is NOT there
  console.log("Navigating to SKU Assortment tab...");
  const sidebarButtonsForAssortment = await page.$$('aside button');
  let foundAssortmentTab = false;
  for (const btn of sidebarButtonsForAssortment) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('SKU Assortment')) {
      console.log("Clicking SKU Assortment tab in sidebar!");
      await btn.click();
      foundAssortmentTab = true;
      await new Promise(r => setTimeout(r, 3000));
      break;
    }
  }

  if (foundAssortmentTab) {
    // Check if the component was successfully removed
    const paretoInAssortment = await page.evaluate(() => {
      // Pareto Concentration has a header with text "Pareto SKU Concentration"
      const headers = Array.from(document.querySelectorAll('h4'));
      return headers.some(h => h.textContent.includes('Pareto SKU Concentration'));
    });

    if (paretoInAssortment) {
      console.error("ERROR: Pareto SKU Concentration chart was still found on SKU Assortment tab!");
    } else {
      console.log("Success: Pareto SKU Concentration chart is NOT on SKU Assortment tab!");
    }

    const screenshotPath = path.join(brainDir, 'sku_assortment_no_pareto.png');
    console.log(`Taking screenshot of SKU Assortment: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath });
    console.log("SKU Assortment screenshot saved!");
  } else {
    console.error("WARNING: Could not find SKU Assortment tab button in sidebar!");
  }

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
