import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  console.log("Launching browser for Launch Lifecycle Timeline test...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  // Use local host or Vercel URL
  const targetUrl = process.argv[2] || 'http://localhost:3000/#tab=2&role=VP+Product+Management';
  console.log(`Navigating to: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  // Wait for 3 seconds for component to render
  await new Promise(r => setTimeout(r, 3000));

  console.log("Verifying timeline stages and metrics...");
  
  const timelineData = await page.evaluate(() => {
    // Locate the Product Lifecycle Journey Timeline container
    const headings = Array.from(document.querySelectorAll('h3'));
    const lifecycleHeading = headings.find(h => h.innerText.toLowerCase().includes('product lifecycle journey timeline'));
    if (!lifecycleHeading) return null;

    const container = lifecycleHeading.closest('.glass-card');
    if (!container) return null;

    // Retrieve timeline node details
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

    // Retrieve summary card details
    const cards = Array.from(container.querySelectorAll('.grid.grid-cols-2.md\\:grid-cols-4.gap-4 > div'));
    const cardDetails = cards.map(card => {
      const title = card.querySelector('span:first-child') ? card.querySelector('span:first-child').innerText.trim() : '';
      const value = card.querySelector('div') ? card.querySelector('div').innerText.trim() : '';
      return { title, value };
    });

    return { stageDetails, cardDetails };
  });

  // Capture screenshot first for debugging
  const screenshotName = targetUrl.includes('vercel') ? 'vercel_launch_lifecycle.png' : 'local_launch_lifecycle.png';
  const screenshotPath = path.join('C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a', screenshotName);
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to: ${screenshotPath}`);

  if (!timelineData) {
    console.error("❌ ERROR: Could not find Product Lifecycle Journey Timeline on page.");
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("--- VISIBLE PAGE TEXT ---");
    console.log(pageText.substring(0, 1000));
    console.log("-------------------------");
    await browser.close();
    process.exit(1);
  }

  console.log("--- STAGE DETAILS ---");
  console.log(timelineData.stageDetails);
  console.log("--- CARD DETAILS ---");
  console.log(timelineData.cardDetails);

  // Assertions
  const expectedStages = ['Introduction', 'Growth', 'Margin', 'Decline'];
  const expectedCounts = ['5 SKUs', '28 SKUs', '44 SKUs', '23 SKUs'];
  const expectedRevenues = ['₹451 Cr', '₹2,985 Cr', '₹3,858 Cr', '₹1,129 Cr'];

  let errors = 0;
  
  // Verify stages
  timelineData.stageDetails.forEach((stage, idx) => {
    if (stage.stageName !== expectedStages[idx]) {
      console.error(`❌ Stage mismatch at index ${idx}: Expected '${expectedStages[idx]}', got '${stage.stageName}'`);
      errors++;
    }
    if (stage.skuCount !== expectedCounts[idx]) {
      console.error(`❌ SKU count mismatch for ${stage.stageName}: Expected '${expectedCounts[idx]}', got '${stage.skuCount}'`);
      errors++;
    }
    if (stage.revVal !== expectedRevenues[idx]) {
      console.error(`❌ Revenue mismatch for ${stage.stageName}: Expected '${expectedRevenues[idx]}', got '${stage.revVal}'`);
      errors++;
    }
  });

  // Verify cards
  const cards = timelineData.cardDetails;
  const totalSKUsCard = cards.find(c => c.title.toLowerCase().includes('total skus'));
  const totalRevCard = cards.find(c => c.title.toLowerCase().includes('total revenue'));
  const mostEfficientCard = cards.find(c => c.title.toLowerCase().includes('most efficient'));
  const leastEfficientCard = cards.find(c => c.title.toLowerCase().includes('least efficient'));

  if (!totalSKUsCard || !totalSKUsCard.value.includes('100')) {
    console.error(`❌ Total SKUs card error: Expected '100', got '${totalSKUsCard ? totalSKUsCard.value : 'missing'}'`);
    errors++;
  }
  if (!totalRevCard || !totalRevCard.value.includes('8,423')) {
    console.error(`❌ Total Revenue card error: Expected '8,423', got '${totalRevCard ? totalRevCard.value : 'missing'}'`);
    errors++;
  }
  if (!mostEfficientCard || !mostEfficientCard.value.toLowerCase().includes('growth')) {
    console.error(`❌ Most Efficient Stage error: Expected 'Growth', got '${mostEfficientCard ? mostEfficientCard.value : 'missing'}'`);
    errors++;
  }
  if (!leastEfficientCard || !leastEfficientCard.value.toLowerCase().includes('decline')) {
    console.error(`❌ Least Efficient Stage error: Expected 'Decline', got '${leastEfficientCard ? leastEfficientCard.value : 'missing'}'`);
    errors++;
  }

  // Screenshot was already captured at start of validation

  if (errors === 0) {
    console.log("✅ SUCCESS: All stages and cards verified successfully!");
  } else {
    console.error(`❌ FAILED: ${errors} errors detected.`);
    process.exit(1);
  }

  await browser.close();
}

run().catch(err => {
  console.error("Unhandle exception:", err);
  process.exit(1);
});
