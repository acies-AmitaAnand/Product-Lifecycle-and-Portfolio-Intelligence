import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1800 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  // Navigate to SKU Assortment tab
  console.log("Navigating to SKU Assortment tab...");
  const url = 'http://localhost:3000/#tab=8&role=Product+Manager';
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Verify and click 'Regional & Channel Performance' subtab
  console.log("Clicking 'Regional & Channel Performance' subtab...");
  const clickedPerformance = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const perfBtn = buttons.find(b => b.textContent.toUpperCase().includes('REGIONAL & CHANNEL PERFORMANCE'));
    if (perfBtn) {
      perfBtn.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Performance subtab? ", clickedPerformance);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Taking screenshot of Performance subtab...");
  await page.screenshot({ path: 'C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a/screenshot_assortment_performance.png' });
  console.log("Screenshot saved to screenshot_assortment_performance.png");

  // 2. Verify and click 'Product Mix & Clustering' subtab
  console.log("Clicking 'Product Mix & Clustering' subtab...");
  const clickedMix = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const mixBtn = buttons.find(b => b.textContent.toUpperCase().includes('PRODUCT MIX & CLUSTERING'));
    if (mixBtn) {
      mixBtn.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Mix & Clustering subtab? ", clickedMix);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Taking screenshot of Product Mix & Clustering subtab...");
  await page.screenshot({ path: 'C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a/screenshot_assortment_mix_clustering.png' });
  console.log("Screenshot saved to screenshot_assortment_mix_clustering.png");

  await browser.close();
  console.log("Assortment tab verification finished successfully!");
}

run().catch(console.error);
