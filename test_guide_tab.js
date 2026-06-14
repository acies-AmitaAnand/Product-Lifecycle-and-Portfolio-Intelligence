import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  console.log("Launching browser for Executive Tab Guide verification...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  const hostUrl = process.argv[2] || 'http://localhost:3000';
  const targetUrl = `${hostUrl}/#tab=9&role=VP+Product+Management`;
  
  console.log(`Navigating to Executive Guide: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  console.log("Verifying Guide elements...");
  const guideData = await page.evaluate(() => {
    const heading = document.querySelector('h3');
    const headingText = heading ? heading.innerText.trim() : '';
    
    const downloadBtn = document.querySelector('a[download]');
    const downloadHref = downloadBtn ? downloadBtn.getAttribute('href') : '';
    const downloadText = downloadBtn ? downloadBtn.innerText.trim() : '';
    
    const iframe = document.querySelector('iframe');
    const iframeSrc = iframe ? iframe.getAttribute('src') : '';
    
    return {
      headingText,
      downloadHref,
      downloadText,
      hasIframe: !!iframe,
      iframeSrc
    };
  });

  console.log("Guide Data Checked:", guideData);

  let errors = 0;
  if (!guideData.headingText.includes('Executive Tab Guide')) {
    console.log(`❌ Title mismatch: Expected 'Executive Tab Guide', got '${guideData.headingText}'`);
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
  const screenshotPath = path.resolve('C:/Users/Sree Vyshnavi/.gemini/antigravity/brain/6470fd70-a4a4-4b87-a99d-d8ddeb36d56a/vercel_executive_guide_tab.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to: ${screenshotPath}`);

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
