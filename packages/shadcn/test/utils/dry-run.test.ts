import { afterEach, describe, expect, test, vi } from "vitest"

import type { Config } from "../../src/utils/get-config"

// Mock external dependencies.
vi.mock("../../src/registry/resolver", () => ({
  resolveRegistryTree: vi.fn(),
}))

vi.mock("../../src/registry/api", () => ({
  getRegistryBaseColor: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../src/utils/get-project-info", () => ({
  getProjectInfo: vi.fn().mockResolvedValue({
    framework: { name: "next-app" },
    isSrcDir: false,
    isRSC: true,
    isTsx: true,
    tailwindConfigFile: null,
    tailwindCssFile: null,
    tailwindVersion: "v4",
    frameworkVersion: "15.0.0",
    aliasPrefix: "@",
  }),
}))

vi.mock("../../src/utils/transformers", () => ({
  transform: vi.fn().mockImplementation((opts) => opts.raw),
}))

vi.mock("../../src/utils/transformers/transform-import", () => ({
  transformImport: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-rsc", () => ({
  transformRsc: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-css-vars", () => ({
  transformCssVars: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-tw-prefix", () => ({
  transformTwPrefixes: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-icons", () => ({
  transformIcons: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-menu", () => ({
  transformMenu: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-aschild", () => ({
  transformAsChild: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-rtl", () => ({
  transformRtl: vi.fn(),
}))
vi.mock("../../src/utils/transformers/transform-cleanup", () => ({
  transformCleanup: vi.fn(),
}))

vi.mock("../../src/utils/updaters/update-css", () => ({
  transformCss: vi
    .fn()
    .mockImplementation((input, _css) => `${input}\n/* css added */`),
}))

vi.mock("../../src/utils/updaters/update-css-vars", () => ({
  transformCssVars: vi
    .fn()
    .mockImplementation(
      (input, _cssVars, _config, _options) => `${input}\n/* css vars added */`
    ),
}))

vi.mock("../../src/utils/updaters/update-fonts", () => ({
  massageTreeForFonts: vi.fn().mockImplementation((tree) => tree),
}))

vi.mock("fs", async () => {
  const actual = (await vi.importActual("fs")) as any
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(false),
    promises: {
      ...actual.promises,
      readFile: vi.fn().mockResolvedValue(""),
    },
  }
})

import { dryRunComponents } from "../../src/utils/dry-run"
import {
  formatDryRunResult,
  resolveFilterPath,
} from "../../src/utils/dry-run-formatter"
import type { DryRunResult } from "../../src/utils/dry-run"
import { resolveRegistryTree } from "../../src/registry/resolver"

afterEach(() => {
  vi.clearAllMocks()
})

function createMockConfig(overrides: Partial<Config> = {}): Config {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      css: "app/globals.css",
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd: "/apps/web",
      tailwindConfig: "/apps/web/tailwind.config.ts",
      tailwindCss: "/apps/web/app/globals.css",
      utils: "/apps/web/lib/utils",
      components: "/apps/web/components",
      lib: "/apps/web/lib",
      hooks: "/apps/web/hooks",
      ui: "/apps/web/components/ui",
    },
    ...overrides,
  } as Config
}

