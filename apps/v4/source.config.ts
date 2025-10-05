import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config"
import rehypePrettyCode, {
  type Options as RehypePrettyCoeOptions,
} from "rehype-pretty-code"
import { z } from "zod"

import { transformers } from "@/lib/highlight-code"

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        } satisfies RehypePrettyCoeOptions,
      ],
    ],
  },
})

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      links: z
        .object({
          doc: z.string().optional(),
          api: z.string().optional(),
        })
        .optional(),
    }),
  },
})
