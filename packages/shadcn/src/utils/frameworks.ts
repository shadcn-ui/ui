import { SHADCN_URL } from "@/src/registry/constants"

export const FRAMEWORKS = {
  "next-app": {
    name: "next-app",
    label: "Next.js",
    links: {
      installation: `${SHADCN_URL}/docs/installation/next`,
      tailwind: "https://tailwindcss.com/docs/guides/nextjs",
    },
  },
  "next-pages": {
    name: "next-pages",
    label: "Next.js",
    links: {
      installation: `${SHADCN_URL}/docs/installation/next`,
      tailwind: "https://tailwindcss.com/docs/guides/nextjs",
    },
  },
  remix: {
    name: "remix",
    label: "Remix",
    links: {
      installation: `${SHADCN_URL}/docs/installation/remix`,
      tailwind: "https://tailwindcss.com/docs/guides/remix",
    },
  },
  "react-router": {
    name: "react-router",
    label: "React Router",
    links: {
      installation: `${SHADCN_URL}/docs/installation/react-router`,
      tailwind:
        "https://tailwindcss.com/docs/installation/framework-guides/react-router",
    },
  },
  vite: {
    name: "vite",
    label: "Vite",
    links: {
      installation: `${SHADCN_URL}/docs/installation/vite`,
      tailwind: "https://tailwindcss.com/docs/guides/vite",
    },
  },
  astro: {
    name: "astro",
    label: "Astro",
    links: {
      installation: `${SHADCN_URL}/docs/installation/astro`,
      tailwind: "https://tailwindcss.com/docs/guides/astro",
    },
  },
  laravel: {
    name: "laravel",
    label: "Laravel",
    links: {
      installation: `${SHADCN_URL}/docs/installation/laravel`,
      tailwind: "https://tailwindcss.com/docs/guides/laravel",
    },
  },
  "tanstack-start": {
    name: "tanstack-start",
    label: "TanStack Start",
    links: {
      installation: `${SHADCN_URL}/docs/installation/tanstack`,
      tailwind: "https://tailwindcss.com/docs/installation/using-postcss",
    },
  },
  gatsby: {
    name: "gatsby",
    label: "Gatsby",
    links: {
      installation: `${SHADCN_URL}/docs/installation/gatsby`,
      tailwind: "https://tailwindcss.com/docs/guides/gatsby",
    },
  },
  expo: {
    name: "expo",
    label: "Expo",
    links: {
      installation: `${SHADCN_URL}/docs/installation/expo`,
      tailwind: "https://www.nativewind.dev/docs/getting-started/installation",
    },
  },
  manual: {
    name: "manual",
    label: "Manual",
    links: {
      installation: `${SHADCN_URL}/docs/installation/manual`,
      tailwind: "https://tailwindcss.com/docs/installation",
    },
  },
} as const

export type Framework = (typeof FRAMEWORKS)[keyof typeof FRAMEWORKS]
