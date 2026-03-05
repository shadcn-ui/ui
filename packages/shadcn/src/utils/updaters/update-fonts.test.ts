import { describe, expect, it, vi } from "vitest"

import { massageTreeForFonts, transformLayoutFonts } from "./update-fonts"

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
    expect(result).toContain("playfairDisplay.variable")
    // Only font-sans utility class should be on <html>, not font-heading.
    expect(result).toContain('"font-sans"')
    expect(result).not.toContain('"font-heading"')
  })
})

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectInfo: vi.fn().mockResolvedValue({
    framework: { name: "vite" },
    isTsx: true,
    isSrcDir: false,
  }),
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
})
