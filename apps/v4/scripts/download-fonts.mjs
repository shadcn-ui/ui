#!/usr/bin/env node

/**
 * Script to download all Google Fonts used in the app for offline builds
 * Downloads fonts as ZIP files and extracts them
 * 
 * Usage: node scripts/download-fonts.mjs
 */

import { mkdir, writeFile, readdir, stat } from "fs/promises"
import { existsSync, createWriteStream } from "fs"
import { join, dirname, basename } from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const FONTS_DIR = join(__dirname, "../public/fonts")

const FONTS = [
  {
    name: "Inter",
    url: "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Noto Sans",
    url: "https://gwfh.mranftl.com/api/fonts/noto-sans?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Nunito Sans",
    url: "https://gwfh.mranftl.com/api/fonts/nunito-sans?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Figtree",
    url: "https://gwfh.mranftl.com/api/fonts/figtree?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "JetBrains Mono",
    url: "https://gwfh.mranftl.com/api/fonts/jetbrains-mono?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Roboto",
    url: "https://gwfh.mranftl.com/api/fonts/roboto?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Raleway",
    url: "https://gwfh.mranftl.com/api/fonts/raleway?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "DM Sans",
    url: "https://gwfh.mranftl.com/api/fonts/dm-sans?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Public Sans",
    url: "https://gwfh.mranftl.com/api/fonts/public-sans?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Outfit",
    url: "https://gwfh.mranftl.com/api/fonts/outfit?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Geist",
    url: "https://gwfh.mranftl.com/api/fonts/geist?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
  {
    name: "Geist Mono",
    url: "https://gwfh.mranftl.com/api/fonts/geist-mono?download=zip&subsets=latin&variants=regular&formats=woff2",
  },
]

/**
 * Get font directory name (kebab-case)
 */
function getFontDirName(fontName) {
  return fontName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/**
 * Download a file from URL
 */
async function downloadFile(url, filePath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true })

  // Write file
  await writeFile(filePath, buffer)
  console.log(`✓ Downloaded: ${basename(filePath)}`)
}

/**
 * Extract ZIP file
 */
async function extractZip(zipPath, extractDir) {
  try {
    // Use unzip command (available on macOS/Linux)
    execSync(`unzip -q -o "${zipPath}" -d "${extractDir}"`, { stdio: "inherit" })
    console.log(`✓ Extracted: ${basename(zipPath)}`)
    return true
  } catch (error) {
    // Try with node-unzip-js or other method if unzip is not available
    console.error(`⚠ unzip command failed, trying alternative method...`)
    
    // Alternative: use a Node.js zip library if available
    try {
      // Try using yauzl or adm-zip if installed
      const AdmZip = await import("adm-zip").catch(() => null)
      if (AdmZip) {
        const zip = new AdmZip.default(zipPath)
        zip.extractAllTo(extractDir, true)
        console.log(`✓ Extracted: ${basename(zipPath)}`)
        return true
      }
    } catch (libError) {
      throw new Error(`Failed to extract zip: ${error.message}. Install 'unzip' or 'adm-zip' package.`)
    }
  }
}

/**
 * Count font files in a directory
 */
async function countFontFiles(dir) {
  if (!existsSync(dir)) {
    return 0
  }
  
  const files = await readdir(dir, { recursive: true })
  return files.filter(file => file.endsWith('.woff2') || file.endsWith('.woff')).length
}

/**
 * Main download function
 */
async function downloadAllFonts() {
  console.log("🚀 Starting font download from ZIP files...\n")

  // Create fonts directory
  if (!existsSync(FONTS_DIR)) {
    await mkdir(FONTS_DIR, { recursive: true })
  }

  const results = {
    success: [],
    failed: [],
  }

  const tempDir = join(FONTS_DIR, ".temp")

  for (const font of FONTS) {
    try {
      const fontDirName = getFontDirName(font.name)
      const fontDir = join(FONTS_DIR, fontDirName)
      const zipPath = join(tempDir, `${fontDirName}.zip`)

      console.log(`\n📦 Downloading ${font.name}...`)

      // Download ZIP file
      await downloadFile(font.url, zipPath)

      // Extract ZIP to font directory
      await extractZip(zipPath, fontDir)

      // Count extracted font files
      const fileCount = await countFontFiles(fontDir)

      results.success.push({
        font: font.name,
        path: fontDir,
        files: fileCount,
      })

      console.log(`✓ ${font.name}: ${fileCount} font file(s) extracted`)
    } catch (error) {
      console.error(`✗ Failed to download ${font.name}:`, error.message)
      results.failed.push({ font: font.name, error: error.message })
    }
  }

  // Clean up temp directory
  try {
    if (existsSync(tempDir)) {
      execSync(`rm -rf "${tempDir}"`, { stdio: "ignore" })
    }
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log("\n" + "=".repeat(60))
  console.log("📊 Download Summary")
  console.log("=".repeat(60))
  console.log(`✓ Successfully downloaded: ${results.success.length} fonts`)
  console.log(`✗ Failed: ${results.failed.length} fonts`)

  if (results.success.length > 0) {
    const totalFiles = results.success.reduce((sum, r) => sum + r.files, 0)
    console.log(`\n📁 Total font files: ${totalFiles}`)
    console.log(`📁 Fonts saved to: ${FONTS_DIR}`)
  }

  if (results.failed.length > 0) {
    console.log("\nFailed fonts:")
    results.failed.forEach(({ font, error }) => {
      console.log(`  - ${font}: ${error}`)
    })
  }

  console.log("\n✨ Done! You can now use these fonts with next/font/local")
}

// Run the script
downloadAllFonts().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
