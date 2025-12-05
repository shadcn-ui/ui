import { RegistryItem } from "shadcn/schema"

export const fonts = [
  {
    name: "font-inter",
    title: "Inter",
    type: "registry:font",
    font: {
      family: "Inter",
      provider: "google",
      variable: "--font-inter",
      subsets: ["latin"],
      import: "Inter",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-inter)",
      },
    },
  },
  {
    name: "font-geist-sans",
    title: "Geist Sans",
    type: "registry:font",
    font: {
      family: "Geist Sans",
      provider: "google",
      variable: "--font-geist-sans",
      subsets: ["latin"],
      import: "Geist",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-geist-sans)",
      },
    },
  },
  {
    name: "font-noto-sans",
    title: "Noto Sans",
    type: "registry:font",
    font: {
      family: "Noto Sans",
      provider: "google",
      variable: "--font-noto-sans",
      import: "Noto Sans",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-noto-sans)",
      },
    },
  },
  {
    name: "font-nunito-sans",
    title: "Nunito Sans",
    type: "registry:font",
    font: {
      family: "Nunito Sans",
      provider: "google",
      variable: "--font-nunito-sans",
      import: "Nunito_Sans",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-nunito-sans)",
      },
    },
  },
  {
    name: "font-figtree",
    title: "Figtree",
    type: "registry:font",
    font: {
      family: "Figtree",
      provider: "google",
      variable: "--font-figtree",
      subsets: ["latin"],
      import: "Figtree",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-figtree)",
      },
    },
  },
  {
    name: "font-jetbrains-mono",
    title: "JetBrains Mono",
    type: "registry:font",
    font: {
      family: "JetBrains Mono",
      provider: "google",
      variable: "--font-jetbrains-mono",
      subsets: ["latin"],
      import: "JetBrains_Mono",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-jetbrains-mono)",
      },
    },
  },
  {
    name: "font-geist-mono",
    title: "Geist Mono",
    type: "registry:font",
    font: {
      family: "Geist Mono",
      provider: "google",
      variable: "--font-geist-mono",
      subsets: ["latin"],
      import: "Geist_Mono",
    },
    cssVars: {
      theme: {
        "--font-sans": "var(--font-geist-mono)",
      },
    },
  },
] satisfies RegistryItem[]
