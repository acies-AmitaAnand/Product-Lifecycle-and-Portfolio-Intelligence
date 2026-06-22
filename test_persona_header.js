import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER RUNTIME ERROR]', err.toString()));

  console.log("Navigating to live Vercel site...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=0&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Wait for header to load
  console.log("Waiting for header elements...");
  await page.waitForSelector('header', { timeout: 5000 });

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("Does page contain 'Profile: VP Product Management'? ", bodyText.includes("Profile: VP Product Management"));

  // Take screenshot of header area specifically
  const headerElement = await page.$('header');
  if (headerElement) {
    const screenshotPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\header_persona_indicator.png';
    await headerElement.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot of header to: ${screenshotPath}`);
  } else {
    console.error("Header element not found to screenshot.");
  }

  await browser.close();
}

run().catch(console.error);
