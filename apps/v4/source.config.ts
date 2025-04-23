import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { rehypePrettyCode } from "rehype-pretty-code"
import type { ShikiTransformer } from "shiki"

const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source
        node.properties["__raw__"] = raw

        if (raw.startsWith("npm install")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm install", "yarn add")
          node.properties["__pnpm__"] = raw.replace("npm install", "pnpm add")
          node.properties["__bun__"] = raw.replace("npm install", "bun add")
        }

        if (raw.startsWith("npx create-")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace(
            "npx create-",
            "yarn create "
          )
          node.properties["__pnpm__"] = raw.replace(
            "npx create-",
            "pnpm create "
          )
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm create.
        if (raw.startsWith("npm create")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm create", "yarn create")
          node.properties["__pnpm__"] = raw.replace("npm create", "pnpm create")
          node.properties["__bun__"] = raw.replace("npm create", "bun create")
        }

        // npx.
        if (raw.startsWith("npx")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npx", "yarn")
          node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx")
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm run.
        if (raw.startsWith("npm run")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm run", "yarn")
          node.properties["__pnpm__"] = raw.replace("npm run", "pnpm")
          node.properties["__bun__"] = raw.replace("npm run", "bun")
        }
      }
    },
  },
] as ShikiTransformer[]

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift()
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          transformers,
        },
      ])

      return plugins
    },
  },
})

export const docs: ReturnType<typeof defineDocs> = defineDocs({
  dir: "docs",
})
