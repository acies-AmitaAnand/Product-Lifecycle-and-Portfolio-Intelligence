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

  // Screenshot home page
  const homeScreenshot = path.join(brainDir, 'home_executive_overview.png');
  console.log(`Taking home page screenshot: ${homeScreenshot}`);
  await page.screenshot({ path: homeScreenshot });

  // Locate Investigate button or Inspect Swarm
  console.log("Locating 'Inspect Swarm' or 'Investigate' inside Smart Alerts...");
  const inspectSwarmButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(btn => btn.textContent && btn.textContent.includes('Inspect Swarm')) || null;
  });

  const btnEl = inspectSwarmButton.asElement();
  if (btnEl) {
    console.log("Clicking Inspect Swarm button...");
    await btnEl.click();
    await new Promise(r => setTimeout(r, 2000));

    const swarmScreenshot = path.join(brainDir, 'smart_alert_swarm_trace.png');
    console.log(`Taking Swarm Trace screenshot: ${swarmScreenshot}`);
    await page.screenshot({ path: swarmScreenshot });
  } else {
    console.log("Inspect Swarm button not found, searching for 'Investigate'...");
    const investigateButtons = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => btn.textContent && btn.textContent.trim() === 'Investigate');
    });

    const buttonsArray = await investigateButtons.getProperties();
    for (const prop of buttonsArray.values()) {
      const el = prop.asElement();
      if (el) {
        const isVisible = await el.boundingBox();
        if (isVisible) {
          console.log("Clicking first visible Investigate button...");
          await el.click();
          await new Promise(r => setTimeout(r, 2000));
          break;
        }
      }
    }

    const modalScreenshot = path.join(brainDir, 'smart_alert_modal.png');
    console.log(`Taking modal screenshot: ${modalScreenshot}`);
    await page.screenshot({ path: modalScreenshot });
  }

  console.log("Closing browser.");
  await browser.close();
}

run().catch(console.error);
