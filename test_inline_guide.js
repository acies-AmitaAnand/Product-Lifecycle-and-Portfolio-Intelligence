import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  console.log("Launching browser for Inline Executive Guide verification...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  const hostUrl = process.argv[2] || 'http://localhost:3000';
  const targetUrl = `${hostUrl}/#tab=1&role=VP+Product+Management`;
  
  console.log(`Navigating to Portfolio Health: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  console.log("Checking if Executive Guide toggle button is present...");
  const buttonText = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const guideBtn = buttons.find(b => b.innerText.toLowerCase().includes('executive guide'));
    return guideBtn ? guideBtn.innerText.trim() : null;
  });

  if (!buttonText) {
    console.error("❌ ERROR: Executive Guide button not found in Quick Jump panel!");
    await browser.close();
    process.exit(1);
  }
  console.log(`✅ SUCCESS: Found Guide button with text: "${buttonText}"`);

  console.log("Clicking Executive Guide button to open the panel...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const guideBtn = buttons.find(b => b.innerText.toLowerCase().includes('executive guide'));
    if (guideBtn) guideBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Verifying inline guide elements are rendered...");
  const guideData = await page.evaluate(() => {
    const heading = document.querySelector('h3');
    const headingText = heading ? heading.innerText.trim() : '';
    
    const downloadBtn = document.querySelector('a[download]');
    const downloadHref = downloadBtn ? downloadBtn.getAttribute('href') : '';
    
    const iframe = document.querySelector('iframe');
    const iframeSrc = iframe ? iframe.getAttribute('src') : '';
    
    return {
      headingText,
      downloadHref,
      hasIframe: !!iframe,
      iframeSrc
    };
  });

  console.log("Inline Guide Data Checked:", guideData);

  let errors = 0;
  if (!guideData.headingText.includes('Portfolio Health Map: Executive Guide')) {
    console.log(`❌ Title mismatch: Expected 'Portfolio Health Map: Executive Guide', got '${guideData.headingText}'`);
    errors++;
  } else {
    console.log("✅ Title verified successfully.");
  }

  if (!guideData.downloadHref.includes('portfolio_health_guide.pdf')) {
    console.log(`❌ Download link mismatch: Expected to contain 'portfolio_health_guide.pdf', got '${guideData.downloadHref}'`);
    errors++;
  } else {
    console.log("✅ Download link verified successfully.");
  }

  if (!guideData.hasIframe || !guideData.iframeSrc.includes('portfolio_health_guide.html')) {
    console.log(`❌ Iframe mismatch: Expected source to contain 'portfolio_health_guide.html', got '${guideData.iframeSrc}'`);
    errors++;
  } else {
    console.log("✅ Iframe verified successfully.");
  }

  // Take screenshot
  const screenshotPath = path.resolve('C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a/vercel_inline_executive_guide.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to: ${screenshotPath}`);

  // Test closing it
  console.log("Clicking close button...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const guideBtn = buttons.find(b => b.innerText.toLowerCase().includes('executive guide'));
    if (guideBtn) guideBtn.click(); // Click again to close
  });
  await new Promise(r => setTimeout(r, 1000));

  const hasGuideAfterClose = await page.evaluate(() => {
    const heading = document.querySelector('h3');
    return heading && heading.innerText.includes('Portfolio Health Map: Executive Guide');
  });

  if (hasGuideAfterClose) {
    console.log("❌ ERROR: Guide panel was not closed after clicking toggle button again.");
    errors++;
  } else {
    console.log("✅ Closed guide panel successfully.");
  }

  await browser.close();

  if (errors > 0) {
    console.log(`❌ TEST FAILED: ${errors} errors detected.`);
    process.exit(1);
  } else {
    console.log("✅ ALL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  }
}

run().catch(err => {
  console.error("Unhandled exception:", err);
  process.exit(1);
});
