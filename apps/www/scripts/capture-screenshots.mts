import puppeteer from "puppeteer"

const BLOCKS = [
  "login-01",
  "sidebar-01",
  "sidebar-02",
  "sidebar-03",
  "sidebar-04",
  "sidebar-05",
  "sidebar-06",
  "sidebar-07",
  "sidebar-08",
  "sidebar-09",
  "sidebar-10",
  "sidebar-11",
  "sidebar-12",
  "sidebar-13",
  "sidebar-14",
  "sidebar-15",
  "demo-sidebar",
  "demo-sidebar-header",
  "demo-sidebar-footer",
  "demo-sidebar-group",
  "demo-sidebar-group-collapsible",
  "demo-sidebar-group-action",
  "demo-sidebar-menu",
  "demo-sidebar-menu-action",
  "demo-sidebar-menu-sub",
  "demo-sidebar-menu-collapsible",
  "demo-sidebar-menu-badge",
  "demo-sidebar-rsc",
  "demo-sidebar-controlled",
]

try {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
  })

  console.log("☀️ Capturing screenshots for light theme")
  for (const block of BLOCKS) {
    const pageUrl = `http://localhost:3333/blocks/new-york/${block}`
    console.log(`- ${block}`)

    const page = await browser.newPage()
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    })

    // Hide Tailwind indicator
    await page.evaluate(() => {
      const indicator = document.querySelector("[data-tailwind-indicator]")
      if (indicator) {
        indicator.remove()
      }
    })

    await page.screenshot({
      path: `./public/images/blocks/${block}.png`,
    })
  }

  console.log("🌙 Capturing screenshots for dark theme")
  for (const block of BLOCKS) {
    const pageUrl = `http://localhost:3333/blocks/new-york/${block}`
    console.log(`- ${block}`)

    const page = await browser.newPage()
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    })

    // Hide Tailwind indicator
    await page.evaluate(() => {
      const indicator = document.querySelector("[data-tailwind-indicator]")
      if (indicator) {
        indicator.remove()
      }
    })

    // Set theme to dark
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark")
    })

    await page.screenshot({
      path: `./public/images/blocks/${block}-dark.png`,
    })
  }

  await browser.close()
  console.log("✅ Done!")
} catch (error) {
  console.error(error)
  process.exit(1)
}
