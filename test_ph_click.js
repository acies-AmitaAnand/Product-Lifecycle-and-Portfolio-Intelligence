import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  console.log("Navigating to Portfolio Health tab...");
  await page.goto('http://localhost:5173/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 3000));

  // Find and click Portfolio Revenue card
  const cards = await page.$$('div.glass-card');
  let targetCard = null;
  for (const card of cards) {
    const text = await page.evaluate(el => el.innerText, card);
    if (text.toLowerCase().includes("portfolio revenue")) {
      targetCard = card;
      console.log("Found card with text:", text.replace(/\n/g, ' | '));
      break;
    }
  }

  if (targetCard) {
    await targetCard.click();
    console.log("Clicked card.");
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if Audit Drawer is visible
    const drawerText = await page.evaluate(() => {
      const drawer = document.querySelector('aside.sidebar-panel') || document.querySelector('div.fixed') || document.body;
      const elements = Array.from(document.querySelectorAll('*'));
      const auditDrawer = elements.find(el => el.innerText && el.innerText.includes("SO WHAT?"));
      return auditDrawer ? auditDrawer.innerText : 'Not found';
    });
    console.log("Audit Drawer text snippet:", drawerText.substring(0, 200));

    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_ph_clicked.png' });
    console.log("Saved screenshot to screenshot_ph_clicked.png");
  } else {
    console.log("Portfolio Revenue card not found");
  }

  await browser.close();
}

run().catch(console.error);