describe("dryRunComponents", () => {
  test("should return basic component dry-run result", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: 'export function Button() { return <button>Click</button> }',
        },
      ],
      dependencies: ["class-variance-authority"],
      devDependencies: [],
    })

    const result = await dryRunComponents(["button"], config)

    expect(result.files).toHaveLength(1)
    expect(result.files[0]).toMatchObject({
      path: "components/ui/button.tsx",
      action: "create",
      type: "registry:ui",
    })
    expect(result.files[0].content).toBeTruthy()
    expect(result.dependencies).toEqual(["class-variance-authority"])
    expect(result.devDependencies).toEqual([])
  })

  test("should handle multiple files (ui + hook + lib)", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/hooks/use-mobile.ts",
          type: "registry:hook",
          content: "export function useMobile() {}",
        },
        {
          path: "registry/lib/utils.ts",
          type: "registry:lib",
          content: "export function cn() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    const result = await dryRunComponents(["sidebar"], config)

    expect(result.files).toHaveLength(3)
    expect(result.files[0]).toMatchObject({
      type: "registry:ui",
      action: "create",
    })
    expect(result.files[1]).toMatchObject({
      type: "registry:hook",
      action: "create",
    })
    expect(result.files[2]).toMatchObject({
      type: "registry:lib",
      action: "create",
    })
  })

  test("should include CSS output when tree has cssVars and css", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: {
        "@layer base": {
          body: {
            "@apply bg-background text-foreground": {},
          },
        },
      },
    })

    const result = await dryRunComponents(["button"], config)

    expect(result.css).not.toBeNull()
    expect(result.css!.path).toBe("app/globals.css")
    expect(result.css!.content).toContain("css vars added")
    expect(result.css!.content).toContain("css added")
    expect(result.css!.cssVarsCount).toBe(2)
  })

  test("should include env vars in output", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "some-component",
      files: [
        {
          path: "registry/ui/some-component.tsx",
          type: "registry:ui",
          content: "export function SomeComponent() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
      envVars: {
        API_KEY: "your-api-key",
        SECRET: "your-secret",
      },
    })

    const result = await dryRunComponents(["some-component"], config)

    expect(result.envVars).not.toBeNull()
    expect(result.envVars!.path).toBe(".env.local")
    expect(result.envVars!.variables).toEqual({
      API_KEY: "your-api-key",
      SECRET: "your-secret",
    })
    expect(result.envVars!.action).toBe("create")
  })

  test("should pass through dependencies and devDependencies", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "chart",
      files: [
        {
          path: "registry/ui/chart.tsx",
          type: "registry:ui",
          content: "export function Chart() {}",
        },
      ],
      dependencies: ["recharts", "lucide-react"],
      devDependencies: ["@types/recharts"],
    })

    const result = await dryRunComponents(["chart"], config)

    expect(result.dependencies).toEqual(["recharts", "lucide-react"])
    expect(result.devDependencies).toEqual(["@types/recharts"])
  })

  test("should return empty result for no components", async () => {
    const config = createMockConfig()

    const result = await dryRunComponents([], config)

    expect(result.files).toEqual([])
    expect(result.dependencies).toEqual([])
    expect(result.devDependencies).toEqual([])
    expect(result.css).toBeNull()
    expect(result.envVars).toBeNull()
    expect(result.fonts).toEqual([])
    expect(result.docs).toBeNull()
  })

  test("should include docs when present", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
      docs: "Read more at https://ui.shadcn.com/docs/components/button",
    })

    const result = await dryRunComponents(["button"], config)

    expect(result.docs).toBe(
      "Read more at https://ui.shadcn.com/docs/components/button"
    )
  })

  test("should collect font metadata", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          title: "Inter",
          font: {
            provider: "google" as const,
            import: "Inter",
            family: "Inter, sans-serif",
            variable: "--font-sans",
            weight: ["400", "500", "600", "700"],
            subsets: ["latin"],
          },
        },
      ],
    })

    const result = await dryRunComponents(["button"], config)

    expect(result.fonts).toHaveLength(1)
    expect(result.fonts[0]).toEqual({
      name: "Inter, sans-serif",
      provider: "Google Fonts",
    })
  })

  test("should deduplicate dependencies", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
      ],
      dependencies: [
        "@base-ui/react",
        "lucide-react",
        "@base-ui/react",
        "lucide-react",
        "@base-ui/react",
      ],
      devDependencies: ["@types/node", "@types/node"],
    })

    const result = await dryRunComponents(["sidebar"], config)

    expect(result.dependencies).toEqual(["@base-ui/react", "lucide-react"])
    expect(result.devDependencies).toEqual(["@types/node"])
  })

  test("should throw when registry tree resolution fails", async () => {
    const config = createMockConfig()

    vi.mocked(resolveRegistryTree).mockResolvedValue(undefined as any)

    await expect(
      dryRunComponents(["nonexistent"], config)
    ).rejects.toThrow("Failed to fetch components from registry.")
  })
})

