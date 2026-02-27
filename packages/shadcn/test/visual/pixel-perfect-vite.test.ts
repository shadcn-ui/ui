import { ChildProcessByStdio, spawn } from "node:child_process"
import { existsSync, promises as fs, readdirSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import Stream from "node:stream"
import { fileURLToPath } from "node:url"

import puppeteer, { type Browser } from "puppeteer"
import { twMerge } from "tailwind-merge"
import { afterAll, beforeAll, describe, expect, it, onTestFailed } from "vitest"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, "../..")
const repoRoot = path.resolve(packageRoot, "../..")

const PORT = Number(process.env.PARITY_TEST_PORT ?? 4173)
const BASE_URL = process.env.PARITY_TEST_BASE_URL ?? `http://127.0.0.1:${PORT}`
const VITE_CONFIG_PATH = path.resolve(packageRoot, "test/visual/vite-parity.config.ts")
const ARTIFACTS_DIR = path.resolve(packageRoot, "test/artifacts/pixel-perfect")
const EXAMPLES_BASE_DIR = path.resolve(repoRoot, "apps/v4/examples/base")
const EXAMPLES_UI_DIR = path.resolve(repoRoot, "apps/v4/examples/base/ui")
const RESCRIPT_EXAMPLES_DIR = path.resolve(repoRoot, "packages/shadcn/rescript/examples")
const RESCRIPT_UI_DIR = path.resolve(repoRoot, "packages/shadcn/rescript/ui")
const PAGE_LOAD_TIMEOUT_MS = Number(process.env.PARITY_PAGE_LOAD_TIMEOUT_MS ?? 20_000)
const COMPONENT_TEST_TIMEOUT_MS = Number(process.env.PARITY_COMPONENT_TIMEOUT_MS ?? 900_000)
const FONT_WAIT_TIMEOUT_MS = Number(process.env.PARITY_FONT_WAIT_TIMEOUT_MS ?? 2_000)
const IMAGE_WAIT_TIMEOUT_MS = Number(process.env.PARITY_IMAGE_WAIT_TIMEOUT_MS ?? 5_000)
const SETUP_TIMEOUT_MS = Number(process.env.PARITY_SETUP_TIMEOUT_MS ?? 240_000)
const SKIP_BUILD = ["1", "true", "yes"].includes((process.env.PARITY_SKIP_BUILD ?? "").toLowerCase())
const SCREENSHOT_SSIM_MIN = Number(process.env.PARITY_SCREENSHOT_SSIM_MIN ?? 0.998)
const ALLOW_MISSING_RESCRIPT_EQUIVALENT = ["1", "true", "yes"].includes(
  (process.env.PARITY_ALLOW_MISSING_EQUIVALENT ?? "").toLowerCase()
)

type Impl = "tsx" | "rescript"

type RuntimeDiagnostics = {
  httpStatus: number | null
  hasCaptureRoot: boolean
  pageErrors: string[]
  consoleErrors: string[]
  captureError: string | null
}

type SnapshotBundle = {
  impl: Impl
  url: string
  runtime: RuntimeDiagnostics
  domSnapshot: unknown
  layoutSnapshot: unknown
  a11ySnapshot: unknown
  screenshot: Buffer
}

function toPascalCase(value: string) {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("")
}

