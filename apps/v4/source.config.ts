import { defineConfig, defineDocs } from "fumadocs-mdx/config"

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      theme: "github-dark",
    },
  },
})

export const docs: ReturnType<typeof defineDocs> = defineDocs({
  dir: "docs",
})
