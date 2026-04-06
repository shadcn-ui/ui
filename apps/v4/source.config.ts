import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
import { z } from "zod";

import { transformers } from "@/lib/highlight-code";

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();

      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);

      return plugins;
    },
  },
})

const frontmatter = frontmatterSchema.extend({
  base: z.enum(["base", "radix"]).optional(),
  date: z.date().optional(),
  component: z.boolean().optional(),
  links: z
    .object({
      doc: z.string().optional(),
      api: z.string().optional(),
    })
    .optional(),
})

export type Frontmatter = z.infer<typeof frontmatter>

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatter,
  },
})