function readBaseExampleIds() {
  return readdirSync(EXAMPLES_BASE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .sort()
}

function readBaseUiExampleIds() {
  return readdirSync(EXAMPLES_UI_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => `ui/${entry.name.replace(/\.tsx$/, "")}`)
    .sort()
}

function expectedRescriptPath(component: string) {
  if (component.startsWith("ui/")) {
    const uiName = component.replace(/^ui\//, "")
    return path.join(RESCRIPT_UI_DIR, `${toPascalCase(uiName)}.res`)
  }

  return path.join(RESCRIPT_EXAMPLES_DIR, `${toPascalCase(component)}.res`)
}

function hasRescriptEquivalent(component: string) {
  return existsSync(expectedRescriptPath(component))
}

const EXAMPLE_COMPONENT_IDS = [...readBaseExampleIds(), ...readBaseUiExampleIds()].sort((a, b) =>
  a.localeCompare(b)
)
const REQUESTED_COMPONENT_IDS = (process.env.PARITY_COMPONENTS ?? "")
  .split(",")
  .map((component) => component.trim())
  .filter(Boolean)
const REQUESTED_COMPONENT_ID_SET = new Set(REQUESTED_COMPONENT_IDS)
const COMPONENT_IDS = EXAMPLE_COMPONENT_IDS.filter(
  (component) => REQUESTED_COMPONENT_ID_SET.size === 0 || REQUESTED_COMPONENT_ID_SET.has(component)
)
const MISSING_RESCRIPT_COMPONENT_IDS = COMPONENT_IDS.filter(
  (component) => !hasRescriptEquivalent(component)
)
const PAIRED_COMPONENT_IDS = COMPONENT_IDS.filter((component) => hasRescriptEquivalent(component))
const COMPONENT_IDS_FOR_PARITY =
  ALLOW_MISSING_RESCRIPT_EQUIVALENT || MISSING_RESCRIPT_COMPONENT_IDS.length === 0
    ? PAIRED_COMPONENT_IDS
    : []
const UNKNOWN_REQUESTED_COMPONENT_IDS = REQUESTED_COMPONENT_IDS.filter(
  (component) => !EXAMPLE_COMPONENT_IDS.includes(component)
)

let serverProcess: ChildProcessByStdio<null, Stream.Readable, Stream.Readable> | null = null
let serverLogs = ""
let browser: Browser | null = null

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(url: string, timeoutMs = 120_000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.status < 500) {
        return
      }
    } catch {
      // Retry until timeout.
    }

    await delay(250)
  }

  throw new Error(`Timed out waiting for Vite server at ${url}`)
}

async function runCommand(
  command: string,
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv }
) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
    })

    let output = ""
    child.stdout.on("data", (chunk) => {
      output += chunk.toString()
    })
    child.stderr.on("data", (chunk) => {
      output += chunk.toString()
    })

    child.once("error", reject)
    child.once("exit", (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error([`Command failed: ${command} ${args.join(" ")}`, output].join("\n\n"))
      )
    })
  })
}

function parseSsimAll(output: string) {
  const match = output.match(/All:([0-9.]+)/)
  if (!match) {
    return null
  }
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

async function computeScreenshotSsim(reference: Buffer, actual: Buffer) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "parity-ssim-"))
  const referencePath = path.join(tempDir, "reference.png")
  const actualPath = path.join(tempDir, "actual.png")

  await Promise.all([fs.writeFile(referencePath, reference), fs.writeFile(actualPath, actual)])

  try {
    const output = await new Promise<string>((resolve, reject) => {
      const ffmpeg = spawn(
        "ffmpeg",
        ["-i", referencePath, "-i", actualPath, "-lavfi", "ssim", "-f", "null", "-"],
        {
          cwd: repoRoot,
          stdio: ["ignore", "pipe", "pipe"],
        }
      )

      let logs = ""
      ffmpeg.stdout.on("data", (chunk) => {
        logs += chunk.toString()
      })
      ffmpeg.stderr.on("data", (chunk) => {
        logs += chunk.toString()
      })

      ffmpeg.once("error", (error) => {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          resolve("")
          return
        }
        reject(error)
      })
      ffmpeg.once("exit", (code) => {
        if (code === 0) {
          resolve(logs)
          return
        }
        reject(new Error([`ffmpeg exited with code ${code}`, logs].join("\n\n")))
      })
    })

    return parseSsimAll(output)
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

function startServer() {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

  const child = spawn(
    command,
    [
      "exec",
      "vite",
      "--config",
      VITE_CONFIG_PATH,
      "--host",
      "127.0.0.1",
      "--port",
      String(PORT),
      "--strictPort",
      "--clearScreen",
      "false",
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  )

  child.stdout.on("data", (chunk) => {
    serverLogs += chunk.toString()
  })

  child.stderr.on("data", (chunk) => {
    serverLogs += chunk.toString()
  })

  return child
}

async function stopServer() {
  if (!serverProcess || serverProcess.killed) {
    return
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      serverProcess?.kill("SIGKILL")
    }, 10_000)

    serverProcess?.once("exit", () => {
      clearTimeout(timeout)
      resolve()
    })

    serverProcess?.kill("SIGTERM")
  })
}

function canonicalizeClassName(className: string) {
  const merged = twMerge(className)
  return merged
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ")
}

