import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to http://localhost:3003/...");
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('acies_session_active', 'true');
    localStorage.setItem('acies_role', 'VP Product Management');
    localStorage.setItem('acies_active_tab', '2');
  });

  await page.goto('http://localhost:3003/#tab=2&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  console.log("Waiting for page load...");
  await new Promise(r => setTimeout(r, 6000));

  const domSummary = await page.evaluate(() => {
    // Check role from header to confirm it is VP
    const headerRoleEl = document.querySelector('header span, header select, button span');
    const headerRole = headerRoleEl ? headerRoleEl.textContent : "Not found";

    // Dump all h2, h3, h4 and section titles
    const cards = Array.from(document.querySelectorAll('.glass-card, div[class*="border"]')).map(el => {
      const texts = Array.from(el.querySelectorAll('p, span, h2, h3, h4, th, td')).map(t => t.textContent.trim()).filter(Boolean);
      return {
        className: el.className,
        texts: texts.slice(0, 15) // Keep first 15 text elements
      };
    });

    return { headerRole, cards: cards.slice(0, 10) };
  });

  console.log("---------------- DOM ANALYSIS ----------------");
  console.log("Header Role:", domSummary.headerRole);
  console.log("Cards/Blocks Found:");
  domSummary.cards.forEach((c, idx) => {
    console.log(`[Card ${idx}]: Class: ${c.className.substring(0, 60)}...`);
    console.log(`         Texts:`, c.texts);
  });
  console.log("----------------------------------------------");

  await browser.close();
}

run().catch(console.error);
