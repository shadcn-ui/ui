import { existsSync, promises as fs } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { getAllBlockIds } from "../lib/blocks";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------
/** Check if a file exists asynchronously */
const fileExists = (filePath: string) => existsSync(filePath);

/** Delay for a specified time */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Remove Tailwind indicator */
const removeTailwindIndicator = async (page: puppeteer.Page) => {
  await page.evaluate(() => {
    const indicator = document.querySelector("[data-tailwind-indicator]");
    if (indicator) indicator.remove();
  });
};

// ----------------------------------------------------------------------------
// Capture Screenshots for a Single Block
// ----------------------------------------------------------------------------
async function captureBlockScreenshots(
  page: puppeteer.Page,
  block: string,
  themes: string[] = ["light", "dark"]
) {
  const pageUrl = `http://localhost:3333/view/styles/new-york/${block}`;
  console.log(`- Capturing screenshots for block: ${block}`);

  await page.goto(pageUrl, { waitUntil: "networkidle2" });

  for (const theme of themes) {
    const screenshotPath = path.join(
      REGISTRY_PATH,
      `styles/new-york/${block}${theme === "dark" ? "-dark" : "-light"}.png`
    );

    if (fileExists(screenshotPath)) {
      console.log(`  ✅ Screenshot for ${theme} theme already exists.`);
      continue;
    }

    // Set theme and reload
    console.log(`  🌓 Capturing ${theme} theme...`);
    await page.evaluate((currentTheme) => {
      localStorage.setItem("theme", currentTheme);
    }, theme);

    await page.reload({ waitUntil: "networkidle2" });

    // Add delay for specific animations
    if (block.startsWith("chart")) {
      await delay(500);
    }

    await removeTailwindIndicator(page);

    // Take screenshot
    await page.screenshot({ path: screenshotPath });
    console.log(`  📸 Screenshot saved: ${screenshotPath}`);
  }
}

// ----------------------------------------------------------------------------
// Main Function to Capture Screenshots
// ----------------------------------------------------------------------------
async function captureScreenshots() {
  const blockIds = await getAllBlockIds();

  // Filter blocks where screenshots are missing
  const blocksToCapture = blockIds.filter((block) => {
    const lightPath = path.join(REGISTRY_PATH, `styles/new-york/${block}-light.png`);
    const darkPath = path.join(REGISTRY_PATH, `styles/new-york/${block}-dark.png`);
    return !fileExists(lightPath) || !fileExists(darkPath);
  });

  if (blocksToCapture.length === 0) {
    console.log("✨ All screenshots already exist, nothing to capture.");
    return;
  }

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
  });

  try {
    const page = await browser.newPage();

    for (const block of blocksToCapture) {
      await captureBlockScreenshots(page, block);
    }
  } catch (error) {
    console.error("❌ Error while capturing screenshots:", error);
  } finally {
    // Ensure browser is closed even on error
    await browser.close();
    console.log("✅ Done capturing screenshots.");
  }
}

// ----------------------------------------------------------------------------
// Execute Script
// ----------------------------------------------------------------------------
(async () => {
  console.log("🔍 Starting screenshot capture...");
  await captureScreenshots();
})();
