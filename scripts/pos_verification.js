// pos_verification.js
// Usage examples:
// COOKIE='session=abc; other=def' node scripts/pos_verification.js
// EMAIL=test@example.com PASSWORD=TestPass123! node scripts/pos_verification.js

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
  const COOKIE = process.env.COOKIE || null; // full cookie header string, e.g. "session=abc; other=def"
  const EMAIL = process.env.EMAIL || null;
  const PASSWORD = process.env.PASSWORD || null;
  const OUTPUT = process.env.OUTPUT_DIR || 'tmp/pos-verification';

  if (!COOKIE && (!EMAIL || !PASSWORD)) {
    console.error('ERROR: Provide either COOKIE or EMAIL+PASSWORD as env vars.');
    console.error('Example (cookie): COOKIE="session=abc; other=def" node scripts/pos_verification.js');
    console.error('Example (creds): EMAIL=test@example.com PASSWORD=TestPass123! node scripts/pos_verification.js');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    console.log(text);
  });

  // Capture page errors
  page.on('pageerror', err => {
    consoleLogs.push(`[pageerror] ${err.toString()}`);
    console.error('Page error:', err);
  });

  // If cookie provided, set it on the page by parsing key/value pairs
  if (COOKIE) {
    const cookiePairs = COOKIE.split(';').map(p => p.trim()).filter(Boolean);
    const cookies = cookiePairs.map(pair => {
      const idx = pair.indexOf('=');
      const name = pair.substring(0, idx).trim();
      const value = pair.substring(idx + 1).trim();
      return { name, value, domain: 'localhost', path: '/' };
    });
    await page.setCookie(...cookies);
    console.log('Set cookies from COOKIE env var');
  } else {
    // Try to sign in using provided EMAIL/PASSWORD by navigating to /login
    const loginUrl = `${BASE_URL}/login`;
    console.log('Signing in at', loginUrl);
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });

    // Attempt common form selectors
    try {
      await page.type('input[type="email"], input[name="email"], input[name="username"]', EMAIL, { delay: 50 });
      await page.type('input[type="password"], input[name="password"]', PASSWORD, { delay: 50 });
      // Try to find a submit button
      const submit = await page.$('button[type="submit"], input[type="submit"], button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login")');
      if (submit) {
        await submit.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      console.log('Login attempt finished, current URL:', page.url());
    } catch (err) {
      console.error('Login automated fill failed:', err);
    }
  }

  // Navigate to POS checkout
  const posUrl = `${BASE_URL}/erp/pos/checkout`;
  console.log('Opening POS checkout at', posUrl);
  await page.goto(posUrl, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(OUTPUT, 'pos_page.png'), fullPage: true });

  // Open Select Customer dialog by clicking the Select/Change button
  try {
    // Try to locate the Select/Change button: looks for button text 'Select' or 'Change' near 'User' icon
    const button = await page.$x("//button[contains(., 'Select') or contains(., 'Change')]");
    if (button && button.length > 0) {
      await button[0].click();
      console.log('Clicked customer select button');
    } else {
      // fallback: click the first button with aria-label or title 'Select Customer'
      const alt = await page.$('button[aria-label*="customer"], button[title*="customer"]');
      if (alt) { await alt.click(); console.log('Clicked alt customer button'); }
    }
    await page.waitForTimeout(500);

    // Type 's' then screenshot, then 'sa'
    const input = await page.$('input[placeholder*="Search customers"], input[placeholder*="Search"]');
    if (!input) {
      console.warn('Customer search input not found');
    } else {
      await input.click({ clickCount: 3 });
      await input.type('s', { delay: 100 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUTPUT, 'customer_search_s.png') });

      await input.click({ clickCount: 3 });
      await input.type('sa', { delay: 100 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUTPUT, 'customer_search_sa.png') });

      // Capture the inner HTML of the dialog for inspection
      const dialogHtml = await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]') || document.querySelector('.dialog');
        return dlg ? dlg.innerHTML : document.body.innerHTML.slice(0, 5000);
      });
      fs.writeFileSync(path.join(OUTPUT, 'customer_dialog.html'), dialogHtml);
    }
  } catch (err) {
    console.error('Error interacting with customer dialog:', err);
  }

  // Open payment dialog by clicking Checkout and then clicking the pay button to open MultiPaymentSplit
  try {
    // Click the Checkout button
    const checkoutBtn = await page.$x("//button[contains(., 'Checkout')]");
    if (checkoutBtn && checkoutBtn.length > 0) {
      await checkoutBtn[0].click();
      console.log('Clicked Checkout button');
      await page.waitForTimeout(500);

      // Click the payment area or button that opens the payment modal
      const payBtn = await page.$x("//button[contains(., 'Checkout') or contains(., 'Pay')]");
      if (payBtn && payBtn.length > 1) {
        // second matching might be the modal trigger
        await payBtn[1].click().catch(() => {});
      }
      // Alternative: try to open the MultiPaymentSplit directly via selector
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUTPUT, 'after_checkout_click.png') });

      // Try to detect dialog and scroll it
      const dialogSelector = '[role="dialog"] .max-h-[90vh], [role="dialog"] .dialog-content, [role="dialog"] .overflow-auto';
      const dlg = await page.$(dialogSelector);
      if (dlg) {
        await dlg.evaluate(el => { el.scrollTop = el.scrollHeight; });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(OUTPUT, 'payment_dialog_scrolled.png') });
      } else {
        console.log('Payment dialog not detected for scroll test');
      }
    } else {
      console.warn('Checkout button not found');
    }
  } catch (err) {
    console.error('Error interacting with payment dialog:', err);
  }

  // Save console logs to file
  fs.writeFileSync(path.join(OUTPUT, 'console.log'), consoleLogs.join('\n'));
  console.log('Saved logs and screenshots to', OUTPUT);

  await browser.close();
  process.exit(0);
})();
