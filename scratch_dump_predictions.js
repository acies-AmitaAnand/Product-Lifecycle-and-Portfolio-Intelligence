import puppeteer from 'puppeteer';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  console.log("Navigating to http://localhost:3001/...");
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });

  console.log("Selecting VP Product Management role...");
  const cards = await page.$$('div.group');
  if (cards.length > 0) {
    await cards[0].click();
  }
  await new Promise(r => setTimeout(r, 2000));

  console.log("Clicking Launch Readiness tab...");
  const buttons = await page.$$('aside button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Launch Readiness')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }

  // Find and click the button with title="Table View"
  console.log("Clicking Table View button...");
  const tableViewBtn = await page.waitForSelector('button[title="Table View"]');
  if (tableViewBtn) {
    await tableViewBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  const dump = await page.evaluate(() => {
    const tableDiv = document.querySelector('button[title="Table View"]').closest('div').parentNode.parentNode.querySelector('table').parentNode;
    const table = document.querySelector('button[title="Table View"]').closest('div').parentNode.parentNode.querySelector('table');
    const tableBox = tableDiv ? tableDiv.getBoundingClientRect() : null;
    const innerTableBox = table ? table.getBoundingClientRect() : null;

    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
      const rect = tr.getBoundingClientRect();
      return { cells, rect: { top: rect.top, bottom: rect.bottom, height: rect.height } };
    });

    return {
      tableDiv: {
        className: tableDiv ? tableDiv.className : '',
        box: tableBox ? { top: tableBox.top, bottom: tableBox.bottom, height: tableBox.height } : null,
        scrollHeight: tableDiv ? tableDiv.scrollHeight : 0,
        clientHeight: tableDiv ? tableDiv.clientHeight : 0,
      },
      table: {
        box: innerTableBox ? { top: innerTableBox.top, bottom: innerTableBox.bottom, height: innerTableBox.height } : null,
      },
      rows
    };
  });

  console.log("---------------- TABLE DOM ANALYSIS ----------------");
  console.log("Table Wrapper Div:", dump.tableDiv);
  console.log("Inner Table Bounding Box:", dump.table.box);
  console.log("Rows Found:", dump.rows.length);
  dump.rows.forEach((r, idx) => {
    console.log(`[Row ${idx}]:`, r.cells, "Bounding Box:", r.rect);
  });
  console.log("----------------------------------------------------");

  await browser.close();
}

run().catch(console.error);
