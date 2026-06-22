import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  console.log("Navigating to dashboard...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

  // Onboarding Screen
  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 4000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        console.log("Clicking role card: VP Product Management");
        await card.click();
        break;
      }
    }
  } catch (e) {
    console.log("No Welcome Gate screen found, continuing...");
  }

  await new Promise(r => setTimeout(r, 2000));

  // Click on the Combi Chart toggle button to make it easy to click bars
  console.log("Clicking Combi Chart toggle...");
  const toggles = await page.$$('button[title="Combi Chart (Bar + Line)"]');
  if (toggles.length > 0) {
    await toggles[0].click();
    console.log("Switched to Combi Chart.");
  } else {
    console.log("Combi toggle not found.");
  }

  await new Promise(r => setTimeout(r, 1000));

  // Find all bars
  const barSelector = '.recharts-bar-rectangle';
  await page.waitForSelector(barSelector);
  const bars = await page.$$(barSelector);
  console.log(`Found ${bars.length} bar elements on chart.`);

  const testBarIndex = async (index, monthName, expectedActual, expectedTarget) => {
    if (index >= bars.length) {
      console.error(`Index ${index} out of bounds (found ${bars.length} bars)`);
      return;
    }

    console.log(`Clicking bar at index ${index} (representing ${monthName})...`);
    await bars[index].click();
    await new Promise(r => setTimeout(r, 1500));

    const modalText = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
      return modal ? modal.textContent : null;
    });

    if (modalText) {
      console.log(`Modal Text for ${monthName}:`, modalText);
      const hasActual = modalText.includes(expectedActual);
      const hasTarget = modalText.includes(expectedTarget);
      console.log(`- Correct Target (${expectedTarget})?`, hasTarget);
      console.log(`- Correct Actual (${expectedActual})?`, hasActual);
      
      if (hasActual && hasTarget) {
        console.log(`SUCCESS: ${monthName} data validated!`);
      } else {
        console.error(`FAIL: ${monthName} target/actual data mismatch.`);
      }

      // Close modal
      const closeBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(btn => btn.textContent.toUpperCase().includes('CLOSE ANALYSIS'));
      });
      if (closeBtn) {
        const btnEl = closeBtn.asElement();
        if (btnEl) {
          await btnEl.click();
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    } else {
      console.error(`FAIL: Modal did not open for ${monthName}`);
    }
  };

  // Test Nov (index 10)
  await testBarIndex(10, 'Nov', '₹92.4 Cr', '₹93.0 Cr');

  // Test Dec (index 11)
  await testBarIndex(11, 'Dec', '₹95.1 Cr', '₹96.0 Cr');

  console.log("Closing browser...");
  await browser.close();
}

run().catch(console.error);
