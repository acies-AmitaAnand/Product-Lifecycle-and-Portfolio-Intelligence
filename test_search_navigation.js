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

  console.log("Navigating to local site (or Vercel)...");
  // We will target the live staging URL to verify or run against local port if active
  const targetUrl = 'https://product-lifecycle-and-portfolio-int-orpin.vercel.app/';
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  // Handle welcome gate if present
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
    console.log("No Welcome Gate screen found (or already passed), continuing...");
  }

  await new Promise(r => setTimeout(r, 2000));

  // 1. Verify standard forward slash '/' focuses search
  console.log("Testing standard forward slash '/' focus...");
  await page.keyboard.press('/');
  await new Promise(r => setTimeout(r, 500));

  let isSearchFocused = await page.evaluate(() => {
    const activeEl = document.activeElement;
    return activeEl && activeEl.placeholder && activeEl.placeholder.includes("Search metrics");
  });
  console.log("Is search focused after pressing '/'? ", !!isSearchFocused);

  // Blur search by pressing Escape
  console.log("Pressing Escape to blur...");
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // 2. Focus search again using Ctrl+K
  console.log("Testing Ctrl+K global hotkey...");
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyK');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 500));

  isSearchFocused = await page.evaluate(() => {
    const activeEl = document.activeElement;
    return activeEl && activeEl.placeholder && activeEl.placeholder.includes("Search metrics");
  });
  console.log("Is search focused after Ctrl+K? ", !!isSearchFocused);

  // 3. Type "health" to search for the Portfolio Health Map tab
  console.log("Typing 'health' to find navigation tabs...");
  const searchInputSelector = 'input[placeholder*="Search metrics"]';
  await page.type(searchInputSelector, 'health');
  await new Promise(r => setTimeout(r, 1000));

  // Check suggestion content
  let suggestionsText = await page.evaluate(() => {
    const el = document.querySelector('div.absolute.top-full');
    return el ? el.innerText : null;
  });
  console.log("Dropdown text for 'health':", suggestionsText ? suggestionsText.replace(/\n/g, ' | ') : 'NULL');

  // 4. Keyboard navigate down and select Tab
  console.log("Pressing ArrowDown to highlight the suggestion...");
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 300));

  // Verify highlighted item
  let activeIndex = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div.absolute.top-full button'));
    const highlighted = items.find(el => el.className.includes('bg-acies-yellow/20') || el.className.includes('dark:bg-white/10'));
    return highlighted ? highlighted.innerText : 'NONE';
  });
  console.log("Highlighted item after ArrowDown:", activeIndex.replace(/\n/g, ' | '));

  console.log("Pressing Enter to activate selected navigation tab...");
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 2000));

  // Verify tab URL hash has updated
  const currentUrl = page.url();
  console.log("Current URL after selection (should contain tab=1):", currentUrl);

  // 5. Test multi-word SKU searching and cycling
  console.log("Focusing search again via Ctrl+K...");
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyK');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 500));

  console.log("Typing 'Chips Snacks' (flexible search query)...");
  await page.type(searchInputSelector, 'Chips Snacks');
  await new Promise(r => setTimeout(r, 1000));

  suggestionsText = await page.evaluate(() => {
    const el = document.querySelector('div.absolute.top-full');
    return el ? el.innerText : null;
  });
  console.log("Dropdown text for 'Chips Snacks':", suggestionsText ? suggestionsText.replace(/\n/g, ' | ') : 'NULL');

  console.log("Pressing ArrowDown twice...");
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 200));

  console.log("Pressing ArrowUp once...");
  await page.keyboard.press('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  console.log("Pressing Enter to select...");
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 2000));

  // Take a screenshot of the resulting modal / page state
  await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_search_test_result.png' });
  console.log("Screenshot saved to screenshot_search_test_result.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

run().catch(console.error);
