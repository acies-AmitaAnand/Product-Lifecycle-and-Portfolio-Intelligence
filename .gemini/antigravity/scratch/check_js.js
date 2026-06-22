import { execSync } from 'child_process';
import https from 'https';

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

async function main() {
  console.log("Fetching main page HTML...");
  const html = await getUrl('https://product-lifecycle-and-portfolio-int-orpin.vercel.app/');
  
  // Find JS bundle link
  const match = html.match(/src="([^"]+)"/);
  if (!match) {
    console.log("No script bundle found in HTML. Here is HTML snippet:");
    console.log(html.substring(0, 1000));
    return;
  }
  
  const jsUrl = 'https://product-lifecycle-and-portfolio-int-orpin.vercel.app' + match[1];
  console.log("Found JS bundle URL:", jsUrl);
  
  console.log("Fetching JS bundle content...");
  const js = await getUrl(jsUrl);
  
  const hasLog = js.includes("KPI card clicked on Home");
  console.log("Does the deployed JS contain 'KPI card clicked on Home'? ", hasLog);
}

main().catch(console.error);
