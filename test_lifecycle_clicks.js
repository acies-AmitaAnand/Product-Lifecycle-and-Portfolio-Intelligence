import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1050 });

  // Forward console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Test Case 1: VP View hover and click SKU
  console.log("Navigating to VP Product Management View...");
  await page.goto('http://localhost:3000/#tab=1&role=VP+Product+Management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Hover over Decline stage card to show popover
  console.log("Hovering over Decline card...");
  const declineCard = await page.evaluateHandle(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    const labelSpan = spans.find(s => s.innerText && s.innerText.toUpperCase().trim() === 'DECLINE');
    if (!labelSpan) return null;
    let parent = labelSpan.parentElement;
    while (parent && !parent.className.includes('p-2.5')) {
      parent = parent.parentElement;
    }
    return parent;
  });

  if (declineCard) {
    await page.evaluate(el => el.scrollIntoView(), declineCard);
    await declineCard.hover();
    await new Promise(r => setTimeout(r, 1000));

    // Find a SKU button inside the popover and click it
    console.log("Clicking 'Green Tea RTD' product button inside popover...");
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const productBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'GREEN TEA RTD');
      if (productBtn) {
        productBtn.click();
        return true;
      }
      return false;
    });

    console.log(`[TEST 1] Clicked SKU in popover: ${clicked}`);
    if (!clicked) {
      throw new Error("Could not click product tag in hover popover");
    }

    await new Promise(r => setTimeout(r, 1500));

    // Take screenshot showing the modal
    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_sku_modal_opened.png' });
    console.log("Saved SKU modal screenshot to screenshot_sku_modal_opened.png");

    // Verify modal is open and showing SKU info
    const modalData = await page.evaluate(() => {
      const modalContainers = Array.from(document.querySelectorAll('div.fixed.inset-0'));
      const modalContainer = modalContainers.find(el => el.innerText && el.innerText.toUpperCase().includes("QTD REVENUE"));
      if (!modalContainer) {
        return { title: 'None', isModalVisible: false };
      }
      const header = modalContainer.querySelector('h2');
      return {
        title: header ? header.innerText : 'None',
        isModalVisible: true
      };
    });

    console.log(`[TEST 2] SKU Modal visible: ${modalData.isModalVisible}`);
    console.log(`[TEST 2] SKU Modal Title: ${modalData.title}`);
    
    if (modalData.title.toUpperCase().trim() !== 'GREEN TEA RTD') {
      throw new Error(`Expected modal title 'Green Tea RTD', got '${modalData.title}'`);
    }

    // Click Close Analysis button
    console.log("Closing SKU modal...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'CLOSE ANALYSIS');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  } else {
    throw new Error("Decline card hover target not found");
  }

  // Test Case 2: Standard View hover and click SKU
  console.log("Switching role to Product Manager via Header dropdown...");
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const roleSelect = selects.find(sel => Array.from(sel.options).some(opt => opt.value === 'Product Manager'));
    if (roleSelect) {
      roleSelect.value = 'Product Manager';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  // Hover over Introduction stage card
  console.log("Hovering over Introduction card in Product Manager view...");
  const introCard = await page.evaluateHandle(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    const labelSpan = spans.find(s => s.innerText && s.innerText.toUpperCase().trim() === 'INTRODUCTION');
    if (!labelSpan) return null;
    let parent = labelSpan.parentElement;
    while (parent && !parent.className.includes('p-2.5')) {
      parent = parent.parentElement;
    }
    return parent;
  });

  if (introCard) {
    await page.evaluate(el => el.scrollIntoView(), introCard);
    await introCard.hover();
    await new Promise(r => setTimeout(r, 1000));

    // Click first SKU button in the intro popover list
    const productClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      console.log('All buttons on page:', buttons.map(b => b.innerText.trim()).filter(Boolean).join(' | '));
      
      // Look for buttons that represent product tags (contain BrandF, Eco, Mango, etc.)
      const productBtn = buttons.find(btn => btn.innerText.toUpperCase().includes("BRANDF WATER"));
      if (productBtn) {
        productBtn.click();
        return productBtn.innerText;
      }
      
      // Let's print out specifically the buttons inside the absolute popovers
      const popover = document.querySelector('div.absolute.z-30');
      if (popover) {
        console.log('Popover buttons:', Array.from(popover.querySelectorAll('button')).map(b => b.innerText).join(', '));
        const firstBtn = popover.querySelector('button');
        if (firstBtn) {
          firstBtn.click();
          return firstBtn.innerText;
        }
      }
      
      return null;
    });

    console.log(`[TEST 3] Clicked SKU name: ${productClicked}`);
    await new Promise(r => setTimeout(r, 1500));

    // Assert that the SkuDetailsModal is open
    const isModalOpenPM = await page.evaluate(() => {
      const modalContainers = Array.from(document.querySelectorAll('div.fixed.inset-0'));
      const modalContainer = modalContainers.find(el => el.innerText && el.innerText.toUpperCase().includes("QTD REVENUE"));
      if (!modalContainer) return 'None';
      const header = modalContainer.querySelector('h2');
      return header ? header.innerText : 'None';
    });
    console.log(`[TEST 4] Product Manager view SKU Modal Title: ${isModalOpenPM}`);

    if (isModalOpenPM === 'None') {
      throw new Error("SKU Details Modal did not open in Product Manager view");
    }

    // Click Request Plan on the first action item in PM view to check toasts
    console.log("Clicking 'Request Plan' button to verify Toast notification in standard view...");
    const toastMessage = await page.evaluate(async () => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const reqPlanBtn = buttons.find(btn => btn.innerText.toUpperCase().trim() === 'REQUEST PLAN');
      if (reqPlanBtn) {
        reqPlanBtn.click();
        // Wait a bit and check for toasts
        await new Promise(r => setTimeout(r, 1000));
        const toast = Array.from(document.querySelectorAll('div')).find(div => div.innerText && div.innerText.toUpperCase().includes("ACTION PLAN REQUEST LOGGED"));
        return toast ? toast.innerText.replace(/\n/g, ' | ') : 'Toast not found';
      }
      return 'Request Plan button not found';
    });
    console.log(`[TEST 5] Toast notification output: ${toastMessage}`);

    await page.screenshot({ path: 'C:\\Users\\Sree Vyshnavi\\.gemini\\antigravity\\scratch\\screenshot_sku_toast_standard.png' });
    console.log("Saved standard toast screenshot to screenshot_sku_toast_standard.png");
  } else {
    throw new Error("Introduction card hover target not found");
  }

  await browser.close();
  console.log("All UI click assertions completed successfully.");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
