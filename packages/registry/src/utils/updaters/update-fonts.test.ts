import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { getProjectInfo, ProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest"

import {
  findLayoutFile,
  massageTreeForFonts,
  transformLayoutFonts,
  updateFonts,
} from "./update-fonts"

const mockConfig = {
  style: "new-york",
  rsc: true,
  tsx: true,
  tailwind: {
    config: "tailwind.config.js",
    css: "app/globals.css",
    baseColor: "neutral",
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
    cwd: "/test",
    tailwindConfig: "/test/tailwind.config.js",
    tailwindCss: "/test/app/globals.css",
    utils: "/test/lib/utils.ts",
    components: "/test/components",
    lib: "/test/lib",
    hooks: "/test/hooks",
    ui: "/test/components/ui",
  },
} as any

describe("transformLayoutFonts", () => {
  it("should add a single Google font to empty layout", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import type { Metadata } from "next"
      import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      export const metadata: Metadata = {
        title: "My App",
      }

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should add multiple Google fonts using cn()", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "jetbrains-mono",
        type: "registry:font" as const,
        font: {
          family: "JetBrains Mono",
          provider: "google" as const,
          import: "JetBrains_Mono",
          variable: "--font-mono",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import type { Metadata } from "next"
      import "./globals.css"
      import { Inter, JetBrains_Mono } from "next/font/google";
      import { cn } from "@/lib/utils";

      const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-mono", inter.variable, jetbrainsMono.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should use configured utils alias when adding cn import", async () => {
    const configWithCustomUtilsAlias = {
      ...mockConfig,
      aliases: {
        ...mockConfig.aliases,
        utils: "~/lib/utils",
      },
    }
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "jetbrains-mono",
        type: "registry:font" as const,
        font: {
          family: "JetBrains Mono",
          provider: "google" as const,
          import: "JetBrains_Mono",
          variable: "--font-mono",
          subsets: ["latin"],
        },
      },
    ]

    const firstRun = await transformLayoutFonts(
      input,
      fonts,
      configWithCustomUtilsAlias
    )
    const secondRun = await transformLayoutFonts(
      firstRun,
      fonts,
      configWithCustomUtilsAlias
    )

    expect(firstRun).toContain(`import { cn } from "~/lib/utils";`)
    expect(secondRun).toBe(firstRun)
  })

  it("should use monorepo utils alias when adding cn import", async () => {
    const monorepoConfig = {
      ...mockConfig,
      aliases: {
        ...mockConfig.aliases,
        utils: "@workspace/ui/lib/utils",
      },
    }
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "jetbrains-mono",
        type: "registry:font" as const,
        font: {
          family: "JetBrains Mono",
          provider: "google" as const,
          import: "JetBrains_Mono",
          variable: "--font-mono",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, monorepoConfig)

    expect(result).toContain(`import { cn } from "@workspace/ui/lib/utils";`)
  })

  it("should preserve existing string className", async () => {
    const input = `
import type { Metadata } from "next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import type { Metadata } from "next"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className="antialiased">{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should replace existing font with same variable", async () => {
    const input = `
import { Roboto } from "next/font/google"

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import { Roboto, Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={inter.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should handle existing cn() className", async () => {
    const input = `
import { cn } from "@/lib/utils"
import { Roboto } from "next/font/google"

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("antialiased", roboto.variable)}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import { cn } from "@/lib/utils"
      import { Roboto, Inter } from "next/font/google"

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={cn("antialiased", inter.variable)}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should add font with weight option", async () => {
    const input = `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
          weight: ["400", "500", "600", "700"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should add already-imported font to html className", async () => {
    const input = `
import { Inter } from "next/font/google"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    // Font is already imported but not on <html>, so it should be added.
    expect(result).toMatchInlineSnapshot(`
      "
      import { Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={inter.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should skip Geist font if already imported (create-next-app scenario)", async () => {
    // This simulates a fresh create-next-app project with Geist already set up.
    const input = `
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
        {children}
      </body>
    </html>
  );
}
`
    const fonts = [
      {
        name: "font-geist",
        type: "registry:font" as const,
        font: {
          family: "'Geist Variable', sans-serif",
          provider: "google" as const,
          import: "Geist",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    // Geist is already imported, so the layout should remain unchanged.
    expect(result).toBe(input)
  })

  it("should add to existing next/font/google import", async () => {
    const input = `
import { Roboto } from "next/font/google"

const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import { Roboto, Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={roboto.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should handle expression className that is not cn()", async () => {
    const input = `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={someVariable}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={someVariable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should handle template literal className", async () => {
    const input = `
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={\`\${GeistSans.variable} \${GeistMono.variable} antialiased\`}>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import { GeistSans } from "geist/font/sans"
      import { GeistMono } from "geist/font/mono"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={\`\${GeistSans.variable} \${GeistMono.variable} antialiased\`}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should be idempotent when run multiple times", async () => {
    const input = `
import type { Metadata } from "next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    // Run once.
    const firstRun = await transformLayoutFonts(input, fonts, mockConfig)

    // Run again on the output.
    const secondRun = await transformLayoutFonts(firstRun, fonts, mockConfig)

    // Run a third time.
    const thirdRun = await transformLayoutFonts(secondRun, fonts, mockConfig)

    // All runs should produce the same result.
    expect(secondRun).toBe(firstRun)
    expect(thirdRun).toBe(firstRun)
  })

  it("should add a single serif font to empty layout", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-lora",
        type: "registry:font" as const,
        font: {
          family: "'Lora Variable', serif",
          provider: "google" as const,
          import: "Lora",
          variable: "--font-serif",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import type { Metadata } from "next"
      import "./globals.css"
      import { Lora } from "next/font/google";
      import { cn } from "@/lib/utils";

      const lora = Lora({subsets:['latin'],variable:'--font-serif'});

      export const metadata: Metadata = {
        title: "My App",
      }

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-serif", lora.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should add serif and sans fonts together", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "font-lora",
        type: "registry:font" as const,
        font: {
          family: "'Lora Variable', serif",
          provider: "google" as const,
          import: "Lora",
          variable: "--font-serif",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "
      import type { Metadata } from "next"
      import "./globals.css"
      import { Inter, Lora } from "next/font/google";
      import { cn } from "@/lib/utils";

      const lora = Lora({subsets:['latin'],variable:'--font-serif'});

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-serif", inter.variable, lora.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should replace existing font-sans with font-serif on html", async () => {
    const input = `
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-playfair-display",
        type: "registry:font" as const,
        font: {
          family: "'Playfair Display Variable', serif",
          provider: "google" as const,
          import: "Playfair_Display",
          variable: "--font-serif",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    // font-sans should be replaced with font-serif.
    expect(result).toContain('"font-serif"')
    expect(result).not.toContain('"font-sans"')
    expect(result).toContain("playfairDisplay.variable")
    // Inter's variable should remain since we only added Playfair.
    expect(result).toContain("inter.variable")
  })

  it("should be idempotent with multiple fonts", async () => {
    const input = `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "inter",
        type: "registry:font" as const,
        font: {
          family: "Inter",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "jetbrains-mono",
        type: "registry:font" as const,
        font: {
          family: "JetBrains Mono",
          provider: "google" as const,
          import: "JetBrains_Mono",
          variable: "--font-mono",
          subsets: ["latin"],
        },
      },
    ]

    // Run once.
    const firstRun = await transformLayoutFonts(input, fonts, mockConfig)

    // Run again on the output.
    const secondRun = await transformLayoutFonts(firstRun, fonts, mockConfig)

    // All runs should produce the same result.
    expect(secondRun).toBe(firstRun)
  })

  it("should be idempotent when font is already imported and on html", async () => {
    // Simulates a layout where the font was already added by a previous preset.
    const input = `
import { Merriweather } from "next/font/google";
import { cn } from "@/lib/utils";

const merriweather = Merriweather({subsets:['latin'],weight:['400','700'],variable:'--font-serif'});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-serif", merriweather.variable)}>
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-merriweather",
        type: "registry:font" as const,
        font: {
          family: "'Merriweather Variable', serif",
          provider: "google" as const,
          import: "Merriweather",
          variable: "--font-serif",
          subsets: ["latin"],
          weight: ["400", "700"],
        },
      },
    ]

    const firstRun = await transformLayoutFonts(input, fonts, mockConfig)
    const secondRun = await transformLayoutFonts(firstRun, fonts, mockConfig)

    // Should remain unchanged across all runs.
    expect(firstRun).toBe(input)
    expect(secondRun).toBe(input)
  })

  it("should be idempotent when adding font to pre-existing layout with other fonts", async () => {
    // Layout already has Inter, and we're adding Merriweather.
    const input = `
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "font-merriweather",
        type: "registry:font" as const,
        font: {
          family: "'Merriweather Variable', serif",
          provider: "google" as const,
          import: "Merriweather",
          variable: "--font-serif",
          subsets: ["latin"],
          weight: ["400", "700"],
        },
      },
    ]

    const firstRun = await transformLayoutFonts(input, fonts, mockConfig)
    const secondRun = await transformLayoutFonts(firstRun, fonts, mockConfig)

    // Second run should be identical to first.
    expect(secondRun).toBe(firstRun)
    // Inter should still be there, Merriweather should be added.
    expect(firstRun).toContain("font-sans")
    expect(firstRun).toContain("font-serif")
    expect(firstRun).toContain("inter.variable")
    expect(firstRun).toContain("merriweather.variable")
  })

  it("should add .variable but not utility class for custom selector font", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "font-playfair-display",
        type: "registry:font" as const,
        font: {
          family: "'Playfair Display Variable', serif",
          provider: "google" as const,
          import: "Playfair_Display",
          variable: "--font-heading",
          subsets: ["latin"],
          selector: "h1, h2, h3, h4, h5, h6",
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    // .variable should be on <html> for both fonts.
    expect(result).toContain("inter.variable")
    expect(result).toContain("playfairDisplayHeading.variable")
    // Only font-sans utility class should be on <html>, not font-heading.
    expect(result).toContain('"font-sans"')
    expect(result).not.toContain('"font-heading"')
  })

  it("should create a second variable declaration when body and heading use the same Google font", async () => {
    const input = `
import type { Metadata } from "next"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
      {
        name: "font-heading-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-heading",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toContain('import { Inter } from "next/font/google";')
    expect(result).toContain(
      "const inter = Inter({subsets:['latin'],variable:'--font-sans'});"
    )
    expect(result).toContain(
      "const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});"
    )
    expect(result).toContain(
      'className={cn("font-sans", inter.variable, interHeading.variable)}'
    )
    expect(result).not.toContain('"font-heading"')
  })

  it("should keep an existing heading font when adding the matching body font", async () => {
    const input = `
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={interHeading.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [
      {
        name: "font-inter",
        type: "registry:font" as const,
        font: {
          family: "'Inter Variable', sans-serif",
          provider: "google" as const,
          import: "Inter",
          variable: "--font-sans",
          subsets: ["latin"],
        },
      },
    ]

    const result = await transformLayoutFonts(input, fonts, mockConfig)

    expect(result).toContain('import { cn } from "@/lib/utils"')
    expect(result).toContain(
      "const inter = Inter({subsets:['latin'],variable:'--font-sans'});"
    )
    expect(result).toContain("interHeading.variable")
    expect(result).toContain('"font-sans"')
    expect(result).toContain("inter.variable")
  })
})

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectInfo: vi.fn().mockResolvedValue({
    framework: { name: "vite" },
    isTsx: true,
    isSrcDir: false,
  }),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    stop: vi.fn(),
    fail: vi.fn(),
  })),
}))

describe("massageTreeForFonts", () => {
  it("should add font @apply to html when no existing css", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"].html).toEqual({
      "@apply font-sans": {},
    })
  })

  it("should preserve existing html css rules when adding font classes", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
      ],
      cssVars: {
        theme: {},
      },
      css: {
        "@layer base": {
          html: {
            "@apply bg-background text-foreground": {},
          },
        },
      },
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"].html).toEqual({
      "@apply bg-background text-foreground font-sans": {},
    })
  })

  it("should combine multiple font classes into a single @apply", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
        {
          name: "font-lora",
          type: "registry:font" as const,
          font: {
            family: "'Lora Variable', serif",
            provider: "google" as const,
            import: "Lora",
            variable: "--font-serif",
            subsets: ["latin"],
          },
        },
      ],
      css: {
        "@layer base": {
          html: {
            "@apply bg-background text-foreground": {},
          },
        },
      },
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"].html).toEqual({
      "@apply bg-background text-foreground font-sans font-serif": {},
    })
  })

  it("should apply font to custom selector", async () => {
    const tree = {
      fonts: [
        {
          name: "font-playfair-display",
          type: "registry:font" as const,
          font: {
            family: "'Playfair Display Variable', serif",
            provider: "google" as const,
            import: "Playfair_Display",
            variable: "--font-heading",
            subsets: ["latin"],
            selector: "h1, h2, h3, h4, h5, h6",
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"]["h1, h2, h3, h4, h5, h6"]).toEqual({
      "@apply font-heading": {},
    })
    expect(result.css!["@layer base"].html).toBeUndefined()
  })

  it("should handle mixed selectors (default html + custom)", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
        {
          name: "font-playfair-display",
          type: "registry:font" as const,
          font: {
            family: "'Playfair Display Variable', serif",
            provider: "google" as const,
            import: "Playfair_Display",
            variable: "--font-heading",
            subsets: ["latin"],
            selector: "h1, h2, h3, h4, h5, h6",
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"].html).toEqual({
      "@apply font-sans": {},
    })
    expect(result.css!["@layer base"]["h1, h2, h3, h4, h5, h6"]).toEqual({
      "@apply font-heading": {},
    })
  })

  it("should not auto-apply non-root font roles without a selector", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
        {
          name: "font-heading-playfair-display",
          type: "registry:font" as const,
          font: {
            family: "'Playfair Display Variable', serif",
            provider: "google" as const,
            import: "Playfair_Display",
            variable: "--font-heading",
            subsets: ["latin"],
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.css!["@layer base"].html).toEqual({
      "@apply font-sans": {},
    })
    expect(
      Object.values(result.css!["@layer base"]).some((rule) =>
        Object.keys(rule as Record<string, unknown>).some((key) =>
          key.includes("font-heading")
        )
      )
    ).toBe(false)
  })

  it("should install non-variable font using dependency field", async () => {
    const tree = {
      fonts: [
        {
          name: "font-lato",
          type: "registry:font" as const,
          font: {
            family: "'Lato', sans-serif",
            provider: "google" as const,
            import: "Lato",
            variable: "--font-sans",
            weight: ["400", "700"],
            dependency: "@fontsource/lato",
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.dependencies).toContain("@fontsource/lato")
    expect(result.dependencies).not.toContain("@fontsource-variable/lato")
    expect(result.css).toHaveProperty('@import "@fontsource/lato"')
    expect(result.cssVars!.theme!["--font-sans"]).toBe("'Lato', sans-serif")
  })

  it("should fall back to @fontsource-variable when no dependency is specified", async () => {
    const tree = {
      fonts: [
        {
          name: "font-inter",
          type: "registry:font" as const,
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google" as const,
            import: "Inter",
            variable: "--font-sans",
            subsets: ["latin"],
          },
        },
      ],
    } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result.dependencies).toContain("@fontsource-variable/inter")
    expect(result.css).toHaveProperty('@import "@fontsource-variable/inter"')
  })
})

