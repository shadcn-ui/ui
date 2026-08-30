import type { MetadataRoute } from "next"

import { registryCategories } from "@/lib/categories"
import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"

const chartTypes = ["area", "bar", "line", "pie", "radar", "radial", "tooltip"]

const staticRoutes = [
  "/",
  "/blocks",
  "/colors",
  "/create",
  "/examples/authentication",
  "/examples/dashboard",
  "/examples/playground",
  "/examples/rtl",
  "/examples/tasks",
  "/sera",
  "/typeset",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [
    ...staticRoutes,
    ...source.getPages().map((page) => page.url),
    ...registryCategories.map((category) => `/blocks/${category.slug}`),
    ...chartTypes.map((type) => `/charts/${type}`),
  ]

  return [...new Set(urls)].map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
  }))
}
