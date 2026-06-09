import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  console.log("Navigating to Vercel dashboard...");
  await page.goto('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/', { waitUntil: 'networkidle2' });

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
  
  // Verify header exists
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasHeader = bodyText.includes("Executive Command Center");
  console.log("Has header 'Executive Command Center'? ", hasHeader);

  // Locate search input
  const searchInputSelector = 'input[placeholder*="Search metrics"]';
  await page.waitForSelector(searchInputSelector);
  
  console.log("Typing 'mango' in search box...");
  await page.type(searchInputSelector, 'mango');
  await new Promise(r => setTimeout(r, 1000));

  // Check if dropdown suggestions are shown
  let dropdownText = await page.evaluate(() => {
    const el = document.querySelector('div.absolute.top-full');
    return el ? el.innerText : null;
  });
  console.log("Dropdown text after typing 'mango':", dropdownText ? dropdownText.replace(/\n/g, ' ') : 'NULL');

  // Click on "Mango Fizz 500ml" suggestion
  console.log("Clicking 'Mango Fizz 500ml' SKU suggestion...");
  const suggestions = await page.$$('button');
  for (const button of suggestions) {
    const text = await page.evaluate(el => el.innerText, button);
    if (text.includes("Mango Fizz 500ml")) {
      await button.click();
      console.log("Clicked suggestion card!");
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // Capture screenshot of SKU Modal
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_search_sku_modal.png' });
  console.log("Screenshot saved to screenshot_search_sku_modal.png");

  // Close SKU Modal
  console.log("Closing SKU Details Modal...");
  const closeButtons = await page.$$('button');
  for (const btn of closeButtons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.toUpperCase().includes("CLOSE")) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Clear search input (it should already be cleared by click action)
  console.log("Focusing search input again using keyboard Ctrl+K shortcut...");
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyK');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 500));

  console.log("Typing 'Revenue' in search box...");
  await page.type(searchInputSelector, 'Revenue');
  await new Promise(r => setTimeout(r, 1000));

  dropdownText = await page.evaluate(() => {
    const el = document.querySelector('div.absolute.top-full');
    return el ? el.innerText : null;
  });
  console.log("Dropdown text after typing 'Revenue':", dropdownText ? dropdownText.replace(/\n/g, ' ') : 'NULL');

  console.log("Clicking 'Total Revenue' metric suggestion...");
  const suggestions2 = await page.$$('button');
  for (const button of suggestions2) {
    const text = await page.evaluate(el => el.innerText, button);
    if (text.includes("Total Revenue")) {
      await button.click();
      console.log("Clicked metric suggestion!");
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));

  // Capture screenshot of Audit Drawer
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_search_audit_drawer.png' });
  console.log("Screenshot saved to screenshot_search_audit_drawer.png");

  await browser.close();
}

run().catch(console.error);
