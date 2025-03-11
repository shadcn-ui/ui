import { exec } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { rimraf } from "rimraf"
import { registryItemSchema, type Registry } from "shadcn/registry"
import { z } from "zod"

import { blocks } from "@/www/registry/registry-blocks"
import { charts } from "@/www/registry/registry-charts"
import { lib } from "@/www/registry/registry-lib"
import { ui } from "@/www/registry/registry-ui"

const DEPRECATED_ITEMS = ["toast"]

const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse(
    [
      {
        name: "index",
        type: "registry:style",
        dependencies: [
          "tailwindcss-animate",
          "class-variance-authority",
          "lucide-react",
        ],
        registryDependencies: ["utils"],
        tailwind: {
          config: {
            plugins: [`require("tailwindcss-animate")`],
          },
        },
        cssVars: {},
        files: [],
      },
      ...ui,
      ...blocks,
      ...charts,
      ...lib,
      {
        name: "use-mobile",
        type: "registry:hook",
        files: [
          {
            path: "hooks/use-mobile.ts",
            type: "registry:hook",
          },
        ],
      },
      {
        name: "products-01",
        description: "A table of products",
        type: "registry:block",
        registryDependencies: [
          "checkbox",
          "badge",
          "button",
          "dropdown-menu",
          "pagination",
          "table",
          "tabs",
          "select",
        ],
        files: [
          {
            path: "blocks/products-01/page.tsx",
            type: "registry:page",
            target: "app/products/page.tsx",
          },
          {
            path: "blocks/products-01/components/products-table.tsx",
            type: "registry:component",
          },
        ],
      },
    ].filter((item) => {
      return !DEPRECATED_ITEMS.includes(item.name)
    })
  ),
} satisfies Registry

async function buildRegistryIndex() {
  let index = `/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import * as React from "react"

export const Index: Record<string, any> = {`
  for (const item of registry.items) {
    const resolveFiles = item.files?.map(
      (file) => `registry/new-york-v4/${file.path}`
    )
    if (!resolveFiles) {
      continue
    }

    const componentPath = item.files?.[0]?.path
      ? `@/registry/new-york-v4/${item.files[0].path}`
      : ""

    index += `
  "${item.name}": {
    name: "${item.name}",
    description: "${item.description ?? ""}",
    type: "${item.type}",
    registryDependencies: ${JSON.stringify(item.registryDependencies)},
    files: [${item.files?.map((file) => {
      const filePath = `registry/${typeof file === "string" ? file : file.path}`
      const resolvedFilePath = path.resolve(filePath)
      return typeof file === "string"
        ? `"${resolvedFilePath}"`
        : `{
      path: "${filePath}",
      type: "${file.type}",
      target: "${file.target ?? ""}"
    }`
    })}],
    component: ${
      componentPath
        ? `React.lazy(async () => {
      const mod = await import("${componentPath}")
      const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || item.name
      return { default: mod.default || mod[exportName] }
    })`
        : "null"
    },
    meta: ${JSON.stringify(item.meta)},
  },`
  }

  index += `
  }`

  // Write style index.
  rimraf.sync(path.join(process.cwd(), "__registry__/index.tsx"))
  await fs.writeFile(path.join(process.cwd(), "__registry__/index.tsx"), index)
}

async function buildRegistryJsonFile() {
  // 1. Fix the path for registry items.
  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item) => {
      const files = item.files?.map((file) => {
        return {
          ...file,
          path: `registry/new-york-v4/${file.path}`,
        }
      })

      return {
        ...item,
        files,
      }
    }),
  }

  // 2. Write the content of the registry to `registry.json`
  rimraf.sync(path.join(process.cwd(), `registry.json`))
  await fs.writeFile(
    path.join(process.cwd(), `registry.json`),
    JSON.stringify(fixedRegistry, null, 2)
  )
}

async function buildRegistry() {
  return new Promise((resolve, reject) => {
    const process = exec(
      `pnpm dlx shadcn build registry.json --output ../www/public/r/styles/new-york-v4`
    )

    process.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

try {
  console.log("🗂️ Building registry/__index__.tsx...")
  await buildRegistryIndex()

  console.log("💅 Building registry.json...")
  await buildRegistryJsonFile()

  console.log("🏗️ Building registry...")
  await buildRegistry()
} catch (error) {
  console.error(error)
  process.exit(1)
}
