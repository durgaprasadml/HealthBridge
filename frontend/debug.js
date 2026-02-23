import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('RESPONSE ERROR', res.status(), res.url());
    }
  });

  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
    console.log('navigation complete');
  } catch (e) {
    console.error('goto error', e);
  }

  await browser.close();
})();