const interSans = {
  name: "font-inter",
  type: "registry:font" as const,
  font: {
    family: "'Inter Variable', sans-serif",
    provider: "google" as const,
    import: "Inter",
    variable: "--font-sans",
    subsets: ["latin"],
  },
}

const playfairHeading = {
  name: "font-playfair-display",
  type: "registry:font" as const,
  font: {
    family: "'Playfair Display Variable', serif",
    provider: "google" as const,
    import: "Playfair_Display",
    variable: "--font-heading",
    subsets: ["latin"],
    selector: "h1, h2, h3, h4, h5, h6",
  },
}

describe("transformLayoutFonts (user-authored layouts)", () => {
  it('inserts the import above a "use client" directive and header comment when there are no imports', async () => {
    const input = `// Root layout.
"use client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the import and font declaration land above the directive,
    // so "use client" is no longer the first statement.
    expect(result).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      // Root layout.
      "use client"

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it('inserts after the last import when imports follow a "use client" directive', async () => {
    const input = `"use client"

import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      ""use client"

      import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("drops a trailing same-line comment after the last import", async () => {
    const input = `import type { Metadata } from "next" // types
import "./globals.css" // global styles

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the trailing comment on the last import is dropped.
    expect(result).toMatchInlineSnapshot(`
      "import type { Metadata } from "next" // types
      import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      export const metadata: Metadata = {
        title: "My App",
      }

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("handles CRLF line endings", async () => {
    const input = `import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`.replace(/\n/g, "\r\n")
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: inserted lines use LF, so the output mixes line endings.
    expect(result.replace(/\r/g, "\\r")).toMatchInlineSnapshot(`
      "import type { Metadata } from "next"\\r
      import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      export const metadata: Metadata = {\\r
        title: "My App",\\r
      }\\r
      \\r
      export default function RootLayout({\\r
        children,\\r
      }: {\\r
        children: React.ReactNode\\r
      }) {\\r
        return (\\r
          <html lang="en" className={cn("font-sans", inter.variable)}>\\r
            <body>{children}</body>\\r
          </html>\\r
        )\\r
      }\\r
      "
    `)
  })

  it("adds to a single-line named import without spaces", async () => {
    const input = `import {Roboto} from "next/font/google"

const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import {Roboto, Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={roboto.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("adds to a multi-line named import with a trailing comma", async () => {
    const input = `import {
  Roboto,
  Lato,
} from "next/font/google"

const roboto = Roboto({subsets:['latin'],variable:'--font-display'})
const lato = Lato({subsets:['latin'],weight:['400'],variable:'--font-body'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import {
        Roboto,
        Lato, Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})
      const lato = Lato({subsets:['latin'],weight:['400'],variable:'--font-body'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className={roboto.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("appends className after the last attribute when <html> attributes span several lines", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html
            lang="en"
            suppressHydrationWarning className={cn("font-sans", inter.variable)}
          >
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("adds className after a spread attribute on <html>", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" {...props}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
        ...props
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" {...props} className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("wraps an existing double-quoted className string on <html> with cn()", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark antialiased">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("dark antialiased", "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
    expect(await transformLayoutFonts(result, [interSans], mockConfig)).toBe(
      result
    )
  })

  it("wraps an existing single-quoted className string on <html> with cn()", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='dark'>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang='en' className={cn("dark", "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("leaves a valueless className attribute on <html> untouched", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the font is declared but not applied to <html>.
    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("converts a template literal className on <html> into cn() arguments", async () => {
    const input = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={\`\${geistSans.variable} \${geistMono.variable} font-sans  h-full antialiased\`}
    >
      <body>{children}</body>
    </html>
  );
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Static classes come first, then expressions; "font-sans" is deduplicated.
    expect(result).toMatchInlineSnapshot(`
      "import type { Metadata } from "next";
      import { Geist, Geist_Mono, Inter } from "next/font/google";
      import "./globals.css";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const geistSans = Geist({
        variable: "--font-geist-sans",
        subsets: ["latin"],
      });

      const geistMono = Geist_Mono({
        variable: "--font-geist-mono",
        subsets: ["latin"],
      });

      export const metadata: Metadata = {
        title: "Create Next App",
        description: "Generated by create next app",
      };

      export default function RootLayout({
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>) {
        return (
          <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
          >
            <body>{children}</body>
          </html>
        );
      }
      "
    `)
    expect(await transformLayoutFonts(result, [interSans], mockConfig)).toBe(
      result
    )
  })

  it("keeps non-variable template literal expressions as cn() arguments", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={\`\${theme === "dark" ? "dark" : ""} \${inter.variable}\`}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn(theme === "dark" ? "dark" : "", "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("wraps another expression className on <html> with cn()", async () => {
    const input = `import clsx from "clsx"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={clsx("dark", isRtl && "rtl")}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import clsx from "clsx"
      import "./globals.css"
      import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn(clsx("dark", isRtl && "rtl"), "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("updates an existing cn() className on <html>", async () => {
    const input = `import { cn } from "@/lib/utils"
import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-mono", "antialiased", roboto.variable)}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: removing the leading "font-mono" leaves a space after "cn(".
    expect(result).toMatchInlineSnapshot(`
      "import { cn } from "@/lib/utils"
      import { Roboto, Inter } from "next/font/google"
      import "./globals.css"

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn( "antialiased", roboto.variable, "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
    expect(await transformLayoutFonts(result, [interSans], mockConfig)).toBe(
      result
    )
  })

  it("updates a multi-line cn() className on <html>", async () => {
    const input = `import { cn } from "@/lib/utils"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-serif",
        "antialiased"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the new arguments follow the closing line break and the
    // rewritten lines are re-indented.
    expect(result).toMatchInlineSnapshot(`
      "import { cn } from "@/lib/utils"
      import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html
            lang="en"
            className={cn(
                    "antialiased"
                  , "font-sans", inter.variable)}
          >
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("replaces a different font variable on <html> when adding a root font", async () => {
    const input = `import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: roboto.variable is dropped from <html>.
    expect(result).toMatchInlineSnapshot(`
      "import { Roboto, Inter } from "next/font/google"
      import "./globals.css"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("keeps an existing font variable on <html> when adding a selector font", async () => {
    const input = `import { Geist_Mono } from "next/font/google"
import "./globals.css"

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-geist-mono'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(
      input,
      [playfairHeading],
      mockConfig
    )

    expect(result).toMatchInlineSnapshot(`
      "import { Geist_Mono, Playfair_Display } from "next/font/google"
      import "./globals.css"
      import { cn } from "@/lib/utils";

      const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

      const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-geist-mono'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn(geistMono.variable, playfairDisplayHeading.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("keeps an existing heading font variable on <html> when adding the body font", async () => {
    const input = `import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={interHeading.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { cn } from "@/lib/utils"
      import { Inter } from "next/font/google"

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const interHeading = Inter({subsets:['latin'],variable:'--font-heading'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn(interHeading.variable, "font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("leaves <html> unchanged when it already has the selector font variable", async () => {
    const input = `import { Playfair_Display } from "next/font/google"
import "./globals.css"

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfairDisplayHeading.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(
      input,
      [playfairHeading],
      mockConfig
    )

    expect(result).toBe(input)
  })

  it("renames an existing declaration that uses the same CSS variable, including typeof, export and shorthand references", async () => {
    const input = `import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
})

export { roboto }

export const fonts = { roboto }

type Font = typeof roboto

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the rename also changes the exported name and the
    // shorthand property key, and the unused Roboto import is kept.
    expect(result).toMatchInlineSnapshot(`
      "import { Roboto, Inter } from "next/font/google"
      import "./globals.css"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export { inter }

      export const fonts = { inter }

      type Font = typeof inter

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("adds cn to an existing utils import that does not import it", async () => {
    const input = `import { formatDate } from "@/lib/utils"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { formatDate, cn } from "@/lib/utils"
      import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("adds cn to a default-only utils import", async () => {
    const input = `import utils from "@/lib/utils"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import utils, { cn } from "@/lib/utils"
      import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("does not add a cn import when cn is imported from another module", async () => {
    const input = `import { cn } from "@/lib/cn"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { cn } from "@/lib/cn"
      import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("treats an aliased cn import as present", async () => {
    const input = `import { cn as cx } from "@/lib/utils"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: no cn import is added, so cn() is unbound.
    expect(result).toMatchInlineSnapshot(`
      "import { cn as cx } from "@/lib/utils"
      import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("adds the font but no className when there is no <html> element", async () => {
    const input = `import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { Html, Head, Main, NextScript } from "next/document"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function Document() {
        return (
          <Html lang="en">
            <Head />
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
        )
      }
      "
    `)
  })

  it("skips a root font that is imported but has no matching declaration", async () => {
    const input = `import { Inter } from "next/font/google"
import "./globals.css"

let fontClassName: string
const fallback = Inter()
const theme = getTheme()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the font is skipped because Inter is already imported.
    expect(result).toBe(input)
  })

  it("leaves an empty className expression on <html> untouched", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    // Current behavior: the invalid empty expression is tolerated and kept.
    expect(result).toMatchInlineSnapshot(`
      "import "./globals.css"
      import { Inter } from "next/font/google";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("skips Google fonts without an import name", async () => {
    const input = `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const { import: _import, ...fontWithoutImport } = interSans.font
    const result = await transformLayoutFonts(
      input,
      [{ ...interSans, font: fontWithoutImport } as any],
      mockConfig
    )

    expect(result).toBe(input)
  })

  it("is idempotent for a layout with a multi-line <html> and existing imports", async () => {
    const input = `import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
`
    const fonts = [interSans, playfairHeading]
    const firstRun = await transformLayoutFonts(input, fonts, mockConfig)
    const secondRun = await transformLayoutFonts(firstRun, fonts, mockConfig)

    expect(firstRun).toMatchInlineSnapshot(`
      "import type { Metadata } from "next"
      import "./globals.css"
      import { Inter, Playfair_Display } from "next/font/google";
      import { cn } from "@/lib/utils";

      const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      export const metadata: Metadata = {
        title: "My App",
      }

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html
            lang="en"
            suppressHydrationWarning className={cn("font-sans", inter.variable, playfairDisplayHeading.variable)}
          >
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
    expect(secondRun).toBe(firstRun)
  })

  it("updates a declaration that calls the font optionally", async () => {
    const input = `import { Inter } from "next/font/google"

const sans = Inter?.({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({ children }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("reads a string import name as the imported name, like ts-morph", async () => {
    const input = `import { "Inter" as Sans } from "next/font/google"

const inter = Sans({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { "Inter" as Sans } from "next/font/google"
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({ children }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("parses accessor class fields", async () => {
    const input = `class Store {
  accessor theme = "dark"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
    const result = await transformLayoutFonts(input, [interSans], mockConfig)

    expect(result).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";
      import { cn } from "@/lib/utils";

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      class Store {
        accessor theme = "dark"
      }

      export default function RootLayout({ children }) {
        return (
          <html lang="en" className={cn("font-sans", inter.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  // cn() holds only the heading font, so adding the body font leaves
  // `cn(, ...)`. TypeScript skips the empty argument's comma, unless a list
  // around the call takes it, and then ts-morph rejects the edit.
  function withOnlyTheHeadingFontInCn(page: string) {
    return `import { Playfair_Display } from "next/font/google"
import { cn } from "@/lib/utils"

const playfairDisplayHeading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })

${page}`
  }

  it("writes `cn(, ...)` like ts-morph where TypeScript skips the empty argument", async () => {
    const input =
      withOnlyTheHeadingFontInCn(`const RootLayout = ({ children }) => (
  <html lang="en" className={cn(playfairDisplayHeading.variable)}>
    <body>{children}</body>
  </html>
)
`)
    const result = await transformLayoutFonts(
      input,
      [interSans, playfairHeading],
      mockConfig
    )

    expect(result).toContain(
      `className={cn(, "font-sans", inter.variable, playfairDisplayHeading.variable)}`
    )
  })
})

const VITE_PROJECT_INFO = {
  framework: { name: "vite" },
  isTsx: true,
  isSrcDir: false,
}

const LAYOUT = `import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`

async function writeProjectFile(cwd: string, file: string, content = "") {
  const filePath = path.join(cwd, file)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, "utf8")
}

describe("findLayoutFile", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-find-layout-"))
  })

  afterEach(async () => {
    await fs.rm(cwd, { recursive: true, force: true })
  })

  async function find(files: string[], info: Partial<ProjectInfo>) {
    for (const file of files) {
      await writeProjectFile(cwd, file)
    }
    const result = await findLayoutFile(
      { resolvedPaths: { cwd } } as any,
      info as ProjectInfo
    )
    return result === null ? null : path.relative(cwd, result)
  }

  it.each([
    {
      name: "app/layout.tsx",
      files: ["app/layout.tsx"],
      info: { isSrcDir: false, isTsx: true },
      expected: "app/layout.tsx",
    },
    {
      name: "src/app/layout.tsx",
      files: ["src/app/layout.tsx"],
      info: { isSrcDir: true, isTsx: true },
      expected: "src/app/layout.tsx",
    },
    {
      name: "src/app over app when both exist",
      files: ["app/layout.tsx", "src/app/layout.tsx"],
      info: { isSrcDir: true, isTsx: true },
      expected: "src/app/layout.tsx",
    },
    {
      name: "app/layout.tsx fallback in a src dir project",
      files: ["app/layout.tsx", "src/components/button.tsx"],
      info: { isSrcDir: true, isTsx: true },
      expected: "app/layout.tsx",
    },
    {
      name: "app/layout.jsx in a JavaScript project",
      files: ["app/layout.jsx"],
      info: { isSrcDir: false, isTsx: false },
      expected: "app/layout.jsx",
    },
    {
      name: "src/app/layout.jsx in a JavaScript src dir project",
      files: ["src/app/layout.jsx"],
      info: { isSrcDir: true, isTsx: false },
      expected: "src/app/layout.jsx",
    },
  ])("finds $name", async ({ files, info, expected }) => {
    expect(await find(files, info)).toBe(expected)
  })

  it.each([
    {
      name: "src/app/layout.tsx when the project is not a src dir project",
      files: ["src/app/layout.tsx"],
      info: { isSrcDir: false, isTsx: true },
    },
    {
      name: "a .tsx layout in a JavaScript project",
      files: ["app/layout.tsx"],
      info: { isSrcDir: false, isTsx: false },
    },
    {
      name: "a .jsx layout in a TypeScript project",
      files: ["app/layout.jsx"],
      info: { isSrcDir: false, isTsx: true },
    },
    {
      // Current behavior: only .tsx and .jsx are considered, not layout.js.
      name: "app/layout.js",
      files: ["app/layout.js"],
      info: { isSrcDir: false, isTsx: false },
    },
    {
      name: "a pages router project",
      files: ["pages/_app.tsx", "pages/_document.tsx"],
      info: { isSrcDir: false, isTsx: true },
    },
    {
      name: "an empty project",
      files: [],
      info: { isSrcDir: false, isTsx: true },
    },
  ])("does not find $name", async ({ files, info }) => {
    expect(await find(files, info)).toBe(null)
  })
})

describe("updateFonts", () => {
  let cwd: string
  let warn: MockInstance<typeof logger.warn>

  function configFor(dir: string) {
    return {
      ...mockConfig,
      resolvedPaths: { ...mockConfig.resolvedPaths, cwd: dir },
    }
  }

  // Next.js project files detected by the real getProjectInfo.
  async function writeNextProject({ typescript }: { typescript: boolean }) {
    await writeProjectFile(
      cwd,
      "package.json",
      JSON.stringify({ name: "app", dependencies: { next: "15.0.0" } })
    )
    await writeProjectFile(cwd, "next.config.mjs", "export default {}\n")
    if (typescript) {
      await writeProjectFile(
        cwd,
        "tsconfig.json",
        JSON.stringify({ compilerOptions: {} })
      )
    }
  }

  function lastSpinner() {
    return vi.mocked(spinner).mock.results.at(-1)?.value
  }

  beforeEach(async () => {
    cwd = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-update-fonts-"))
    const actual = await vi.importActual<
      typeof import("@/src/utils/get-project-info")
    >("@/src/utils/get-project-info")
    vi.mocked(getProjectInfo).mockReset()
    vi.mocked(getProjectInfo).mockImplementation(actual.getProjectInfo)
    vi.mocked(spinner).mockClear()
    warn = vi.spyOn(logger, "warn").mockImplementation(() => {})
  })

  afterEach(async () => {
    vi.mocked(getProjectInfo).mockReset()
    vi.mocked(getProjectInfo).mockResolvedValue(VITE_PROJECT_INFO as any)
    warn.mockRestore()
    await fs.rm(cwd, { recursive: true, force: true })
  })

  it("updates app/layout.tsx in a Next.js app router project", async () => {
    await writeNextProject({ typescript: true })
    await writeProjectFile(cwd, "app/layout.tsx", LAYOUT)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8"))
      .toMatchInlineSnapshot(`
        "import type { Metadata } from "next"
        import "./globals.css"
        import { Inter } from "next/font/google";
        import { cn } from "@/lib/utils";

        const inter = Inter({subsets:['latin'],variable:'--font-sans'});

        export const metadata: Metadata = {
          title: "My App",
        }

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <html lang="en" className={cn("font-sans", inter.variable)}>
              <body>{children}</body>
            </html>
          )
        }
        "
      `)
    expect(spinner).toHaveBeenCalledWith("Updating fonts.", { silent: true })
    expect(lastSpinner().succeed).toHaveBeenCalledWith("Updating fonts.")
    expect(lastSpinner().fail).not.toHaveBeenCalled()
  })

  it("updates src/app/layout.tsx in a src dir project", async () => {
    await writeNextProject({ typescript: true })
    await writeProjectFile(cwd, "src/app/layout.tsx", LAYOUT)

    await updateFonts([playfairHeading], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "src/app/layout.tsx"), "utf8"))
      .toMatchInlineSnapshot(`
        "import type { Metadata } from "next"
        import "./globals.css"
        import { Playfair_Display } from "next/font/google";
        import { cn } from "@/lib/utils";

        const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

        export const metadata: Metadata = {
          title: "My App",
        }

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <html lang="en" className={cn(playfairDisplayHeading.variable)}>
              <body>{children}</body>
            </html>
          )
        }
        "
      `)
  })

  it("updates a root app/layout.tsx when a src dir exists without src/app", async () => {
    await writeNextProject({ typescript: true })
    await writeProjectFile(cwd, "src/components/button.tsx", "")
    await writeProjectFile(cwd, "app/layout.tsx", LAYOUT)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    // getProjectInfo reports next-pages here, but the root layout is still found.
    const projectInfo = await vi.mocked(getProjectInfo).mock.results[0].value
    expect(projectInfo).toMatchObject({
      framework: { name: "next-pages" },
      isSrcDir: true,
    })
    const written = await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")
    expect(written).not.toBe(LAYOUT)
    expect(written).toBe(
      await transformLayoutFonts(LAYOUT, [interSans], configFor(cwd))
    )
  })

  it("updates app/layout.jsx in a JavaScript project", async () => {
    await writeNextProject({ typescript: false })
    const layout = `import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
`
    await writeProjectFile(cwd, "app/layout.jsx", layout)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "app/layout.jsx"), "utf8"))
      .toMatchInlineSnapshot(`
        "import "./globals.css"
        import { Inter } from "next/font/google";
        import { cn } from "@/lib/utils";

        const inter = Inter({subsets:['latin'],variable:'--font-sans'});


        export default function RootLayout({ children }) {
          return (
            <html lang="en" className={cn("font-sans", inter.variable)}>
              <body className="antialiased">{children}</body>
            </html>
          )
        }
        "
      `)
  })

  it("leaves a pages router project untouched but still reports success", async () => {
    await writeNextProject({ typescript: true })
    const app = `import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
`
    await writeProjectFile(cwd, "pages/_app.tsx", app)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "pages/_app.tsx"), "utf8")).toBe(
      app
    )
    expect(spinner).toHaveBeenCalledTimes(1)
    expect(lastSpinner().succeed).toHaveBeenCalledWith("Updating fonts.")
  })

  it("does not rewrite a layout that already has the font", async () => {
    await writeNextProject({ typescript: true })
    const layout = await transformLayoutFonts(LAYOUT, [interSans], mockConfig)
    await writeProjectFile(cwd, "app/layout.tsx", layout)
    const layoutPath = path.join(cwd, "app/layout.tsx")
    const past = new Date("2020-01-01T00:00:00Z")
    await fs.utimes(layoutPath, past, past)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(layoutPath, "utf8")).toBe(layout)
    expect((await fs.stat(layoutPath)).mtime.getTime()).toBe(past.getTime())
  })

  // cn() holds only the heading font, which the edit removes before adding
  // both fonts back, leaving `cn(, ...)`.
  async function writeLayoutWithOnlyTheHeadingFontInCn(base = LAYOUT) {
    const layout = await transformLayoutFonts(
      base,
      [playfairHeading],
      mockConfig
    )
    await writeProjectFile(cwd, "app/layout.tsx", layout)
    return layout
  }

  it("leaves a layout the edit would break untouched and warns", async () => {
    await writeNextProject({ typescript: true })
    const layout = await writeLayoutWithOnlyTheHeadingFontInCn()

    await updateFonts([interSans, playfairHeading], configFor(cwd), {
      silent: false,
    })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      "Skipped app/layout.tsx: adding font-inter, font-playfair-display would leave it with a syntax error. Add the fonts to it manually."
    )
    expect(lastSpinner().stop).toHaveBeenCalledOnce()
    expect(lastSpinner().succeed).not.toHaveBeenCalled()
  })

  it("returns the warning instead of printing it when silent", async () => {
    await writeNextProject({ typescript: true })
    const layout = await writeLayoutWithOnlyTheHeadingFontInCn()

    const warning = await updateFonts(
      [interSans, playfairHeading],
      configFor(cwd),
      { silent: true }
    )

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(warning).toBe(
      "Skipped app/layout.tsx: adding font-inter, font-playfair-display would leave it with a syntax error. Add the fonts to it manually."
    )
    expect(warn).not.toHaveBeenCalled()
  })

  it("leaves a layout untouched and warns when ts-morph would reject the edit", async () => {
    await writeNextProject({ typescript: true })
    // Inside JSX children, ts-morph rejects the `cn(, ...)` it writes above.
    const layout = await writeLayoutWithOnlyTheHeadingFontInCn(
      LAYOUT.replace(
        /    <html[\s\S]*<\/html>\n/,
        (html) => `    <>\n${html}    </>\n`
      )
    )

    await updateFonts([interSans, playfairHeading], configFor(cwd), {
      silent: false,
    })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      "Skipped app/layout.tsx: adding font-inter, font-playfair-display would leave it with a syntax error. Add the fonts to it manually."
    )
    expect(lastSpinner().stop).toHaveBeenCalledOnce()
    expect(lastSpinner().succeed).not.toHaveBeenCalled()
  })

  it("leaves a layout untouched and warns when ts-morph would reject the import", async () => {
    await writeNextProject({ typescript: true })
    // The new name would land in the comment after the trailing comma.
    const layout = `import {\n  Roboto, // body\n} from "next/font/google"\n${LAYOUT}`
    await writeProjectFile(cwd, "app/layout.tsx", layout)

    await updateFonts([interSans], configFor(cwd), { silent: false })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      "Skipped app/layout.tsx: adding font-inter would leave it with a syntax error. Add the fonts to it manually."
    )
    expect(lastSpinner().stop).toHaveBeenCalledOnce()
    expect(lastSpinner().succeed).not.toHaveBeenCalled()
  })

  it("leaves a layout Babel cannot parse untouched and warns", async () => {
    await writeNextProject({ typescript: true })
    const layout = LAYOUT.replace(/\}\n$/, "")
    await writeProjectFile(cwd, "app/layout.tsx", layout)

    await updateFonts([interSans], configFor(cwd), { silent: false })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      "Skipped app/layout.tsx: could not parse it to add font-inter. Add the fonts to it manually."
    )
    expect(lastSpinner().stop).toHaveBeenCalledOnce()
    expect(lastSpinner().succeed).not.toHaveBeenCalled()
  })

  it("fails the spinner and rethrows when the font import cannot be added", async () => {
    await writeNextProject({ typescript: true })
    const layout = `import * as fonts from "next/font/google"\n${LAYOUT}`
    await writeProjectFile(cwd, "app/layout.tsx", layout)

    await expect(
      updateFonts([interSans], configFor(cwd), { silent: true })
    ).rejects.toThrow(
      "Cannot add a named import to an import declaration that has a namespace import."
    )
    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      layout
    )
    expect(lastSpinner().fail).toHaveBeenCalledWith("Failed to update fonts.")
  })

  it("updates a layout that already had a parse error", async () => {
    await writeNextProject({ typescript: true })
    const layout = `${LAYOUT}\nconst missingInitializer\n`
    await writeProjectFile(cwd, "app/layout.tsx", layout)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      await transformLayoutFonts(layout, [interSans], mockConfig)
    )
  })

  it("skips projects that are not Next.js", async () => {
    await writeProjectFile(
      cwd,
      "package.json",
      JSON.stringify({ name: "app", dependencies: { vite: "6.0.0" } })
    )
    await writeProjectFile(cwd, "vite.config.ts", "export default {}\n")
    await writeProjectFile(cwd, "app/layout.tsx", LAYOUT)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      LAYOUT
    )
    expect(spinner).not.toHaveBeenCalled()
  })

  it("returns early without fonts", async () => {
    await updateFonts(undefined, configFor(cwd), { silent: true })
    await updateFonts([], configFor(cwd), { silent: true })

    expect(getProjectInfo).not.toHaveBeenCalled()
    expect(spinner).not.toHaveBeenCalled()
  })

  it("returns early when project info is unavailable", async () => {
    vi.mocked(getProjectInfo).mockResolvedValueOnce(null)
    await writeProjectFile(cwd, "app/layout.tsx", LAYOUT)

    await updateFonts([interSans], configFor(cwd), { silent: true })

    expect(await fs.readFile(path.join(cwd, "app/layout.tsx"), "utf8")).toBe(
      LAYOUT
    )
    expect(spinner).not.toHaveBeenCalled()
  })

  it("fails the spinner and rethrows when the layout cannot be read", async () => {
    await writeNextProject({ typescript: true })
    // A directory named layout.tsx exists but cannot be read as a file.
    await fs.mkdir(path.join(cwd, "app/layout.tsx"), { recursive: true })

    await expect(
      updateFonts([interSans], configFor(cwd), { silent: true })
    ).rejects.toThrow(/EISDIR/)
    expect(lastSpinner().fail).toHaveBeenCalledWith("Failed to update fonts.")
    expect(lastSpinner().succeed).not.toHaveBeenCalled()
  })
})

describe("massageTreeForFonts (project info)", () => {
  beforeEach(() => {
    vi.mocked(getProjectInfo).mockClear()
  })

  afterEach(() => {
    vi.mocked(getProjectInfo).mockReset()
    vi.mocked(getProjectInfo).mockResolvedValue(VITE_PROJECT_INFO as any)
  })

  it("returns the tree unchanged without fonts", async () => {
    const tree = { fonts: [], css: {} } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result).toBe(tree)
    expect(result).toEqual({ fonts: [], css: {} })
    expect(getProjectInfo).not.toHaveBeenCalled()
  })

  it("returns the tree unchanged when project info is unavailable", async () => {
    vi.mocked(getProjectInfo).mockResolvedValueOnce(null)
    const tree = { fonts: [interSans] } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result).toBe(tree)
    expect(result).toEqual({ fonts: [interSans] })
  })

  it("points the theme variable at itself for Next.js projects", async () => {
    vi.mocked(getProjectInfo).mockResolvedValueOnce({
      framework: { name: "next-app" },
      isTsx: true,
      isSrcDir: false,
    } as any)
    const tree = { fonts: [interSans, playfairHeading] } as any

    const result = await massageTreeForFonts(tree, {
      resolvedPaths: { cwd: "/test" },
    } as any)

    expect(result).toEqual({
      fonts: [interSans, playfairHeading],
      cssVars: {
        theme: {
          "--font-sans": "var(--font-sans)",
          "--font-heading": "var(--font-heading)",
        },
      },
      css: {
        "@layer base": {
          html: { "@apply font-sans": {} },
          "h1, h2, h3, h4, h5, h6": { "@apply font-heading": {} },
        },
      },
    })
  })
})
