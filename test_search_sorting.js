import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser for search sorting test...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  console.log("Navigating to dashboard...");
  await page.goto('http://localhost:3000/#tab=0&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  console.log("Locating the global search input...");
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    console.log("Found search input. Focus and typing 'm'...");
    await searchInput.focus();
    await searchInput.type('m');

    await new Promise(r => setTimeout(r, 2000));

    console.log("Retrieving suggestions from the dropdown...");
    const suggestions = await page.evaluate(() => {
      // Find all buttons inside the autocomplete popup container
      const buttons = Array.from(document.querySelectorAll('button[id^="search-item-"]'));
      return buttons.map(b => {
        const titleEl = b.querySelector('p');
        return titleEl ? titleEl.innerText : '';
      }).filter(Boolean);
    });

    console.log("--- Autocomplete Suggestions list for 'm' ---");
    console.log(suggestions);
    console.log("---------------------------------------------");

    // Check if suggestions are sorted properly:
    // Items starting with 'm' should appear before items that don't start with 'm' but contain it, within their categories.
    // Let's verify that the order contains items starting with M first where possible, or print out a classification:
    let outOfOrder = false;
    let seenNonStart = false;
    
    // We will inspect items category by category
    const categorizedSuggestions = await page.evaluate(() => {
      const container = document.querySelector('div.max-h-\\[260px\\]');
      if (!container) return [];
      
      const results = [];
      const wrappers = Array.from(container.children);
      
      for (const wrapper of wrappers) {
        // Find category header inside wrapper
        const header = wrapper.querySelector('div.px-3\\.5.py-1');
        const currentCategory = header ? header.innerText.trim() : 'Unknown';
        
        // Find buttons inside wrapper
        const buttons = Array.from(wrapper.querySelectorAll('button[id^="search-item-"]'));
        buttons.forEach(b => {
          const titleEl = b.querySelector('p');
          if (titleEl) {
            results.push({ category: currentCategory, name: titleEl.innerText });
          }
        });
      }
      return results;
    });

    console.log("--- Categorized Suggestions Verification ---");
    const categories = Array.from(new Set(categorizedSuggestions.map(s => s.category)));
    
    categories.forEach(cat => {
      console.log(`\nCategory: ${cat}`);
      const catItems = categorizedSuggestions.filter(s => s.category === cat).map(s => s.name);
      
      let seenNonPrefix = false;
      let seenNonWordPrefix = false;
      
      catItems.forEach((name, idx) => {
        const startsWithM = name.toLowerCase().startsWith('m');
        const wordStartsWithM = name.toLowerCase().split(/\s+/).some(w => w.startsWith('m'));
        
        let classification = '';
        if (startsWithM) {
          classification = '[Starts with M]';
          if (seenNonPrefix) {
            console.log(`⚠️ WARNING: ${name} (starts with M) appeared after a non-M prefix item!`);
            outOfOrder = true;
          }
        } else if (wordStartsWithM) {
          classification = '[Word starts with M]';
          seenNonPrefix = true;
          if (seenNonWordPrefix) {
            console.log(`⚠️ WARNING: ${name} (word starts with M) appeared after a non-word M prefix item!`);
            outOfOrder = true;
          }
        } else {
          classification = '[Contains M elsewhere]';
          seenNonPrefix = true;
          seenNonWordPrefix = true;
        }
        
        console.log(`  ${idx + 1}. ${name} ${classification}`);
      });
    });
    
    if (outOfOrder) {
      console.error("\n❌ Test Failed: Sorting order does not match prefix priority.");
    } else {
      console.log("\n✅ Test Passed: Autocomplete suggestions correctly prioritized prefix matches!");
    }

    // Capture screenshot of dropdown
    const screenshotPath = 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\brain\\6470fd70-a4a4-4b87-a99d-d8ddeb36d56a\\scratch\\search_sorting_m.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved verification screenshot to: ${screenshotPath}`);

  } else {
    console.error("Could not find global search input.");
  }

  await browser.close();
}

run().catch(console.error);
