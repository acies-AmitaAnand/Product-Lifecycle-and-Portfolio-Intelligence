import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  await page.goto('http://localhost:5173/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  // Check if onboarding is visible
  const bodyTextBefore = await page.evaluate(() => document.body.innerText);
  console.log("Onboarding visible?", bodyTextBefore.includes("Select Your Role"));

  if (bodyTextBefore.includes("Select Your Role")) {
    const roleSelector = 'div.group';
    const cards = await page.$$(roleSelector);
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes("VP Product Management")) {
        await card.click();
        console.log("Clicked onboarding");
        break;
      }
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  const cards = await page.$$('div');
  console.log("Total divs on page:", cards.length);

  const cardTexts = [];
  for (const card of cards) {
    const text = await page.evaluate(el => {
      // only if it has no children that are also cards or if it's a glass-card
      if (el.classList.contains('glass-card')) {
        return el.innerText;
      }
      return null;
    }, card);
    if (text) cardTexts.push(text);
  }

  console.log("Found glass-cards:", cardTexts.length);
  cardTexts.forEach((t, i) => {
    console.log(`Card ${i}:`, t.replace(/\n/g, ' | '));
  });

  await browser.close();
}

run().catch(console.error);
