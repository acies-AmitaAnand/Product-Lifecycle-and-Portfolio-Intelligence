import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  console.log("Launching browser for Portfolio Lifecycle Timeline test...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  const hostUrl = process.argv[2] || 'http://localhost:3000';
  
  // Test Tab 1: Portfolio Health
  const tab1Url = `${hostUrl}/#tab=1&role=VP+Product+Management`;
  console.log(`Navigating to Portfolio Health: ${tab1Url}`);
  await page.goto(tab1Url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  console.log("Verifying timeline is present on Portfolio Health tab...");
  const tab1Data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('span'));
    const heading = headings.find(h => h.innerText.toLowerCase().includes('product lifecycle journey timeline'));
    if (!heading) return null;

    const container = heading.closest('.lg\\:col-span-8');
    if (!container) return null;

    // Retrieve nodes
    const nodes = Array.from(container.querySelectorAll('.relative.z-10.flex.justify-between.items-start > div'));
    const stageDetails = nodes.map(node => {
      const texts = Array.from(node.querySelectorAll('span'));
      return {
        skuShare: texts[0] ? texts[0].innerText.trim() : '',
        stageName: texts[1] ? texts[1].innerText.trim() : '',
        skuCount: texts[2] ? texts[2].innerText.trim() : '',
        revVal: texts[3] ? texts[3].innerText.trim() : '',
        shareComparison: texts[4] ? texts[4].innerText.trim() : '',
      };
    });

    return { stageDetails };
  });

  let errors = 0;
  if (!tab1Data) {
    console.error("❌ ERROR: Could not find Product Lifecycle Journey Timeline on Portfolio Health tab.");
    errors++;
  } else {
    console.log("✅ SUCCESS: Timeline found on Portfolio Health tab.");
    console.log("Stage Details:", tab1Data.stageDetails);
    
    // Verify expected dynamic stage values:
    const expectedStages = ['Introduction', 'Growth', 'Margin', 'Decline'];
    const expectedCounts = ['5 SKUs', '23 SKUs', '49 SKUs', '23 SKUs'];
    
    tab1Data.stageDetails.forEach((stage, idx) => {
      if (stage.stageName !== expectedStages[idx]) {
        console.error(`❌ Stage name mismatch: Expected '${expectedStages[idx]}', got '${stage.stageName}'`);
        errors++;
      }
      if (stage.skuCount !== expectedCounts[idx]) {
        console.error(`❌ SKU count mismatch: Expected '${expectedCounts[idx]}', got '${stage.skuCount}'`);
        errors++;
      }
    });
  }

  // Take screenshot of Tab 1
  const s1Name = hostUrl.includes('vercel') ? 'vercel_portfolio_timeline.png' : 'local_portfolio_timeline.png';
  const s1Path = path.join('C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a', s1Name);
  await page.screenshot({ path: s1Path });
  console.log(`Saved Portfolio Health screenshot to: ${s1Path}`);

  // Test Tab 2: Launch Readiness
  const tab2Url = `${hostUrl}/#tab=2&role=VP+Product+Management`;
  console.log(`Navigating to Launch Readiness: ${tab2Url}`);
  await page.goto(tab2Url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  console.log("Verifying timeline is NOT present on Launch Readiness tab...");
  const tab2HasTimeline = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('span, h3'));
    return headings.some(h => h.innerText.toLowerCase().includes('product lifecycle journey timeline'));
  });

  if (tab2HasTimeline) {
    console.error("❌ ERROR: Timeline is still rendered on the Launch Readiness tab.");
    errors++;
  } else {
    console.log("✅ SUCCESS: Timeline is not present on Launch Readiness tab.");
  }

  // Take screenshot of Tab 2
  const s2Name = hostUrl.includes('vercel') ? 'vercel_launch_readiness_clean.png' : 'local_launch_readiness_clean.png';
  const s2Path = path.join('C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a', s2Name);
  await page.screenshot({ path: s2Path });
  console.log(`Saved Launch Readiness screenshot to: ${s2Path}`);

  if (errors === 0) {
    console.log("✅ ALL TESTS PASSED SUCCESSFULLY!");
  } else {
    console.error(`❌ TEST FAILED: ${errors} errors detected.`);
    await browser.close();
    process.exit(1);
  }

  await browser.close();
}

run().catch(err => {
  console.error("Unhandled exception:", err);
  process.exit(1);
});
