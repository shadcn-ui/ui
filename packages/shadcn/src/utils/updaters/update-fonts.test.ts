import { describe, expect, it } from "vitest"

import { transformLayoutFonts } from "./update-fonts"

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
          <html lang="en" className={inter.variable}>
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
          <html lang="en" className={cn(inter.variable, jetbrainsMono.variable)}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
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

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
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

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
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
          <html lang="en" className={inter.variable}>
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

      const inter = Inter({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
            <body>{children}</body>
          </html>
        )
      }
      "
    `)
  })

  it("should not duplicate existing font import", async () => {
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

    expect(result).toMatchInlineSnapshot(`
      "
      import { Inter } from "next/font/google"

      const inter = Inter({subsets:['latin'],variable:'--font-sans'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
            <body className={inter.variable}>{children}</body>
          </html>
        )
      }
      "
    `)
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

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});

      const roboto = Roboto({subsets:['latin'],variable:'--font-display'})

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
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

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
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

      const inter = Inter({subsets:['latin'],variable:'--font-sans'});


      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode
      }) {
        return (
          <html lang="en" className={inter.variable}>
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
})
