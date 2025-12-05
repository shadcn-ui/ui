import { RegistryItem } from "shadcn/schema"

export const fonts = [
  {
    name: "font-inter",
    title: "Inter",
    type: "registry:font",
    font: {
      family: "Inter",
      provider: "google",
      variable: "--font-sans",
      subsets: ["latin"],
      import: "Inter",
    },
  },
  {
    name: "font-geist-sans",
    title: "Geist Sans",
    type: "registry:font",
    font: {
      family: "Geist Sans",
      provider: "google",
      variable: "--font-sans",
      subsets: ["latin"],
      import: "Geist",
    },
  },
  {
    name: "font-noto-sans",
    title: "Noto Sans",
    type: "registry:font",
    font: {
      family: "Noto Sans",
      provider: "google",
      variable: "--font-sans",
      import: "Noto_Sans",
    },
  },
  {
    name: "font-nunito-sans",
    title: "Nunito Sans",
    type: "registry:font",
    font: {
      family: "Nunito Sans",
      provider: "google",
      variable: "--font-sans",
      import: "Nunito_Sans",
    },
  },
  {
    name: "font-figtree",
    title: "Figtree",
    type: "registry:font",
    font: {
      family: "Figtree",
      provider: "google",
      variable: "--font-sans",
      subsets: ["latin"],
      import: "Figtree",
    },
  },
  {
    name: "font-jetbrains-mono",
    title: "JetBrains Mono",
    type: "registry:font",
    font: {
      family: "JetBrains Mono",
      provider: "google",
      variable: "--font-sans",
      subsets: ["latin"],
      import: "JetBrains_Mono",
    },
  },
  {
    name: "font-geist-mono",
    title: "Geist Mono",
    type: "registry:font",
    font: {
      family: "Geist Mono",
      provider: "google",
      variable: "--font-sans",
      subsets: ["latin"],
      import: "Geist_Mono",
    },
  },
] satisfies RegistryItem[]