function normalizeDomSnapshotClasses(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value
  }

  const node = value as {
    type?: unknown
    attributes?: Record<string, unknown>
    children?: unknown[]
  }

  const out: Record<string, unknown> = { ...node }

  if (node.type === "element" && node.attributes) {
    const attributes = { ...node.attributes }
    const className = attributes.class
    if (typeof className === "string") {
      attributes.class = canonicalizeClassName(className)
    }
    out.attributes = attributes
  }

  if (Array.isArray(node.children)) {
    out.children = node.children.map((child) => normalizeDomSnapshotClasses(child))
  }

  return out
}

function normalizeLayoutSnapshot(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value
  }

  return value.map((entry) => {
    if (!entry || typeof entry !== "object") {
      return entry
    }

    const item = { ...(entry as Record<string, unknown>) }
    delete item.className
    delete item.text
    return item
  })
}

function sortSnapshotKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortSnapshotKeys(item))
  }

  if (!value || typeof value !== "object") {
    return value
  }

  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    sorted[key] = sortSnapshotKeys((value as Record<string, unknown>)[key])
  }
  return sorted
}

function normalizeA11ySnapshot(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeA11ySnapshot(item))
  }

  if (!value || typeof value !== "object") {
    return value
  }

  const out = { ...(value as Record<string, unknown>) }
  delete out.loaderId
  const urlValue = out.url
  if (typeof urlValue === "string") {
    try {
      const parsed = new URL(urlValue)
      parsed.searchParams.delete("impl")
      out.url = parsed.toString()
    } catch {
      // Ignore invalid URL values and keep original snapshot data.
    }
  }
  return Object.fromEntries(
    Object.entries(out).map(([key, entry]) => [key, normalizeA11ySnapshot(entry)])
  )
}

