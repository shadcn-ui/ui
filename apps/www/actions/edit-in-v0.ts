"use server"

import { track } from "@vercel/analytics/server"
import { capitalCase } from "change-case"

import { getRegistryItem } from "@/lib/registry"
import { Style } from "@/registry/registry-styles"

const TAILWIND_CONFIG_BLOCKS = ["dashboard-01"]

export async function editInV0({
  name,
  style,
  url,
}: {
  name: string
  style?: Style["name"]
  url: string
}) {
  style = style ?? "new-york"
  try {
    const registryItem = await getRegistryItem(name, style)

    if (!registryItem) {
      return { error: "Something went wrong. Please try again later." }
    }

    await track("edit_in_v0", {
      name,
      title: registryItem.name,
      description: registryItem.description ?? registryItem.name,
      style,
      url,
    })

    // Remove v0 prefix from the name
    registryItem.name = registryItem.name.replace(/^v0-/, "")

    const projectName = capitalCase(name.replace(/\d+/g, ""))
    registryItem.description = registryItem.description || projectName

    // Replace `@/registry/new-york/` in files.
    registryItem.files = registryItem.files?.map((file) => {
      if (file.content?.includes("@/registry/new-york/ui")) {
        file.content = file.content?.replaceAll(
          "@/registry/new-york/ui",
          "@/components/ui"
        )
      }
      return file
    })

    if (TAILWIND_CONFIG_BLOCKS.includes(name)) {
      registryItem.files?.push({
        path: "tailwind.config.js",
        type: "registry:file",
        target: "tailwind.config.js",
        content: TAILWIND_CONFIG,
      })
    }

    const payload = {
      version: 2,
      payload: registryItem,
      source: {
        title: "shadcn/ui",
        url,
      },
      meta: {
        project: projectName,
        file: `${name}.tsx`,
      },
    }

    const response = await fetch(`${process.env.V0_URL}/chat/api/open-in-v0`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "x-v0-edit-secret": process.env.V0_EDIT_SECRET!,
        "x-vercel-protection-bypass":
          process.env.DEPLOYMENT_PROTECTION_BYPASS || "not-set",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Unauthorized")
      }

      console.error(response.statusText)

      throw new Error("Something went wrong. Please try again later.")
    }

    const result = await response.json()

    return {
      ...result,
      url: `${process.env.V0_URL}/chat/api/open-in-v0/${result.id}`,
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}

const TAILWIND_CONFIG = `const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
}`
