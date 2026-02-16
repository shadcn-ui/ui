import { createHash } from "node:crypto"
import { ChildProcessByStdio, spawn, type ChildProcessWithoutNullStreams } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import puppeteer, { type Browser } from "puppeteer"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import Stream from "node:stream"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, "../..")
const repoRoot = path.resolve(packageRoot, "../..")

const PORT = Number(process.env.PARITY_TEST_PORT ?? 4107)
const BASE_URL = process.env.PARITY_TEST_BASE_URL ?? `http://127.0.0.1:${PORT}`
const ARTIFACTS_DIR = path.resolve(packageRoot, "test/artifacts/pixel-perfect")

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

const COMPONENT_IDS = [
  "accordion",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "checkbox",
  "collapsible",
  "combobox",
  "context-menu",
  "dialog",
  "direction",
  "dropdown-menu",
  "hover-card",
  "input",
  "item",
  "menubar",
  "navigation-menu",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "slider",
  "switch",
  "tabs",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

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

async function waitForServer(url: string, timeoutMs = 180_000) {
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
    "focused",
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

async function captureBundle(component: string, impl: Impl): Promise<SnapshotBundle> {
  if (!browser) {
    throw new Error("Browser is not initialized")
  }

  const page = await browser.newPage()
  await page.setViewport({
    width: 1440,
    height: 1024,
    deviceScaleFactor: 1,
  })

  const url = `${BASE_URL}/rescript-pixel?component=${encodeURIComponent(component)}&impl=${impl}`

  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  page.on("pageerror", (error) => {
    pageErrors.push(error.message)
  })

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })

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
    const response = await page.goto(url, { waitUntil: "networkidle2" })
    httpStatus = response?.status() ?? null

    await page.waitForSelector("body")

    const snapshotData = await page.evaluate(async () => {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
      document.querySelector("[data-tailwind-indicator]")?.remove()

      const style = document.createElement("style")
      style.textContent =
        `*,*::before,*::after{animation:none!important;transition:none!important}` +
        `*:focus,*:focus-visible{outline:none!important;box-shadow:none!important}`
      document.head.appendChild(style)

      if (document.fonts) {
        await document.fonts.ready
      }

      const captureRoot = document.querySelector("#pixel-capture-root")
      const root = captureRoot ?? document.body

      const ignoredAttributes = new Set([
        "id",
        "for",
        "aria-controls",
        "aria-labelledby",
        "aria-describedby",
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
          .sort()
          .join(" ")
      }

      const toRounded = (value: number) => Math.round(value * 100) / 100

      const toAttributes = (element: Element) => {
        const attrs: Record<string, string> = {}
        const sorted = Array.from(element.attributes).sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        for (const attr of sorted) {
          if (ignoredAttributes.has(attr.name)) {
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
        const children: unknown[] = []

        for (const child of Array.from(element.childNodes)) {
          const next = toDomTree(child)
          if (next) {
            children.push(next)
          }
        }

        return {
          type: "element",
          tag: element.tagName.toLowerCase(),
          attributes: toAttributes(element),
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

      const elements = [root, ...Array.from(root.querySelectorAll("*"))]
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
          className: normalizeClass(element.className),
          text: normalizeText((element.textContent ?? "").slice(0, 120)),
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
    })

    hasCaptureRoot = snapshotData.hasCaptureRoot
    hasNextErrorPage = snapshotData.hasNextErrorPage
    nextErrorMessage = snapshotData.nextErrorMessage

    domSnapshot = snapshotData.domSnapshot
    layoutSnapshot = snapshotData.layoutSnapshot

    const rootHandle = (await page.$("#pixel-capture-root")) ?? (await page.$("body"))
    const rawA11y = await page.accessibility.snapshot({
      interestingOnly: false,
      root: rootHandle ?? undefined,
    })
    await rootHandle?.dispose()

    a11ySnapshot = normalizeA11yNode(rawA11y)

    screenshot = Buffer.from(await page.screenshot({ type: "png" }))
  } catch (error) {
    captureError = error instanceof Error ? error.message : String(error)

    try {
      screenshot = Buffer.from(await page.screenshot({ type: "png" }))
    } catch {
      screenshot = Buffer.alloc(0)
    }
  } finally {
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

  if (bundle.runtime.consoleErrors.length > 0) {
    issues.push(`console errors: ${bundle.runtime.consoleErrors.join(" | ")}`)
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

describe.sequential("tsx vs rescript parity", () => {
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

    browser = await puppeteer.launch()
  }, 240_000)

  afterAll(async () => {
    if (browser) {
      await browser.close()
      browser = null
    }

    await stopServer()
  }, 30_000)

  for (const component of COMPONENT_IDS) {
    it(
      `${component} should match across runtime, DOM, layout, a11y and pixels`,
      async () => {
        const tsx = await captureBundle(component, "tsx")
        const rescript = await captureBundle(component, "rescript")

        const tsxSmokeIssues = smokeIssues(tsx)
        const rescriptSmokeIssues = smokeIssues(rescript)
        const bothSmokeOk = tsxSmokeIssues.length === 0 && rescriptSmokeIssues.length === 0

        const domEqual = bothSmokeOk && tsx.domHash === rescript.domHash
        const layoutEqual = bothSmokeOk && tsx.layoutHash === rescript.layoutHash
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

        if (bothSmokeOk && !layoutEqual) {
          failures.push("layout/style snapshot mismatch")
        }

        if (bothSmokeOk && !a11yEqual) {
          failures.push("a11y snapshot mismatch")
        }

        if (bothSmokeOk && !pixelEqual) {
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
      90_000
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
