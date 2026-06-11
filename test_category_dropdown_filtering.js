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

  // Navigate directly to the Portfolio Health Map tab on local port 3000
  console.log("Navigating to Portfolio Health Map tab...");
  const targetUrl = 'http://localhost:3000/#tab=1&role=VP+Product+Management';
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Locate the category dropdown for Investment Map precisely
  console.log("Locating Investment Map category select filter...");
  const invSelect = await page.$('#vp-investment-map select');
  if (!invSelect) {
    console.error("ERROR: Could not find select dropdown under #vp-investment-map!");
    await browser.close();
    process.exit(1);
  }

  console.log("Filtering Investment vs Margin Map to 'Snacks'...");
  await page.evaluate(el => {
    el.value = 'Snacks';
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, invSelect);
  await new Promise(r => setTimeout(r, 1500));

  // Verify that Snack products like 'Oat Cookies' are listed in the list/chart
  let bodyText = await page.evaluate(() => document.body.innerText);
  const hasOatCookies = bodyText.includes("Oat Cookies");
  console.log("After filtering Investment Map to Snacks:");
  console.log("  - Is Oat Cookies (Snacks) visible? ", hasOatCookies);

  // 2. Locate the category dropdown for Revenue vs Performance Matrix precisely
  console.log("Locating Revenue vs Performance Matrix select filter...");
  const matrixSelect = await page.$('#vp-rev-perf-matrix select');
  if (!matrixSelect) {
    console.error("ERROR: Could not find select dropdown under #vp-rev-perf-matrix!");
    await browser.close();
    process.exit(1);
  }

  console.log("Filtering Revenue vs Performance Matrix to 'Beverages'...");
  await page.evaluate(el => {
    el.value = 'Beverages';
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, matrixSelect);
  await new Promise(r => setTimeout(r, 1500));

  // Verify that only Beverages are mapped
  bodyText = await page.evaluate(() => document.body.innerText);
  const hasMangoFizz = bodyText.includes("Mango Fizz 500ml");
  console.log("After filtering Matrix to Beverages:");
  console.log("  - Is Mango Fizz (Beverages) visible? ", hasMangoFizz);

  // Take screenshot of the filtered views
  console.log("Taking screenshot of the filtered charts...");
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_category_dropdown_filtered.png' });
  console.log("Screenshot saved to screenshot_category_dropdown_filtered.png");

  await browser.close();
  console.log("Category dropdown filtering test finished successfully!");
}

run().catch(console.error);
