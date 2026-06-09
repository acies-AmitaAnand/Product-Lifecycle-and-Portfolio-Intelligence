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

  const testMonth = async (monthCode, expectedActual, expectedTarget) => {
    console.log(`Locating the click target for month '${monthCode}'...`);
    const tickEl = await page.evaluateHandle((m) => {
      const texts = Array.from(document.querySelectorAll('text, span, div, button'));
      return texts.find(el => el.textContent === m);
    }, monthCode);

    if (tickEl) {
      const el = tickEl.asElement();
      if (el) {
        await el.click();
        console.log(`Clicked '${monthCode}' tick.`);
        await new Promise(r => setTimeout(r, 1500));

        const modalText = await page.evaluate(() => {
          const modal = document.querySelector('.fixed.inset-0.bg-black\\/60');
          return modal ? modal.textContent : null;
        });

        if (modalText) {
          console.log(`Modal Text for ${monthCode}:`, modalText);
          const hasActual = modalText.includes(expectedActual);
          const hasTarget = modalText.includes(expectedTarget);
          console.log(`- Correct Target (${expectedTarget})?`, hasTarget);
          console.log(`- Correct Actual (${expectedActual})?`, hasActual);
          
          if (hasActual && hasTarget) {
            console.log(`SUCCESS: ${monthCode} data validated!`);
          } else {
            console.error(`FAIL: ${monthCode} target/actual data mismatch.`);
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
          console.error(`FAIL: Modal did not open for ${monthCode}`);
        }
      }
    } else {
      console.error(`FAIL: Click target for ${monthCode} not found.`);
    }
  };

  // Test Nov
  await testMonth('Nov', '₹92.4 Cr', '₹93.0 Cr');
  
  // Test Dec
  await testMonth('Dec', '₹95.1 Cr', '₹96.0 Cr');

  console.log("Closing browser...");
  await browser.close();
}

run().catch(console.error);