describe("formatDryRunResult", () => {
  function createResult(overrides: Partial<DryRunResult> = {}): DryRunResult {
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      css: null,
      envVars: null,
      fonts: [],
      docs: null,
      ...overrides,
    }
  }

  test("should format a simple component", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).toContain("shadcn add button")
    expect(output).toContain("(dry run)")
    expect(output).toContain("Files")
    expect(output).toContain("(1)")
    expect(output).toContain("components/ui/button.tsx")
    expect(output).toContain("create")
    expect(output).toContain("Run without --dry-run to apply.")
    // Should not contain overwrite warnings.
    expect(output).not.toContain("overwritten")
  })

  test("should show dependencies section when present", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
      dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).toContain("Dependencies")
    expect(output).toContain("(2)")
    expect(output).toContain("class-variance-authority")
    expect(output).toContain("@radix-ui/react-slot")
  })

  test("should hide empty sections", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).not.toContain("Dependencies")
    expect(output).not.toContain("Dev Dependencies")
    expect(output).not.toContain("CSS")
    expect(output).not.toContain("Environment Variables")
    expect(output).not.toContain("Fonts")
  })

  test("should show overwrite warning and diff hint", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
        {
          path: "components/ui/table.tsx",
          action: "overwrite",
          content: "...",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["dashboard"])

    expect(output).toContain("1 file will be overwritten")
    expect(output).toContain("--diff")
  })

  test("should list all files without truncation", () => {
    const files = Array.from({ length: 12 }, (_, i) => ({
      path: `components/ui/file-${i}.tsx`,
      action: "create" as const,
      content: "...",
      type: "registry:ui",
    }))

    const result = createResult({ files })
    const output = formatDryRunResult(result, ["dashboard"])

    expect(output).toContain("Files")
    expect(output).toContain("(12)")
    // All files should be listed.
    expect(output).toContain("file-0.tsx")
    expect(output).toContain("file-5.tsx")
    expect(output).toContain("file-11.tsx")
  })

  test("should format CSS section with variable count", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
      css: {
        path: "app/globals.css",
        content: "...",
        action: "update",
        cssVarsCount: 12,
      },
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).toContain("CSS")
    expect(output).toContain("12 CSS variables")
    expect(output).toContain("globals.css")
  })

  test("should format env vars section", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/chat.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
      envVars: {
        path: ".env.local",
        variables: { NEXT_PUBLIC_API_URL: "...", SECRET_KEY: "..." },
        action: "create",
      },
    })

    const output = formatDryRunResult(result, ["chat"])

    expect(output).toContain("Environment Variables")
    expect(output).toContain("NEXT_PUBLIC_API_URL")
    expect(output).toContain("SECRET_KEY")
  })

  test("should format fonts section", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
      fonts: [{ name: "Inter", provider: "Google Fonts" }],
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).toContain("Fonts")
    expect(output).toContain("Inter")
    expect(output).toContain("Google Fonts")
  })

  test("should show multiple overwrite warning", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/a.tsx",
          action: "overwrite",
          content: "...",
          type: "registry:ui",
        },
        {
          path: "components/ui/b.tsx",
          action: "overwrite",
          content: "...",
          type: "registry:ui",
        },
        {
          path: "components/ui/c.tsx",
          action: "overwrite",
          content: "...",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["thing"])

    expect(output).toContain("3 files will be overwritten")
  })

  test("should list all files with mixed actions", () => {
    const files = [
      ...Array.from({ length: 6 }, (_, i) => ({
        path: `components/ui/new-${i}.tsx`,
        action: "create" as const,
        content: "...",
        type: "registry:ui",
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        path: `components/ui/existing-${i}.tsx`,
        action: "overwrite" as const,
        content: "...",
        type: "registry:ui",
      })),
    ]

    const result = createResult({ files })
    const output = formatDryRunResult(result, ["dashboard"])

    expect(output).toContain("(10)")
    // All files should be listed.
    expect(output).toContain("new-0.tsx")
    expect(output).toContain("new-5.tsx")
    expect(output).toContain("existing-0.tsx")
    expect(output).toContain("existing-3.tsx")
  })
})

