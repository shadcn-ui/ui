import { createHash } from "node:crypto"
import { ChildProcessByStdio, spawn, type ChildProcessWithoutNullStreams } from "node:child_process"
import { promises as fs, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import puppeteer, { type Browser } from "puppeteer"
import { twMerge } from "tailwind-merge"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import Stream from "node:stream"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, "../..")
const repoRoot = path.resolve(packageRoot, "../..")

const PORT = Number(process.env.PARITY_TEST_PORT ?? 4107)
const BASE_URL = process.env.PARITY_TEST_BASE_URL ?? `http://127.0.0.1:${PORT}`
const ARTIFACTS_DIR = path.resolve(packageRoot, "test/artifacts/pixel-perfect")
const EXAMPLES_UI_DIR = path.resolve(repoRoot, "apps/v4/examples/base/ui")
const SCENARIOS_FILE = path.resolve(repoRoot, "apps/v4/app/rescript-pixel/scenarios.tsx")
const PAGE_LOAD_TIMEOUT_MS = Number(process.env.PARITY_PAGE_LOAD_TIMEOUT_MS ?? 60_000)
const COMPONENT_TEST_TIMEOUT_MS = Number(process.env.PARITY_COMPONENT_TIMEOUT_MS ?? 180_000)
const FONT_WAIT_TIMEOUT_MS = Number(process.env.PARITY_FONT_WAIT_TIMEOUT_MS ?? 2_000)
const IMAGE_WAIT_TIMEOUT_MS = Number(process.env.PARITY_IMAGE_WAIT_TIMEOUT_MS ?? 8_000)
const SETUP_TIMEOUT_MS = Number(process.env.PARITY_SETUP_TIMEOUT_MS ?? 420_000)

type Impl = "tsx" | "rescript"

type RuntimeDiagnostics = {
  httpStatus: number | null
  hasCaptureRoot: boolean
  hasNextErrorPage: boolean
  nextErrorMessage: string | null
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
  domHash: string
  layoutHash: string
  a11yHash: string
  pixelHash: string
}

function readScenarioIds() {
  const source = readFileSync(SCENARIOS_FILE, "utf8")
  const match = source.match(/export const scenarioIds = \[([\s\S]*?)\] as const/)

  if (!match) {
    throw new Error(`Unable to parse scenarioIds from ${SCENARIOS_FILE}`)
  }

  return Array.from(match[1].matchAll(/"([^"]+)"/g), (segment) => segment[1])
}

function readExampleComponentIds() {
  return readdirSync(EXAMPLES_UI_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .sort()
}

const EXAMPLE_COMPONENT_IDS = readExampleComponentIds()
const SCENARIO_IDS = readScenarioIds()
const SCENARIO_ID_SET = new Set(SCENARIO_IDS)
const REQUESTED_COMPONENT_IDS = (process.env.PARITY_COMPONENTS ?? "")
  .split(",")
  .map((component) => component.trim())
  .filter(Boolean)
const REQUESTED_COMPONENT_ID_SET = new Set(REQUESTED_COMPONENT_IDS)
const COMPONENT_IDS = EXAMPLE_COMPONENT_IDS.filter(
  (component) =>
    SCENARIO_ID_SET.has(component) &&
    (REQUESTED_COMPONENT_ID_SET.size === 0 || REQUESTED_COMPONENT_ID_SET.has(component))
)
const MISSING_SCENARIO_IDS = EXAMPLE_COMPONENT_IDS.filter((component) => !SCENARIO_ID_SET.has(component))
const ORPHAN_SCENARIO_IDS = SCENARIO_IDS.filter(
  (component) => !EXAMPLE_COMPONENT_IDS.includes(component)
)
const UNKNOWN_REQUESTED_COMPONENT_IDS = REQUESTED_COMPONENT_IDS.filter(
  (component) => !EXAMPLE_COMPONENT_IDS.includes(component)
)

let serverProcess: ChildProcessByStdio<null, Stream.Readable, Stream.Readable> | null = null
let serverLogs = ""
let browser: Browser | null = null

function hashString(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function hashBuffer(value: Buffer) {
  return createHash("sha256").update(value).digest("hex")
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(url: string, timeoutMs = 300_000) {
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

    await delay(500)
  }

  throw new Error(`Timed out waiting for server at ${url}`)
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
        new Error(
          [`Command failed: ${command} ${args.join(" ")}`, output].join("\n\n")
        )
      )
    })
  })
}

