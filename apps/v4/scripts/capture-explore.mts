import { existsSync, mkdirSync } from "fs"
import path from "path"
import puppeteer from "puppeteer"
import { decodePreset } from "shadcn/preset"

import { EXPLORE_PRESETS } from "../lib/explore"

const PRESETS_PATH = path.join(process.cwd(), "public/presets")
const force = process.argv.includes("--force")

// ----------------------------------------------------------------------------
// Capture explore preset screenshots.
// ----------------------------------------------------------------------------
async function captureScreenshots() {
  // Ensure output directory exists.
  if (!existsSync(PRESETS_PATH)) {
    mkdirSync(PRESETS_PATH, { recursive: true })
  }

  const presets = force
    ? EXPLORE_PRESETS
    : EXPLORE_PRESETS.filter((code) => {
        const lightPath = path.join(PRESETS_PATH, `${code}-light.png`)
        const darkPath = path.join(PRESETS_PATH, `${code}-dark.png`)
        return !existsSync(lightPath) || !existsSync(darkPath)
      })

  if (presets.length === 0) {
    console.log("✨ All screenshots exist, nothing to capture")
    return
  }

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    },
  })

  for (const code of presets) {
    const decoded = decodePreset(code)
    if (!decoded) {
      console.warn(`⚠ Skipping invalid preset code: ${code}`)
      continue
    }

    const pageUrl = `http://localhost:4000/preview/radix/preview?preset=${code}`

    const page = await browser.newPage()
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    })

    console.log(`- Capturing ${code}...`)

    for (const theme of ["light", "dark"] as const) {
      const screenshotPath = path.join(
        PRESETS_PATH,
        `${code}-${theme}.png`
      )

      if (!force && existsSync(screenshotPath)) {
        continue
      }

      // Set theme and reload page.
      await page.evaluate((currentTheme) => {
        localStorage.setItem("theme", currentTheme)
      }, theme)

      await page.reload({ waitUntil: "networkidle2" })

      // Wait for animations to complete.
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Hide Tailwind indicator.
      await page.evaluate(() => {
        const indicator = document.querySelector("[data-tailwind-indicator]")
        if (indicator) {
          indicator.remove()
        }
      })

      // Capture the target element.
      const element = await page.$('[data-slot="capture-target"]')
      if (element) {
        await element.screenshot({
          path: screenshotPath,
        })
      } else {
        console.warn(`⚠ No [data-slot="capture-target"] found for ${code} (${theme}), capturing full page`)
        await page.screenshot({
          path: screenshotPath,
        })
      }
    }

    await page.close()
  }

  await browser.close()
}

try {
  console.log("🔍 Capturing explore preset screenshots...")

  await captureScreenshots()

  console.log("✅ Done!")
} catch (error) {
  console.error(error)
  process.exit(1)
}
