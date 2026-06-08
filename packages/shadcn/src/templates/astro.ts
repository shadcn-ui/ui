import dedent from "dedent"

import { createTemplate } from "./create-template"
import { fontsourceMonorepoInit } from "./monorepo"

export const astro = createTemplate({
  name: "astro",
  title: "Astro",
  defaultProjectName: "astro-app",
  templateDir: "astro-app",
  frameworks: ["astro"],
  create: async () => {
    // Empty for now.
  },
  files: [
    {
      type: "registry:page",
      path: "src/pages/index.astro",
      target: "src/pages/index.astro",
      content: dedent`---
import Layout from "@/layouts/main.astro"
import { ComponentExample } from "@/components/component-example"
---

<Layout>
  <ComponentExample client:load />
</Layout>
`,
    },
  ],
  monorepo: {
    templateDir: "astro-monorepo",
    init: fontsourceMonorepoInit,
    files: [
      {
        type: "registry:page",
        path: "src/pages/index.astro",
        target: "src/pages/index.astro",
        content: dedent`---
import "@workspace/ui/globals.css"
import { ComponentExample } from "@/components/component-example"
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro App</title>
  </head>
  <body>
    <ComponentExample client:load />
  </body>
</html>
`,
      },
    ],
  },
})
