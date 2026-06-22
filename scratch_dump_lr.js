import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    console.log(`[BROWSER LOG] [${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGEERROR]:`, err);
  });

  console.log("Navigating to http://localhost:3003/...");
  
  // Pre-populate storage to bypass WelcomeGate and go directly to Tab 2
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('acies_session_active', 'true');
    localStorage.setItem('acies_role', 'VP Product Management');
    localStorage.setItem('acies_active_tab', '2');
  });

  await page.goto('http://localhost:3003/#tab=2&role=VP+Product+Management', { waitUntil: 'networkidle2' });

  // Wait for transition to main dashboard
  console.log("Waiting for page load...");
  await new Promise(r => setTimeout(r, 6000));

  // Capture screenshot of the dashboard (Bar view)
  const screenshotPathBar = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707\\vp_launch_readiness_tab_bar.png';
  await page.screenshot({ path: screenshotPathBar });
  console.log(`Saved bar dashboard screenshot to ${screenshotPathBar}`);

  // Click Pie toggle button
  console.log("Clicking Pie button...");
  await page.evaluate(() => {
    const pieButton = document.querySelector('button[title="Pie Chart"]');
    if (pieButton) {
      pieButton.click();
    } else {
      console.error("Pie button not found");
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Capture screenshot of the dashboard (Pie view)
  const screenshotPathPie = 'C:\\Users\\Amita\\.gemini\\antigravity\\brain\\b74d4ee7-8698-4d96-b005-78a14541a707\\vp_launch_readiness_tab_pie.png';
  await page.screenshot({ path: screenshotPathPie });
  console.log(`Saved pie dashboard screenshot to ${screenshotPathPie}`);

  // Dump the Launch Pipeline Overview content
  const overviewHtml = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('span'));
    const heading = headings.find(h => h.textContent && h.textContent.includes("Launch Pipeline Overview"));
    if (!heading) return "Launch Pipeline Overview heading not found";
    
    // Find parent container of the section
    let parent = heading.parentElement;
    while (parent && !parent.className.includes("col-span-7") && !parent.className.includes("col-span-12")) {
      parent = parent.parentElement;
    }
    return parent ? parent.innerHTML : "Parent container not found";
  });

  console.log("---------------- LAUNCH PIPELINE HTML ----------------");
  console.log(overviewHtml);
  console.log("------------------------------------------------------");

  await browser.close();
}

run().catch(console.error);
