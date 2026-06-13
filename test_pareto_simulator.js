import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER RUNTIME ERROR]', err.toString()));

  console.log("Navigating to Portfolio Health (Tab 1) as VP...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  console.log("Waiting for Pareto container...");
  await page.waitForSelector('#vp-pareto-concentration', { timeout: 8000 });

  // Scroll the Pareto element into view
  await page.evaluate(() => {
    const el = document.getElementById('vp-pareto-concentration');
    if (el) {
      el.scrollIntoView();
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot of initial state (30% cutoff)
  const initialPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\pareto_initial_30.png';
  const paretoEl = await page.$('#vp-pareto-concentration');
  if (paretoEl) {
    await paretoEl.screenshot({ path: initialPath });
    console.log(`Saved initial screenshot to: ${initialPath}`);
  }

  // Find the simulator range slider (min=20, max=60)
  console.log("Locating the Hero Cutoff range slider...");
  const sliderHandle = await page.evaluateHandle(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="range"]'));
    return inputs.find(i => i.min === '20' && i.max === '60');
  });

  const slider = sliderHandle.asElement();
  if (slider) {
    console.log("Found slider. Simulating slide to 45%...");
    
    // Evaluate in browser to set value and dispatch input/change events using React-friendly setter
    await page.evaluate((el) => {
      const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeValueSetter.call(el, '45');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, slider);

    await new Promise(r => setTimeout(r, 2000));

    // Get updated info from page
    const textInfo = await page.evaluate(() => {
      const el = document.getElementById('vp-pareto-concentration');
      return el ? el.innerText : '';
    });

    console.log("--- Updated Pareto Component Text ---");
    console.log(textInfo.split('\n').filter(l => l.includes('HERO') || l.includes('TAIL') || l.includes('Top 45%') || l.includes('Bottom 55%')));
    console.log("-------------------------------------");

    // Take screenshot of simulated state (45% cutoff)
    const simulatedPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\pareto_simulated_45.png';
    if (paretoEl) {
      await paretoEl.screenshot({ path: simulatedPath });
      console.log(`Saved simulated screenshot to: ${simulatedPath}`);
    }
  } else {
    console.error("Could not find the simulator range slider.");
  }

  await browser.close();
}

run().catch(console.error);