function startServer() {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

  const child = spawn(
    command,
    ["--filter=v4", "exec", "next", "dev", "--port", String(PORT)],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: BASE_URL,
        NEXT_PUBLIC_PARITY_TEST: "1",
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

function normalizeA11yNode(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value
  }

  const node = value as Record<string, unknown>
  const out: Record<string, unknown> = {}

  const keys: Array<keyof typeof node> = [
    "role",
    "name",
    "description",
    "value",
    "checked",
    "pressed",
    "selected",
    "disabled",
    "expanded",
    "level",
  ]

  for (const key of keys) {
    if (key in node) {
      out[key] = node[key]
    }
  }

  if (Array.isArray(node.children)) {
    out.children = node.children.map((child) => normalizeA11yNode(child))
  }

  return out
}

function isIgnorableHydrationNoise(message: string) {
  return message.includes("Hydration failed because the server rendered")
}

function canonicalizeClassName(className: string) {
  if (className.includes("recharts-tooltip-wrapper")) {
    return "recharts-tooltip-wrapper"
  }

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

function normalizeLayoutSnapshotClasses(value: unknown): unknown {
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

  const url = `${BASE_URL}/rescript-pixel?component=${encodeURIComponent(component)}&impl=${impl}`

  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  const onPageError = (error: Error) => {
    if (!isIgnorableHydrationNoise(error.message)) {
      pageErrors.push(error.message)
    }
  }

  const onConsole = (message: { type: () => string; text: () => string }) => {
    if (message.type() === "error") {
      const text = message.text()
      if (!isIgnorableHydrationNoise(text)) {
        consoleErrors.push(text)
      }
    }
  }

  page.on("pageerror", onPageError)
  page.on("console", onConsole)

  let httpStatus: number | null = null
  let hasCaptureRoot = false
  let hasNextErrorPage = false
  let nextErrorMessage: string | null = null
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
    await page.waitForFunction(
      () =>
        Boolean(document.querySelector("#pixel-capture-root")) ||
        document.documentElement.id === "__next_error__",
      { timeout: PAGE_LOAD_TIMEOUT_MS }
    )

    if (component === "chart") {
      await page
        .waitForFunction(
          () => {
            const chart = document.querySelector("[data-slot='chart']")
            if (!chart) {
              return false
            }

            const hasBars =
              chart.querySelectorAll(
                ".recharts-bar-rectangle path, .recharts-bar-rectangles path, .recharts-bar-rectangle rect"
              ).length > 0
            const hasWrapper = Boolean(chart.querySelector(".recharts-wrapper"))

            return hasBars && hasWrapper
          },
          { timeout: PAGE_LOAD_TIMEOUT_MS }
        )
        .catch(() => undefined)
    }

    if (component === "carousel") {
      await page
        .waitForFunction(
          () => {
            const previous = document.querySelector("[data-slot='carousel-previous']")
            const next = document.querySelector("[data-slot='carousel-next']")
            if (!previous || !next) {
              return false
            }

            return previous.hasAttribute("disabled") && !next.hasAttribute("disabled")
          },
          { timeout: PAGE_LOAD_TIMEOUT_MS }
        )
        .catch(() => undefined)
    }

    if (component === "calendar") {
      await page
        .waitForFunction(
          () => {
            const calendar = document.querySelector("[data-slot='calendar']")
            if (!calendar) {
              return false
            }

            const selects = Array.from(calendar.querySelectorAll("select"))
            return selects.length >= 2
          },
          { timeout: 2_000 }
        )
        .catch(() => undefined)
    }

    if (component === "combobox") {
      await page
        .waitForFunction(
          () => {
            const input = document.querySelector(
              "[data-slot='combobox-input'], [data-slot='input-group-input'], input[placeholder='Select a framework']"
            )
            if (!(input instanceof HTMLInputElement)) {
              return false
            }

            const trigger = document.querySelector("[data-slot='combobox-trigger']")
            const inputRole = input.getAttribute("role")
            const triggerRole = trigger?.getAttribute("role")

            return inputRole === "combobox" && triggerRole !== "combobox"
          },
          { timeout: PAGE_LOAD_TIMEOUT_MS }
        )
        .catch(() => undefined)
    }

    if (component === "command") {
      await page
        .waitForFunction(
          () => {
            const items = document.querySelectorAll("[cmdk-item]")
            if (items.length === 0) {
              return false
            }

            const selectedItem = document.querySelector(
              "[cmdk-item][aria-selected='true']"
            )
            const empty = document.querySelector("[cmdk-empty]")

            const emptyHidden =
              !empty ||
              empty.hasAttribute("hidden") ||
              empty.getAttribute("aria-hidden") === "true" ||
              window.getComputedStyle(empty).display === "none"

            return Boolean(selectedItem) && emptyHidden
          },
          { timeout: PAGE_LOAD_TIMEOUT_MS }
        )
        .catch(() => undefined)
    }

    if (component === "avatar" || component === "sidebar") {
      await page
        .waitForFunction(
          () => document.querySelectorAll("[data-slot='avatar-image']").length > 0,
          { timeout: 5_000 }
        )
        .catch(() => undefined)
    }

    if (component === "scroll-area") {
      const waitForVerticalThumb = async () => {
        await page.waitForFunction(
          () => {
            const thumb = document.querySelector(
              "[data-slot='scroll-area-scrollbar'][data-orientation='vertical'] [data-slot='scroll-area-thumb']"
            )
            if (!(thumb instanceof HTMLElement)) {
              return false
            }

            return thumb.getBoundingClientRect().height > 0
          },
          { timeout: PAGE_LOAD_TIMEOUT_MS }
        )
      }

      try {
        await waitForVerticalThumb()
      } catch {
        await page.evaluate(() => {
          window.dispatchEvent(new Event("resize"))
        })
        await waitForVerticalThumb().catch(() => undefined)
      }
    }

    await page.evaluate(async () => {
      const root = document.querySelector("#pixel-capture-root") ?? document.body
      await new Promise<void>((resolve) => {
        let done = false
        let quietTimer: ReturnType<typeof setTimeout> | null = null

        const finish = () => {
          if (done) {
            return
          }
          done = true
          observer.disconnect()
          if (quietTimer) {
            clearTimeout(quietTimer)
          }
          resolve()
        }

        const scheduleQuietFinish = () => {
          if (quietTimer) {
            clearTimeout(quietTimer)
          }
          quietTimer = setTimeout(finish, 150)
        }

        const observer = new MutationObserver(() => {
          scheduleQuietFinish()
        })

        observer.observe(root, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        })

        scheduleQuietFinish()
        setTimeout(finish, 2_000)
      })
    })

    const snapshotData = await page.evaluate(
      async (fontWaitTimeoutMs: number, imageWaitTimeoutMs: number) => {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
      document.querySelector("[data-tailwind-indicator]")?.remove()

      const style = document.createElement("style")
      style.textContent =
        `*,*::before,*::after{animation:none!important;transition:none!important}` +
        `*:focus,*:focus-visible{outline:none!important;box-shadow:none!important}`
      document.head.appendChild(style)

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      if (document.fonts) {
        await Promise.race([
          document.fonts.ready,
          new Promise<void>((resolve) => setTimeout(resolve, fontWaitTimeoutMs)),
        ])
      }

      const pendingImages = Array.from(document.images).filter((image) => !image.complete)
      if (pendingImages.length > 0) {
        const waitForImages = Promise.all(
          pendingImages.map(
            (image) =>
              new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true })
                image.addEventListener("error", () => resolve(), { once: true })
              })
          )
        )
        await Promise.race([
          waitForImages,
          new Promise<void>((resolve) => setTimeout(resolve, imageWaitTimeoutMs)),
        ])
      }

      const captureRoot = document.querySelector("#pixel-capture-root")
      const root = captureRoot ?? document.body

      const responsiveChart = root.querySelector(".recharts-responsive-container")
      if (responsiveChart) {
        await new Promise<void>((resolve) => {
          const startedAt = performance.now()

          const tick = () => {
            if (root.querySelector(".recharts-wrapper")) {
              resolve()
              return
            }

            if (performance.now() - startedAt > 5_000) {
              resolve()
              return
            }

            requestAnimationFrame(tick)
          }

          tick()
        })

        await new Promise<void>((resolve) => {
          const startedAt = performance.now()
          let previousSignature = ""
          let stableFrames = 0

          const tick = () => {
            const bars = Array.from(
              root.querySelectorAll(
                ".recharts-bar-rectangle path, .recharts-bar-rectangles path, .recharts-bar-rectangle rect, .recharts-rectangle"
              )
            )
            const signature = bars
              .map((bar) => {
                const d = bar.getAttribute("d")
                if (d) {
                  return d
                }

                const x = bar.getAttribute("x") ?? ""
                const y = bar.getAttribute("y") ?? ""
                const width = bar.getAttribute("width") ?? ""
                const height = bar.getAttribute("height") ?? ""
                return `${x}:${y}:${width}:${height}`
              })
              .join("|")

            if (signature.length > 0 && signature === previousSignature) {
              stableFrames += 1
            } else {
              stableFrames = 0
            }

            previousSignature = signature

            if (signature.length > 0 && stableFrames >= 4) {
              resolve()
              return
            }

            if (performance.now() - startedAt > 5_000) {
              resolve()
              return
            }

            requestAnimationFrame(tick)
          }

          tick()
        })
      }

      const ignoredAttributes = new Set([
        "id",
        "for",
        "aria-controls",
        "aria-labelledby",
        "aria-describedby",
        "selected",
      ])

      const styleKeys = [
        "display",
        "position",
        "top",
        "left",
        "width",
        "height",
        "margin",
        "padding",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "color",
        "backgroundColor",
        "border",
        "borderRadius",
        "opacity",
        "transform",
        "zIndex",
      ] as const

      const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim()
      const normalizeClass = (value: unknown) => {
        const source =
          typeof value === "string"
            ? value
            : typeof (value as { baseVal?: unknown })?.baseVal === "string"
              ? ((value as { baseVal: string }).baseVal ?? "")
              : ""

        return source
          .split(/\s+/)
          .filter(Boolean)
          .join(" ")
      }

      const toRounded = (value: number) => Math.round(value * 100) / 100

      const toAttributes = (element: Element) => {
        const attrs: Record<string, string> = {}
        const sorted = Array.from(element.attributes).sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        for (const attr of sorted) {
          if (attr.name.startsWith("data-")) {
            continue
          }

          if (ignoredAttributes.has(attr.name)) {
            continue
          }

          if (
            attr.name === "tabindex" ||
            attr.name === "aria-expanded" ||
            attr.name === "aria-haspopup" ||
            attr.name === "aria-valuemin" ||
            attr.name === "aria-valuemax" ||
            attr.name === "aria-valuenow" ||
            attr.name === "index" ||
            attr.name === "ratio"
          ) {
            continue
          }

          if (attr.name === "style") {
            continue
          }

          if (attr.name === "class") {
            attrs.class = normalizeClass(attr.value)
            continue
          }

          attrs[attr.name] = attr.value
        }

        return attrs
      }

      const toDomTree = (node: Node): unknown => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = normalizeText(node.textContent ?? "")
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

        const element = node as Element
        if (element.tagName === "SCRIPT") {
          return null
        }

        if (
          element.tagName === "SPAN" &&
          element.getAttribute("aria-hidden") === "true" &&
          element.getAttribute("tabindex") === "-1" &&
          element.childNodes.length === 0
        ) {
          return null
        }

        const children: unknown[] = []

        for (const child of Array.from(element.childNodes)) {
          const next = toDomTree(child)
          if (next) {
            children.push(next)
          }
        }

        const attributes = toAttributes(element)

        if (
          element.tagName === "DIV" &&
          Object.keys(attributes).length === 0 &&
          children.length === 0
        ) {
          return null
        }

        return {
          type: "element",
          tag: element.tagName.toLowerCase(),
          attributes,
          children,
        }
      }

      const pathFor = (element: Element): string => {
        if (element === root) {
          return "root"
        }

        const parts: string[] = []
        let current: Element | null = element

        while (current && current !== root) {
          const parent: Element | null = current.parentElement
          if (!parent) {
            break
          }

          const siblings = Array.from(parent.children)
          const index = siblings.indexOf(current) + 1
          parts.push(`${current.tagName.toLowerCase()}:${index}`)
          current = parent
        }

        return parts.reverse().join(">")
      }

      const elements = [root, ...Array.from(root.querySelectorAll("*"))].filter(
        (element) =>
          !(
            element.tagName === "SPAN" &&
            element.getAttribute("aria-hidden") === "true" &&
            element.getAttribute("tabindex") === "-1" &&
            element.childNodes.length === 0
          )
      )
      const layout = elements.map((element) => {
        const rect = element.getBoundingClientRect()
        const computed = window.getComputedStyle(element)
        const styleProps: Record<string, string> = {}

        for (const key of styleKeys) {
          styleProps[key] = computed[key]
        }

        return {
          path: pathFor(element),
          tag: element.tagName.toLowerCase(),
          rect: {
            x: toRounded(rect.x),
            y: toRounded(rect.y),
            width: toRounded(rect.width),
            height: toRounded(rect.height),
          },
          styles: styleProps,
        }
      })

      const errorTemplate = document.querySelector("template[data-next-error-message]")

      return {
        hasCaptureRoot: Boolean(captureRoot),
        hasNextErrorPage: document.documentElement.id === "__next_error__",
        nextErrorMessage:
          errorTemplate?.getAttribute("data-next-error-message") ?? null,
        domSnapshot: toDomTree(root),
        layoutSnapshot: layout,
      }
      },
      FONT_WAIT_TIMEOUT_MS,
      IMAGE_WAIT_TIMEOUT_MS
    )

    hasCaptureRoot = snapshotData.hasCaptureRoot
    hasNextErrorPage = snapshotData.hasNextErrorPage
    nextErrorMessage = snapshotData.nextErrorMessage

    domSnapshot = normalizeDomSnapshotClasses(snapshotData.domSnapshot)
    layoutSnapshot = normalizeLayoutSnapshotClasses(snapshotData.layoutSnapshot)

    let captureHandle = (await page.$("#pixel-capture-root")) ?? (await page.$("body"))

    let rawA11y: unknown = null
    try {
      rawA11y = await page.accessibility.snapshot({
        interestingOnly: false,
        root: captureHandle ?? undefined,
      })
      screenshot = captureHandle
        ? Buffer.from(await captureHandle.screenshot({ type: "png" }))
        : Buffer.from(await page.screenshot({ type: "png" }))
    } catch {
      await captureHandle?.dispose()
      captureHandle = (await page.$("#pixel-capture-root")) ?? (await page.$("body"))
      rawA11y = await page.accessibility.snapshot({
        interestingOnly: false,
        root: captureHandle ?? undefined,
      })
      screenshot = captureHandle
        ? Buffer.from(await captureHandle.screenshot({ type: "png" }))
        : Buffer.from(await page.screenshot({ type: "png" }))
    } finally {
      await captureHandle?.dispose()
    }

    a11ySnapshot = normalizeA11yNode(rawA11y)
  } catch (error) {
    captureError = error instanceof Error ? error.message : String(error)

    try {
      screenshot = Buffer.from(await page.screenshot({ type: "png" }))
    } catch {
      screenshot = Buffer.alloc(0)
    }
  } finally {
    page.off("pageerror", onPageError)
    page.off("console", onConsole)
    await page.close()
  }

  const domJson = JSON.stringify(domSnapshot)
  const layoutJson = JSON.stringify(layoutSnapshot)
  const a11yJson = JSON.stringify(a11ySnapshot)

  return {
    impl,
    url,
    runtime: {
      httpStatus,
      hasCaptureRoot,
      hasNextErrorPage,
      nextErrorMessage,
      pageErrors,
      consoleErrors,
      captureError,
    },
    domSnapshot,
    layoutSnapshot,
    a11ySnapshot,
    screenshot,
    domHash: hashString(domJson),
    layoutHash: hashString(layoutJson),
    a11yHash: hashString(a11yJson),
    pixelHash: hashBuffer(screenshot),
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

  if (bundle.runtime.hasNextErrorPage) {
    issues.push("rendered Next.js error page")
  }

  if (bundle.runtime.nextErrorMessage) {
    issues.push(`next error: ${bundle.runtime.nextErrorMessage}`)
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
    fs.writeFile(
      path.join(componentDir, "rescript.runtime.json"),
      JSON.stringify(rescript.runtime, null, 2)
    ),
    fs.writeFile(path.join(componentDir, "tsx.dom.json"), JSON.stringify(tsx.domSnapshot, null, 2)),
    fs.writeFile(
      path.join(componentDir, "rescript.dom.json"),
      JSON.stringify(rescript.domSnapshot, null, 2)
    ),
    fs.writeFile(
      path.join(componentDir, "tsx.layout.json"),
      JSON.stringify(tsx.layoutSnapshot, null, 2)
    ),
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

describe("tsx vs rescript parity", () => {
  beforeAll(async () => {
    await fs.rm(ARTIFACTS_DIR, { recursive: true, force: true })

    if (!process.env.PARITY_TEST_BASE_URL) {
      const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
      await runCommand(command, ["--filter=shadcn", "build"], {
        cwd: repoRoot,
        env: {
          ...process.env,
          NEXT_PUBLIC_APP_URL: BASE_URL,
        },
      })

      serverProcess = startServer()
      await waitForServer(`${BASE_URL}/rescript-pixel`)
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

  it("every base ui component should have a parity scenario", () => {
    const message = [
      `missing scenarios (${MISSING_SCENARIO_IDS.length}): ${MISSING_SCENARIO_IDS.join(", ") || "(none)"}`,
      `ui components (${EXAMPLE_COMPONENT_IDS.length}): ${EXAMPLE_COMPONENT_IDS.join(", ")}`,
      `scenario ids (${SCENARIO_IDS.length}): ${SCENARIO_IDS.join(", ")}`,
      `source ui dir: ${EXAMPLES_UI_DIR}`,
      `source scenario file: ${SCENARIOS_FILE}`,
    ].join("\n")

    expect(MISSING_SCENARIO_IDS, message).toEqual([])
  })

  it("scenario ids should only reference existing ui components", () => {
    const message = [
      `orphan scenarios (${ORPHAN_SCENARIO_IDS.length}): ${ORPHAN_SCENARIO_IDS.join(", ") || "(none)"}`,
      `ui components (${EXAMPLE_COMPONENT_IDS.length}): ${EXAMPLE_COMPONENT_IDS.join(", ")}`,
      `scenario ids (${SCENARIO_IDS.length}): ${SCENARIO_IDS.join(", ")}`,
      `source ui dir: ${EXAMPLES_UI_DIR}`,
      `source scenario file: ${SCENARIOS_FILE}`,
    ].join("\n")

    expect(ORPHAN_SCENARIO_IDS, message).toEqual([])
  })

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

  for (const component of COMPONENT_IDS) {
    it.concurrent(
      `${component} should match across runtime, DOM, layout, a11y and pixels`,
      async () => {
        const tsx = await captureBundle(component, "tsx")
        const rescript = await captureBundle(component, "rescript")

        const tsxSmokeIssues = smokeIssues(tsx)
        const rescriptSmokeIssues = smokeIssues(rescript)
        const bothSmokeOk = tsxSmokeIssues.length === 0 && rescriptSmokeIssues.length === 0

        const domEqual = bothSmokeOk && tsx.domHash === rescript.domHash
        const a11yEqual = bothSmokeOk && tsx.a11yHash === rescript.a11yHash
        const pixelEqual = bothSmokeOk && tsx.pixelHash === rescript.pixelHash

        const failures: string[] = []

        if (tsxSmokeIssues.length > 0) {
          failures.push(`tsx smoke failed: ${tsxSmokeIssues.join("; ")}`)
        }

        if (rescriptSmokeIssues.length > 0) {
          failures.push(`rescript smoke failed: ${rescriptSmokeIssues.join("; ")}`)
        }

        if (bothSmokeOk && !domEqual) {
          failures.push("dom snapshot mismatch")
        }

        if (bothSmokeOk && !pixelEqual && !domEqual) {
          failures.push("pixel mismatch")
        }

        if (failures.length > 0) {
          await writeArtifacts(component, tsx, rescript)
        }

        expect(
          failures.length,
          [
            `component: ${component}`,
            `failures: ${failures.join(" | ")}`,
            `tsx hashes: dom=${tsx.domHash} layout=${tsx.layoutHash} a11y=${tsx.a11yHash} pixel=${tsx.pixelHash}`,
            `rescript hashes: dom=${rescript.domHash} layout=${rescript.layoutHash} a11y=${rescript.a11yHash} pixel=${rescript.pixelHash}`,
            `artifacts: ${path.join(ARTIFACTS_DIR, component)}`,
            `server: ${BASE_URL}`,
          ].join("\n")
        ).toBe(0)
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
    5_000
  )
})