async function captureBundle(component: string, impl: Impl): Promise<SnapshotBundle> {
  if (!browser) {
    throw new Error("Browser is not initialized")
  }

  const page = await browser.newPage()
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  })
  await page.setCacheEnabled(false)
  await page.setViewport({
    width: 1440,
    height: 1024,
    deviceScaleFactor: 1,
  })

  const url = `${BASE_URL}/?component=${encodeURIComponent(component)}&impl=${impl}`

  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  const onPageError = (error: Error) => {
    pageErrors.push(error.message)
  }

  const onConsole = (message: { type: () => string; text: () => string }) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  }

  page.on("pageerror", onPageError)
  page.on("console", onConsole)

  let httpStatus: number | null = null
  let hasCaptureRoot = false
  let captureError: string | null = null

  let domSnapshot: unknown = null
  let layoutSnapshot: unknown = null
  let a11ySnapshot: unknown = null
  let screenshot = Buffer.alloc(0)

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_LOAD_TIMEOUT_MS,
    })
    httpStatus = response?.status() ?? null

    await page.waitForSelector("body", { timeout: PAGE_LOAD_TIMEOUT_MS })
    await page.waitForSelector("#pixel-capture-root, #pixel-error", {
      timeout: PAGE_LOAD_TIMEOUT_MS,
    })

    await page
      .waitForFunction(
        () => document.documentElement.getAttribute("data-parity-ready") === "1",
        { timeout: PAGE_LOAD_TIMEOUT_MS }
      )
      .catch(() => undefined)

    await page.evaluate(
      async ({ fontWaitTimeout, imageWaitTimeout }) => {
        const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

        const waitForFonts = async () => {
          if (!("fonts" in document)) {
            return
          }

          await Promise.race([
            (document as Document & { fonts?: FontFaceSet }).fonts?.ready,
            wait(fontWaitTimeout),
          ]).catch(() => undefined)
        }

        const waitForImages = async () => {
          const images = Array.from(document.images).filter((image) => !image.complete)
          if (images.length === 0) {
            return
          }

          await Promise.race([
            Promise.all(
              images.map(
                (image) =>
                  new Promise<void>((resolve) => {
                    image.addEventListener("load", () => resolve(), { once: true })
                    image.addEventListener("error", () => resolve(), { once: true })
                  })
              )
            ),
            wait(imageWaitTimeout),
          ])
        }

        const freezeAnimations = () => {
          if (document.getElementById("__parity-freeze-animations__")) {
            return
          }

          const style = document.createElement("style")
          style.id = "__parity-freeze-animations__"
          style.textContent = `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
            }
          `
          document.head.appendChild(style)
        }

        await waitForFonts()
        await waitForImages()
        freezeAnimations()

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve()
            })
          })
        })
      },
      {
        fontWaitTimeout: FONT_WAIT_TIMEOUT_MS,
        imageWaitTimeout: IMAGE_WAIT_TIMEOUT_MS,
      }
    )

    const captureHandle = await page.$("#pixel-capture-root")
    hasCaptureRoot = Boolean(captureHandle)

    domSnapshot = await page.evaluate(() => {
      const root = document.querySelector("#pixel-capture-root")
      if (!root) {
        return null
      }

      const serializeNode = (node: Node): unknown => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.replace(/\s+/g, " ").trim() ?? ""
          if (!text) {
            return null
          }

          return {
            type: "text",
            text,
          }
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
          return null
        }

        const element = node as HTMLElement
        const attributes = Object.fromEntries(
          Array.from(element.attributes).map((attr) => [attr.name, attr.value])
        )
        const children = Array.from(element.childNodes)
          .map((child) => serializeNode(child))
          .filter(Boolean)

        return {
          type: "element",
          tag: element.tagName.toLowerCase(),
          attributes,
          children,
        }
      }

      return serializeNode(root)
    })

    layoutSnapshot = await page.evaluate(() => {
      const root = document.querySelector("#pixel-capture-root")
      if (!(root instanceof HTMLElement)) {
        return null
      }

      const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))]
      return nodes
        .slice(0, 4000)
        .map((node) => {
          const rect = node.getBoundingClientRect()
          return {
            tag: node.tagName.toLowerCase(),
            role: node.getAttribute("role"),
            className: typeof node.className === "string" ? node.className : "",
            text: (node.textContent ?? "").replace(/\s+/g, " ").trim(),
            x: Math.round(rect.x * 100) / 100,
            y: Math.round(rect.y * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
            height: Math.round(rect.height * 100) / 100,
          }
        })
        .filter((node) => node.width > 0 || node.height > 0)
    })

    if (captureHandle) {
      a11ySnapshot = await page.accessibility.snapshot({ root: captureHandle })
      screenshot = Buffer.from(await captureHandle.screenshot({ type: "png" }))
    } else {
      screenshot = Buffer.from(await page.screenshot({ type: "png" }))
    }
  } catch (error) {
    captureError = error instanceof Error ? error.message : String(error)
    screenshot = Buffer.from(await page.screenshot({ type: "png" }))
  } finally {
    page.off("pageerror", onPageError)
    page.off("console", onConsole)
    await page.close()
  }

  return {
    impl,
    url,
    runtime: {
      httpStatus,
      hasCaptureRoot,
      pageErrors,
      consoleErrors,
      captureError,
    },
    domSnapshot,
    layoutSnapshot,
    a11ySnapshot,
    screenshot,
  }
}

function smokeIssues(bundle: SnapshotBundle) {
  const issues: string[] = []

  if (bundle.runtime.captureError) {
    issues.push(`capture error: ${bundle.runtime.captureError}`)
  }

  if ((bundle.runtime.httpStatus ?? 0) >= 500) {
    issues.push(`HTTP status: ${bundle.runtime.httpStatus}`)
  }

  if (!bundle.runtime.hasCaptureRoot) {
    issues.push("missing #pixel-capture-root")
  }

  if (bundle.runtime.pageErrors.length > 0) {
    issues.push(`page errors: ${bundle.runtime.pageErrors.join(" | ")}`)
  }

  return issues
}

