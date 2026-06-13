import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser for live Vercel testing...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  console.log("Navigating to live Portfolio Health as VP Product Management...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  console.log("Waiting for Pareto container...");
  await page.waitForSelector('#vp-pareto-concentration', { timeout: 8000 });

  await page.evaluate(() => {
    const el = document.getElementById('vp-pareto-concentration');
    if (el) el.scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log("Locating the Hero Cutoff range slider on Vercel...");
  const sliderHandle = await page.evaluateHandle(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="range"]'));
    return inputs.find(i => i.min === '20' && i.max === '40');
  });

  const slider = sliderHandle.asElement();
  if (slider) {
    console.log("Found slider on Vercel. Simulating slide to 35%...");
    await page.evaluate((el) => {
      const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeValueSetter.call(el, '35');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, slider);

    await new Promise(r => setTimeout(r, 2000));

    // Capture the screenshot of the simulated Pareto card on the Vercel production deployment
    const simulatedPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\vercel_pareto_simulated_35.png';
    const paretoEl = await page.$('#vp-pareto-concentration');
    if (paretoEl) {
      await paretoEl.screenshot({ path: simulatedPath });
      console.log(`Saved Vercel simulated screenshot to: ${simulatedPath}`);
    }
  } else {
    console.error("Could not find the simulator range slider on Vercel.");
  }

  await browser.close();
}

run().catch(console.error);