describe("formatDryRunResult --diff", () => {
  function createResult(overrides: Partial<DryRunResult> = {}): DryRunResult {
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      css: null,
      envVars: null,
      fonts: [],
      docs: null,
      ...overrides,
    }
  }

  test("should show focused diff output with box-drawing borders", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'export function Button() { return <button>New</button> }',
          existingContent:
            'export function Button() { return <button>Old</button> }',
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], { diff: "button" })

    expect(output).toContain("components/ui/button.tsx")
    expect(output).toContain("overwrite")
    expect(output).toContain("Old")
    expect(output).toContain("New")
    // Should not show summary sections.
    expect(output).not.toContain("Files")
    expect(output).not.toContain("Dependencies")
  })

  test("should show diff hint in dry-run summary", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: "new content",
          existingContent: "old content",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"])

    expect(output).toContain("Run with --diff")
  })

  test("should only show matched file", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: "new button",
          existingContent: "old button",
          type: "registry:ui",
        },
        {
          path: "components/ui/card.tsx",
          action: "overwrite",
          content: "new card",
          existingContent: "old card",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["dashboard"], {
      diff: "button",
    })

    expect(output).toContain("button.tsx")
    // Should not show card at all — focused output.
    expect(output).not.toContain("card.tsx")
  })

  test("should show error when --diff path matches no files", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: "new",
          existingContent: "old",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "nonexistent",
    })

    expect(output).toContain("No file matching")
    expect(output).toContain("nonexistent")
  })

  test("should show new file content as additions", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "export function Button() {}",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("create")
    expect(output).toContain("+export function Button() {}")
  })

  test("should show no changes for skipped files", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "skip",
          content: "same content",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("No changes.")
  })

  test("should show formatting-only message for whitespace/quote differences", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'import { cn } from "@/lib/utils";\nexport function Button() {}',
          existingContent: "import { cn } from '@/lib/utils'\nexport function Button() {}",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("Formatting-only changes")
  })

  test("should show real diff for non-formatting changes", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'export function Button() { return <button>New</button> }',
          existingContent: 'export function Button() { return <button>Old</button> }',
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("---")
    expect(output).toContain("+++")
    expect(output).toContain("@@")
  })

  test("should show CSS diff when path matches CSS file", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "...",
          type: "registry:ui",
        },
      ],
      css: {
        path: "app/globals.css",
        content: "@theme {\n  --color-primary: red;\n}\n",
        existingContent: "@theme {\n}\n",
        action: "update",
        cssVarsCount: 1,
      },
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "globals.css",
    })

    expect(output).toContain("globals.css")
    expect(output).toContain("update")
    expect(output).toContain("--color-primary")
  })

  test("should detect multi-line to single-line reformatting as formatting-only", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: [
            'const buttonVariants = cva("inline-flex", {',
            "  variants: {",
            '    size: {',
            '      default: "h-8 gap-1.5 px-2.5 has-[>svg]:px-1.5",',
            "    },",
            "  },",
            "})",
          ].join("\n"),
          existingContent: [
            'const buttonVariants = cva("inline-flex", {',
            "  variants: {",
            "    size: {",
            "      default:",
            '        "h-8 gap-1.5 px-2.5 has-[>svg]:px-1.5",',
            "    },",
            "  },",
            "})",
          ].join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Multi-line to single-line wrapping should not show as red/green diff.
    expect(output).not.toContain("-      default:")
    expect(output).not.toContain('+      default: "h-8')
  })

  test("should suppress multi-line to single-line reformatting but show real change in same hunk", () => {
    // Simulates cva variant values going from multi-line to single-line,
    // with one actual content change (size-10 → size-9).
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: [
            "  variants: {",
            "    variant: {",
            '      outline: "border-border bg-background hover:bg-muted",',
            '      secondary: "bg-secondary text-secondary-foreground",',
            '      ghost: "hover:bg-muted hover:text-foreground",',
            "    },",
            "    size: {",
            '      default: "h-8 gap-1.5 px-2.5",',
            '      lg: "h-9 gap-1.5 px-2.5",',
            '      icon: "size-8",',
            '      "icon-lg": "size-9",',
            "    },",
            "  },",
          ].join("\n"),
          existingContent: [
            "  variants: {",
            "    variant: {",
            "      outline:",
            '        "border-border bg-background hover:bg-muted",',
            "      secondary:",
            '        "bg-secondary text-secondary-foreground",',
            "      ghost:",
            '        "hover:bg-muted hover:text-foreground",',
            "    },",
            "    size: {",
            "      default:",
            '        "h-8 gap-1.5 px-2.5",',
            "      lg:",
            '        "h-9 gap-1.5 px-2.5",',
            "      icon:",
            '        "size-8",',
            '      "icon-lg": "size-10",',
            "    },",
            "  },",
          ].join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Multi-line to single-line reformatting should be suppressed.
    expect(output).not.toContain("-      outline:")
    expect(output).not.toContain("-      secondary:")
    expect(output).not.toContain("-      ghost:")
    expect(output).not.toContain("-      default:")
    expect(output).not.toContain("-      lg:")
    expect(output).not.toContain("-      icon:")
    // Real change should show.
    expect(output).toContain("size-10")
    expect(output).toContain("size-9")
  })

  test("should detect semicolon-only differences as formatting-only", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'import { cn } from "@/lib/utils";\nexport function Button() {};',
          existingContent: 'import { cn } from "@/lib/utils"\nexport function Button() {}',
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("Formatting-only changes")
  })

  test("should skip quote-only line changes but show real changes in same group", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: [
            '        lg: "h-9 gap-1.5 px-2.5",',
            '        icon: "size-8",',
            '        "icon-sm": "size-7",',
            '        "icon-lg": "size-9",',
          ].join("\n"),
          existingContent: [
            "        lg: 'h-9 gap-1.5 px-2.5',",
            "        icon: 'size-8',",
            "        'icon-sm': 'size-7',",
            "        'icon-lg': 'size-10',",
          ].join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Quote-only changes should NOT appear as red/green diff lines.
    expect(output).not.toContain("-        lg:")
    expect(output).not.toContain("-        icon:")
    expect(output).not.toContain('-        \'icon-sm\'')
    // Real change (size-10 -> size-9) SHOULD appear as a diff.
    expect(output).toContain("size-10")
    expect(output).toContain("size-9")
  })

  test("should show correct hunk header when formatting changes are mixed with real changes", () => {
    // 5 lines old, 5 lines new — only line 5 has a real change.
    // Hunk header should reflect same line count, not show line removal.
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: [
            'import { cn } from "@/lib/utils"',
            "",
            'const a = "hello"',
            'const b = "world"',
            'const c = "new-value"',
          ].join("\n"),
          existingContent: [
            "import { cn } from '@/lib/utils'",
            "",
            "const a = 'hello'",
            "const b = 'world'",
            "const c = 'old-value'",
          ].join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Hunk header should show equal old/new line counts since no lines were added/removed.
    expect(output).toMatch(/@@ -\d+,(\d+) \+\d+,\1 @@/)
    // Real change should show.
    expect(output).toContain("old-value")
    expect(output).toContain("new-value")
  })

  test("should suppress formatting-only hunks entirely", () => {
    // All changes are quote-only — no hunk should be emitted.
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'const a = "hello"\nconst b = "world"',
          existingContent: "const a = 'hello'\nconst b = 'world'",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    expect(output).toContain("Formatting-only changes")
    expect(output).not.toContain("@@")
  })

  test("should suppress formatting-only hunk but show real-change hunk with correct position", () => {
    // Two hunks separated by enough context:
    // - Hunk 1 (top): quote-only changes → suppressed.
    // - Hunk 2 (bottom): real change → shown with correct line number.
    const oldLines = [
      "import { cn } from '@/lib/utils'",   // line 1: quote diff.
      "",                                     // line 2.
      "const a = 'hello'",                   // line 3: quote diff.
      "",                                     // line 4.
      "// spacer 1",                          // line 5.
      "// spacer 2",                          // line 6.
      "// spacer 3",                          // line 7.
      "// spacer 4",                          // line 8.
      "// spacer 5",                          // line 9.
      "// spacer 6",                          // line 10.
      "// spacer 7",                          // line 11.
      "",                                     // line 12.
      "const c = 'old-value'",               // line 13: real change.
    ]
    const newLines = [
      'import { cn } from "@/lib/utils"',    // line 1: quote diff.
      "",                                     // line 2.
      'const a = "hello"',                   // line 3: quote diff.
      "",                                     // line 4.
      "// spacer 1",                          // line 5.
      "// spacer 2",                          // line 6.
      "// spacer 3",                          // line 7.
      "// spacer 4",                          // line 8.
      "// spacer 5",                          // line 9.
      "// spacer 6",                          // line 10.
      "// spacer 7",                          // line 11.
      "",                                     // line 12.
      'const c = "new-value"',               // line 13: real change.
    ]

    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: newLines.join("\n"),
          existingContent: oldLines.join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Only one @@ header should appear (the real change hunk).
    const hunkHeaders = output.match(/@@ .* @@/g) ?? []
    expect(hunkHeaders).toHaveLength(1)
    // The hunk should reference line 13 area, not line 1.
    expect(output).toContain("+10,")
    // Real change should show.
    expect(output).toContain("old-value")
    expect(output).toContain("new-value")
    // Quote-only changes should NOT show.
    expect(output).not.toContain("@/lib/utils")
  })

  test("should show semicolons mixed with real changes correctly", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/input.tsx",
          action: "overwrite",
          content: [
            'import { cn } from "@/lib/utils";',
            'const a = "hello";',
            'const b = "changed";',
          ].join("\n"),
          existingContent: [
            'import { cn } from "@/lib/utils"',
            'const a = "hello"',
            'const b = "original"',
          ].join("\n"),
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "input",
    })

    // Semicolon-only lines should not show as diffs.
    expect(output).not.toContain('-import { cn }')
    expect(output).not.toContain('-const a')
    // Real change should show.
    expect(output).toContain("original")
    expect(output).toContain("changed")
  })

  test("should display actual file content not normalized content", () => {
    // The diff should show the real double-quoted new content, not the
    // internal normalized version used for comparison.
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: 'const color = "red";\nconst size = "new-size";',
          existingContent: "const color = 'red'\nconst size = 'old-size'",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Context line should use the actual new file content (double quotes + semicolon).
    expect(output).toContain('"red"')
    // Changed line should show actual content.
    expect(output).toContain('"new-size"')
  })

  test("should skip whitespace-only line changes in diff", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "overwrite",
          content: "line1\nconst x = 1\nline3",
          existingContent: "line1\nconst x =  1\nline3",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "button",
    })

    // Whitespace-only change should be shown as context, not as red/green diff.
    expect(output).not.toContain("-const x")
    expect(output).not.toContain("+const x")
  })

  test("should show CSS diff with full context showing existing vars", () => {
    const existingCss = [
      "@theme {",
      "  --color-background: white;",
      "  --color-foreground: black;",
      "}",
    ].join("\n")
    const newCss = [
      "@theme {",
      "  --color-background: white;",
      "  --color-foreground: black;",
      "  --color-primary: red;",
      "}",
    ].join("\n")

    const result = createResult({
      css: {
        path: "app/globals.css",
        content: newCss,
        existingContent: existingCss,
        action: "update",
        cssVarsCount: 1,
      },
    })

    const output = formatDryRunResult(result, ["alert"], {
      diff: "globals",
    })

    // Should show existing vars as context.
    expect(output).toContain("--color-background")
    expect(output).toContain("--color-foreground")
    // Should show new var as addition.
    expect(output).toContain("--color-primary")
  })

  test("should show new CSS file as all additions", () => {
    const result = createResult({
      css: {
        path: "app/globals.css",
        content: "@theme {\n  --color-primary: red;\n}\n",
        action: "create",
        cssVarsCount: 1,
      },
    })

    const output = formatDryRunResult(result, ["button"], {
      diff: "globals",
    })

    expect(output).toContain("globals.css")
    expect(output).toContain("create")
    expect(output).toContain("+@theme")
  })

  test("should match both file and CSS when filter is ambiguous", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/globals.tsx",
          action: "create",
          content: "export function Globals() {}",
          type: "registry:ui",
        },
      ],
      css: {
        path: "app/globals.css",
        content: "@theme { --primary: red; }",
        action: "create",
        cssVarsCount: 1,
      },
    })

    const output = formatDryRunResult(result, ["thing"], {
      diff: "globals",
    })

    // Should show both the file and the CSS.
    expect(output).toContain("globals.tsx")
    expect(output).toContain("globals.css")
  })
})

