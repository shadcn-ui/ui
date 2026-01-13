# Font Migration Guide for Offline Builds

## Problem

The app currently uses `next/font/google` which requires internet access at build time to download fonts from Google Fonts. This will fail on offline/air-gapped systems.

## Solution: Use Local Fonts

### Step 1: Download Font Files

Download the font files you need from Google Fonts and place them in `apps/v4/public/fonts/`:

```bash
# Example structure:
apps/v4/public/fonts/
  ├── inter/
  │   ├── Inter-Variable.woff2
  │   └── Inter-Variable.woff
  ├── roboto/
  │   ├── Roboto-Regular.woff2
  │   └── Roboto-Regular.woff
  └── ...
```

### Step 2: Update Font Configuration

Replace `next/font/google` with `next/font/local`:

**Before:**

```typescript
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
```

**After:**

```typescript
import localFont from "next/font/local"

const inter = localFont({
  src: [
    {
      path: "../public/fonts/inter/Inter-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
})
```

### Step 3: Update All Font Files

You'll need to update:

- `apps/v4/app/(create)/lib/fonts.ts`
- `apps/v4/lib/fonts.ts`
- `apps/v4/registry/fonts.ts` (change `provider: "google"` to `provider: "local"`)
- Any generated code in `apps/v4/app/(create)/create/v0/route.ts`

## Alternative: Cache Fonts

If you can build once with internet:

1. Build the app on a machine with internet access
2. Copy the `.next/cache` directory to your offline build environment
3. Next.js will use cached fonts during offline builds

```bash
# On machine with internet
pnpm build

# Copy cache to offline machine
scp -r .next/cache user@offline-machine:/path/to/project/.next/
```

## Recommended Approach

For a production offline environment, **Option 2 (local fonts)** is more reliable because:

- No dependency on internet at any time
- Fonts are version-controlled
- Faster builds (no download step)
- More predictable builds

## Quick Start: Download Fonts Script

We've created a script to automatically download all fonts used in the app:

```bash
# From apps/v4 directory
pnpm fonts:download

# Or directly
node scripts/download-fonts.mjs
```

This will:

1. Download all Google Fonts used in the app
2. Save them to `public/fonts/` directory
3. Organize them by font family

After running the script, you'll need to:

1. Update font imports to use `next/font/local` (see Step 2 above)
2. Update font paths to point to the downloaded files
3. Commit the fonts directory to your repository
