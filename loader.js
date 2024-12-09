const puppeteer = require('puppeteer');

async function detectAPIs(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const apiRequests = [];

  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      apiRequests.push(request.url());
    }
    request.continue();
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle0' });

    console.log(`Detected API requests (${apiRequests.length}):`);
    apiRequests.forEach((api, i) => console.log(`${i + 1}: ${api}`));
  } catch (error) {
    console.error(`Error navigating to ${url}: ${error.message}`);
  }

  await browser.close();
}

// Replace with your target website URL
const targetURL = 'https://www.sportsupd.com';
detectAPIs(targetURL);
