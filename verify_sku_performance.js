import puppeteer from 'puppeteer';
import path from 'path';

const brainDir = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  page.on('console', msg => {
    console.log(`[BROWSER LOG]: ${msg.text()}`);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle2'
  });

  // Onboarding
  console.log("Selecting VP Product Management role...");
  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 5000 });
    const cards = await page.$$(roleSelector);
    if (cards.length > 0) {
      await cards[0].click();
    }
  } catch (e) {
    console.log("No onboarding found.");
  }

  await new Promise(r => setTimeout(r, 2000));

  // Verify we are inside dashboard
  console.log("Checking if inside dashboard...");
  await page.waitForSelector('header', { timeout: 5000 });

  // Locate "View All SKUs" button
  console.log("Finding and clicking 'View All SKUs' button at the bottom of Top SKU Performance...");
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const viewAllBtn = buttons.find(btn => btn.textContent && btn.textContent.includes('View All SKUs'));
    if (viewAllBtn) {
      viewAllBtn.click();
      return true;
    }
    return false;
  });

  if (!clicked) {
    console.error("FAIL: Could not locate or click 'View All SKUs' button.");
    await browser.close();
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, 2000));

  // Screenshot the new SKU Performance directory page
  const tabScreenshot = path.join(brainDir, 'sku_performance_tab.png');
  console.log(`Taking SKU Performance Tab screenshot: ${tabScreenshot}`);
  await page.screenshot({ path: tabScreenshot });

  // Click on the first row's "Inspect" button to verify SkuDetailsModal integration
  console.log("Locating and clicking 'Inspect' button on the first SKU row...");
  const inspectClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const inspectBtn = buttons.find(btn => btn.textContent && btn.textContent.trim() === 'Inspect');
    if (inspectBtn) {
      inspectBtn.click();
      return true;
    }
    return false;
  });

  if (inspectClicked) {
    await new Promise(r => setTimeout(r, 1500));
    const modalScreenshot = path.join(brainDir, 'sku_performance_inspect_modal.png');
    console.log(`Taking SKU Inspect Modal screenshot: ${modalScreenshot}`);
    await page.screenshot({ path: modalScreenshot });
  } else {
    console.log("Inspect button not found in the list.");
  }

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
