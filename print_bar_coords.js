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

  const barsData = await page.evaluate(() => {
    const rects = Array.from(document.querySelectorAll('.recharts-bar-rectangle'));
    return rects.map((rect, idx) => {
      const box = rect.getBoundingClientRect();
      // Try to find if there is a parent chart container or find its height/width
      return {
        index: idx,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        parentClass: rect.parentElement ? rect.parentElement.className : 'unknown'
      };
    });
  });

  console.log("Bars on screen:");
  console.log(JSON.stringify(barsData, null, 2));

  await browser.close();
}

run().catch(console.error);
