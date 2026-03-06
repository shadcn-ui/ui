import dedent from "dedent"

import { createTemplate } from "./create-template"
import { fontsourceMonorepoInit } from "./monorepo"

export const reactRouter = createTemplate({
  name: "react-router",
  title: "React Router",
  defaultProjectName: "react-router-app",
  templateDir: "react-router-app",
  frameworks: ["react-router"],
  create: async () => {
    // Empty for now.
  },
  files: [
    {
      type: "registry:file",
      path: "app/routes/home.tsx",
      target: "app/routes/home.tsx",
      content: dedent`import { ComponentExample } from "@/components/component-example";

export default function Home() {
  return <ComponentExample />;
}
`,
    },
  ],
  monorepo: {
    templateDir: "react-router-monorepo",
    packageManager: "pnpm",
    installArgs: ["--no-frozen-lockfile"],
    init: fontsourceMonorepoInit,
    files: [
      {
        type: "registry:file",
        path: "app/routes/home.tsx",
        target: "app/routes/home.tsx",
        content: dedent`import { ComponentExample } from "@/components/component-example";

export default function Home() {
  return <ComponentExample />;
}
`,
      },
    ],
  },
})
