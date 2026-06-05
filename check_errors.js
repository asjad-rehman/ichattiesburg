const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  console.log('Navigating...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Page loaded successfully.');
    await new Promise(r => setTimeout(r, 2000)); // Wait for hydration
  } catch (err) {
    console.error('Navigation failed:', err.message);
  }
  
  await browser.close();
  process.exit(0);
})();
