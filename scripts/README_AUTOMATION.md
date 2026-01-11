Automated POS verification

This file explains the two automation options: local shell runner and Docker container.

Option A — Local shell runner
1. Ensure you have Node.js installed (v18+ recommended) and npm / corepack available.
2. From repository root, run:

```bash
# make script executable
chmod +x scripts/auto_run_pos_verification.sh

# Run with session cookie (recommended):
COOKIE='session=abc123; other=def' ./scripts/auto_run_pos_verification.sh

# Or run with credentials:
EMAIL='umar@yopmail.com' PASSWORD='P@ssw0rd' ./scripts/auto_run_pos_verification.sh
```

The script will install `pnpm` (via corepack or npm), install `puppeteer` locally, and run the verifier. Outputs (screenshots/logs) will be written to `tmp/pos-verification`.

Option B — Docker runner
1. Build the Docker image from repo root:

```bash
docker build -t pos-verifier -f scripts/pos_verifier.Dockerfile .
```

2. Run the container (mount a local output dir to collect artifacts):

```bash
mkdir -p tmp/pos-verification
# Cookie example
docker run --rm -e COOKIE='session=abc123; other=def' -v "$PWD/tmp/pos-verification":/app/tmp pos-verifier

# Or with credentials
docker run --rm -e EMAIL='umar@yopmail.com' -e PASSWORD='P@ssw0rd' -v "$PWD/tmp/pos-verification":/app/tmp pos-verifier
```

After the run, inspect `tmp/pos-verification` for screenshots and `console.log`.

If you prefer, paste the `console.log` and screenshots here and I'll analyze them and propose further fixes.