async function writeArtifacts(component: string, tsx: SnapshotBundle, rescript: SnapshotBundle) {
  const componentDir = path.join(ARTIFACTS_DIR, component)
  await fs.mkdir(componentDir, { recursive: true })

  await Promise.all([
    fs.writeFile(path.join(componentDir, "tsx.png"), tsx.screenshot),
    fs.writeFile(path.join(componentDir, "rescript.png"), rescript.screenshot),
    fs.writeFile(path.join(componentDir, "tsx.runtime.json"), JSON.stringify(tsx.runtime, null, 2)),
    fs.writeFile(path.join(componentDir, "rescript.runtime.json"), JSON.stringify(rescript.runtime, null, 2)),
    fs.writeFile(path.join(componentDir, "tsx.dom.json"), JSON.stringify(tsx.domSnapshot, null, 2)),
    fs.writeFile(path.join(componentDir, "rescript.dom.json"), JSON.stringify(rescript.domSnapshot, null, 2)),
    fs.writeFile(path.join(componentDir, "tsx.layout.json"), JSON.stringify(tsx.layoutSnapshot, null, 2)),
    fs.writeFile(
      path.join(componentDir, "rescript.layout.json"),
      JSON.stringify(rescript.layoutSnapshot, null, 2)
    ),
    fs.writeFile(path.join(componentDir, "tsx.a11y.json"), JSON.stringify(tsx.a11ySnapshot, null, 2)),
    fs.writeFile(
      path.join(componentDir, "rescript.a11y.json"),
      JSON.stringify(rescript.a11ySnapshot, null, 2)
    ),
  ])
}

