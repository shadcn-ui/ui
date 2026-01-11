POS verification script

This repository includes a small Puppeteer script to perform an authenticated headless verification of the POS checkout flows (customer quick search + payment modal scrolling). Use this locally on your dev machine where the app is running at `http://localhost:4000`.

Prerequisites
- Node 16+ installed
- Dev server running at `http://localhost:4000`

Install Puppeteer

```bash
npm install puppeteer --no-save
```

Run using a session cookie (recommended):

```bash
# Provide your Cookie header string (from browser devtools) as COOKIE env var
COOKIE='session=abc123; other=def456' node scripts/pos_verification.js
```

Run using credentials (the script will try to POST to `/login` using common selectors):

```bash
EMAIL='test@example.com' PASSWORD='TestPass123!' node scripts/pos_verification.js
```

Other env vars
- `BASE_URL` default `http://localhost:4000`
- `OUTPUT_DIR` default `tmp/pos-verification`

Outputs
- Screenshots and logs saved under `tmp/pos-verification` (or the supplied `OUTPUT_DIR`):
  - `pos_page.png` — initial POS page screenshot
  - `customer_search_s.png` — screenshot after typing `s`
  - `customer_search_sa.png` — screenshot after typing `sa`
  - `customer_dialog.html` — inner HTML of the open dialog (for fast inspection)
  - `after_checkout_click.png` — screenshot after clicking Checkout
  - `payment_dialog_scrolled.png` — screenshot after attempting to scroll payment dialog
  - `console.log` — captured console messages and page errors

Security
- Use only non-production/dev credentials or a local session cookie. The script runs locally and does not transmit credentials.

If you want, paste the `console.log` and screenshots here and I will analyze the results and propose further fixes.