describe("formatDryRunResult --view", () => {
  function createResult(overrides: Partial<DryRunResult> = {}): DryRunResult {
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      css: null,
      envVars: null,
      fonts: [],
      docs: null,
      ...overrides,
    }
  }

  test("should show focused view with full content", () => {
    const content = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n")

    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content,
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], { view: "button" })

    expect(output).toContain("button.tsx")
    expect(output).toContain("create")
    expect(output).toContain("20 lines")
    expect(output).toContain("line 1")
    expect(output).toContain("line 20")
    // Should not show summary sections.
    expect(output).not.toContain("Files")
    expect(output).not.toContain("Dependencies")
  })

  test("should show all matched files with full content", () => {
    const content = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n")

    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content,
          type: "registry:ui",
        },
        {
          path: "components/ui/button-group.tsx",
          action: "create",
          content,
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["dashboard"], { view: "button" })

    expect(output).toContain("button.tsx")
    expect(output).toContain("button-group.tsx")
    expect(output).toContain("line 1")
    expect(output).toContain("line 20")
  })

  test("should show only matched file", () => {
    const buttonContent = Array.from({ length: 20 }, (_, i) => `button line ${i + 1}`).join("\n")
    const cardContent = Array.from({ length: 20 }, (_, i) => `card line ${i + 1}`).join("\n")

    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: buttonContent,
          type: "registry:ui",
        },
        {
          path: "components/ui/card.tsx",
          action: "create",
          content: cardContent,
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["dashboard"], {
      view: "button.tsx",
    })

    expect(output).toContain("button.tsx")
    expect(output).not.toContain("card.tsx")
    expect(output).toContain("button line 1")
    expect(output).toContain("button line 20")
  })

  test("should show error when --view path matches no files", () => {
    const result = createResult({
      files: [
        {
          path: "components/ui/button.tsx",
          action: "create",
          content: "content",
          type: "registry:ui",
        },
      ],
    })

    const output = formatDryRunResult(result, ["button"], {
      view: "nonexistent",
    })

    expect(output).toContain("No file matching")
    expect(output).toContain("nonexistent")
  })

  test("should show CSS file content when path matches", () => {
    const cssContent = "@theme {\n  --color-primary: red;\n}"

    const result = createResult({
      css: {
        path: "app/globals.css",
        content: cssContent,
        action: "update",
        cssVarsCount: 1,
      },
    })

    const output = formatDryRunResult(result, ["button"], {
      view: "globals",
    })

    expect(output).toContain("globals.css")
    expect(output).toContain("update")
    expect(output).toContain("--color-primary")
  })
})

describe("resolveFilterPath", () => {
  const files = [
    { path: "components/ui/button.tsx", action: "create" as const, content: "", type: "registry:ui" },
    { path: "components/ui/card.tsx", action: "create" as const, content: "", type: "registry:ui" },
    { path: "hooks/use-mobile.ts", action: "create" as const, content: "", type: "registry:hook" },
  ]

  test("should match exact path", () => {
    const result = resolveFilterPath(files, "components/ui/button.tsx")
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe("components/ui/button.tsx")
  })

  test("should match partial path (filename)", () => {
    const result = resolveFilterPath(files, "button")
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe("components/ui/button.tsx")
  })

  test("should match partial path (directory segment)", () => {
    const result = resolveFilterPath(files, "ui/card")
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe("components/ui/card.tsx")
  })

  test("should return multiple matches for ambiguous filter", () => {
    const result = resolveFilterPath(files, "components/ui")
    expect(result).toHaveLength(2)
  })

  test("should return empty array when no match", () => {
    const result = resolveFilterPath(files, "nonexistent")
    expect(result).toHaveLength(0)
  })
})