describe("tsx vs rescript parity (vite harness)", () => {
  beforeAll(async () => {
    await fs.rm(ARTIFACTS_DIR, { recursive: true, force: true })

    if (COMPONENT_IDS_FOR_PARITY.length === 0) {
      return
    }

    const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

    if (!SKIP_BUILD) {
      await runCommand(command, ["--filter=shadcn", "build"], {
        cwd: repoRoot,
      })
    }

    if (!process.env.PARITY_TEST_BASE_URL) {
      serverProcess = startServer()
      await waitForServer(`${BASE_URL}/`)
    }

    browser = await puppeteer.launch({
      args: ["--lang=en-US"],
    })
  }, SETUP_TIMEOUT_MS)

  afterAll(async () => {
    if (browser) {
      await browser.close()
      browser = null
    }

    await stopServer()
  }, 30_000)

  it("requested component filter should only contain existing components", () => {
    const message = [
      `requested components: ${REQUESTED_COMPONENT_IDS.join(", ") || "(none)"}`,
      `unknown requested components (${UNKNOWN_REQUESTED_COMPONENT_IDS.length}): ${
        UNKNOWN_REQUESTED_COMPONENT_IDS.join(", ") || "(none)"
      }`,
      `available components (${EXAMPLE_COMPONENT_IDS.length}): ${EXAMPLE_COMPONENT_IDS.join(", ")}`,
    ].join("\n")

    expect(UNKNOWN_REQUESTED_COMPONENT_IDS, message).toEqual([])
  })

  it("every selected base component should have a ReScript equivalent by convention", () => {
    const message = [
      `missing ReScript equivalents (${MISSING_RESCRIPT_COMPONENT_IDS.length}): ${MISSING_RESCRIPT_COMPONENT_IDS.join(", ") || "(none)"}`,
      `selected components (${COMPONENT_IDS.length}): ${COMPONENT_IDS.join(", ") || "(none)"}`,
      `allow missing equivalent flag: ${ALLOW_MISSING_RESCRIPT_EQUIVALENT}`,
      `base examples dir: ${EXAMPLES_BASE_DIR}`,
      `base ui dir: ${EXAMPLES_UI_DIR}`,
      ...MISSING_RESCRIPT_COMPONENT_IDS.map(
        (component) => `${component} -> expected ${path.relative(repoRoot, expectedRescriptPath(component))}`
      ),
    ].join("\n")

    if (ALLOW_MISSING_RESCRIPT_EQUIVALENT) {
      if (MISSING_RESCRIPT_COMPONENT_IDS.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(message)
      }
      expect(true).toBe(true)
      return
    }

    expect(MISSING_RESCRIPT_COMPONENT_IDS, message).toEqual([])
  })

  for (const component of COMPONENT_IDS_FOR_PARITY) {
    it.concurrent(
      `${component} should match across runtime, DOM, layout, a11y and pixels`,
      async () => {
        let tsx: SnapshotBundle | null = null
        let rescript: SnapshotBundle | null = null

        onTestFailed(async () => {
          if (tsx && rescript) {
            await writeArtifacts(component, tsx, rescript)
          }
        })

        tsx = await captureBundle(component, "tsx")
        rescript = await captureBundle(component, "rescript")
        const artifactDir = path.join(ARTIFACTS_DIR, component)

        const tsxSmokeIssues = smokeIssues(tsx)
        const rescriptSmokeIssues = smokeIssues(rescript)
        const assertionContext = [
          `component: ${component}`,
          `artifacts: ${artifactDir}`,
          `server: ${BASE_URL}`,
        ].join("\n")

        const normalizedTsxDom = sortSnapshotKeys(normalizeDomSnapshotClasses(tsx.domSnapshot))
        const normalizedRescriptDom = sortSnapshotKeys(normalizeDomSnapshotClasses(rescript.domSnapshot))
        const normalizedTsxLayout = sortSnapshotKeys(normalizeLayoutSnapshot(tsx.layoutSnapshot))
        const normalizedRescriptLayout = sortSnapshotKeys(normalizeLayoutSnapshot(rescript.layoutSnapshot))
        const normalizedTsxA11y = sortSnapshotKeys(normalizeA11ySnapshot(tsx.a11ySnapshot))
        const normalizedRescriptA11y = sortSnapshotKeys(normalizeA11ySnapshot(rescript.a11ySnapshot))

        expect.soft(tsxSmokeIssues, [`tsx smoke failed`, assertionContext].join("\n")).toEqual([])
        expect.soft(
          rescriptSmokeIssues,
          [`rescript smoke failed`, assertionContext].join("\n")
        ).toEqual([])

        if (tsxSmokeIssues.length > 0 || rescriptSmokeIssues.length > 0) {
          return
        }

        const domSnapshotPath = path.join(artifactDir, "tsx.dom.normalized.snapshot.json")
        const layoutSnapshotPath = path.join(artifactDir, "tsx.layout.normalized.snapshot.json")
        const a11ySnapshotPath = path.join(artifactDir, "tsx.a11y.snapshot.json")

        const tsxDomJson = JSON.stringify(normalizedTsxDom, null, 2)
        const rescriptDomJson = JSON.stringify(normalizedRescriptDom, null, 2)
        const tsxLayoutJson = JSON.stringify(normalizedTsxLayout, null, 2)
        const rescriptLayoutJson = JSON.stringify(normalizedRescriptLayout, null, 2)
        const tsxA11yJson = JSON.stringify(normalizedTsxA11y, null, 2)
        const rescriptA11yJson = JSON.stringify(normalizedRescriptA11y, null, 2)

        await fs.mkdir(artifactDir, { recursive: true })
        await Promise.all([
          fs.writeFile(domSnapshotPath, tsxDomJson),
          fs.writeFile(layoutSnapshotPath, tsxLayoutJson),
          fs.writeFile(a11ySnapshotPath, tsxA11yJson),
        ])

        await expect
          .soft(rescriptDomJson, [`dom snapshot mismatch`, assertionContext].join("\n"))
          .toMatchFileSnapshot(domSnapshotPath)
        await expect
          .soft(rescriptLayoutJson, [`layout snapshot mismatch`, assertionContext].join("\n"))
          .toMatchFileSnapshot(layoutSnapshotPath)
        await expect
          .soft(rescriptA11yJson, [`a11y snapshot mismatch`, assertionContext].join("\n"))
          .toMatchFileSnapshot(a11ySnapshotPath)

        if (tsxDomJson === rescriptDomJson) {
          const ssim = await computeScreenshotSsim(tsx.screenshot, rescript.screenshot)

          if (ssim == null) {
            expect
              .soft(
                rescript.screenshot.toString("base64"),
                [
                  `pixel mismatch`,
                  assertionContext,
                  `ssim unavailable (ffmpeg missing); falling back to strict png bytes`,
                ].join("\n")
              )
              .toBe(tsx.screenshot.toString("base64"))
          } else {
            expect
              .soft(
                ssim,
                [
                  `pixel mismatch`,
                  assertionContext,
                  `ssim actual: ${ssim.toFixed(6)}`,
                  `ssim minimum: ${SCREENSHOT_SSIM_MIN.toFixed(6)}`,
                ].join("\n")
              )
              .toBeGreaterThanOrEqual(SCREENSHOT_SSIM_MIN)
          }
        }
      },
      COMPONENT_TEST_TIMEOUT_MS
    )
  }

  it(
    "server should stay healthy during parity run",
    async () => {
      if (!process.env.PARITY_TEST_BASE_URL) {
        expect(serverProcess?.exitCode ?? null, serverLogs).toBeNull()
      }
    },
    10_000
  )
})
