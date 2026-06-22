import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

  // Onboarding
  const roleSelector = 'div.group';
  try {
    await page.waitForSelector(roleSelector, { timeout: 4000 });
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        break;
      }
    }
  } catch (e) {}
  await new Promise(r => setTimeout(r, 2000));

  // Switch to Combi
  const toggles = await page.$$('button[title="Combi Chart (Bar + Line)"]');
  if (toggles.length > 0) {
    await toggles[0].click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Count bars first
  const count = await page.evaluate(() => document.querySelectorAll('.recharts-bar-rectangle').length);
  console.log(`Found ${count} bar elements.`);

  for (let i = 0; i < count; i++) {
    try {
      // Re-query the bar to avoid detachment
      const bar = await page.evaluateHandle((idx) => {
        return document.querySelectorAll('.recharts-bar-rectangle')[idx];
      }, i);
      
      const el = bar.asElement();
      if (el) {
        await el.click();
        await new Promise(r => setTimeout(r, 800));
        
        const modalTitle = await page.evaluate(() => {
          const titleEl = document.querySelector('h2');
          return titleEl ? titleEl.textContent : null;
        });

        if (modalTitle) {
          console.log(`Bar Index ${i} opened modal: "${modalTitle}"`);
          // Close modal
          const closeBtn = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(btn => btn.textContent.toUpperCase().includes('CLOSE'));
          });
          if (closeBtn) {
            const btnEl = closeBtn.asElement();
            if (btnEl) {
              await btnEl.click();
              await new Promise(r => setTimeout(r, 500));
            }
          }
        } else {
          console.log(`Bar Index ${i} did not open any modal.`);
        }
      }
    } catch (e) {
      console.log(`Error clicking bar ${i}:`, e.message);
    }
  }

  await browser.close();
}

run().catch(console.error);
