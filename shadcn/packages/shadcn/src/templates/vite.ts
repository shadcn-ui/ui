import dedent from "dedent"

import { createTemplate } from "./create-template"
import { fontsourceMonorepoInit } from "./monorepo"

export const vite = createTemplate({
  name: "vite",
  title: "Vite",
  defaultProjectName: "vite-app",
  templateDir: "vite-app",
  frameworks: ["vite"],
  create: async () => {
    // Empty for now.
  },
  files: [
    {
      type: "registry:file",
      path: "src/App.tsx",
      target: "src/App.tsx",
      content: dedent`import { ComponentExample } from "@/components/component-example";

export function App() {
  return <ComponentExample />;
}

export default App;
`,
    },
  ],
  monorepo: {
    templateDir: "vite-monorepo",
    packageManager: "pnpm",
    installArgs: ["--no-frozen-lockfile"],
    init: fontsourceMonorepoInit,
    files: [
      {
        type: "registry:file",
        path: "src/App.tsx",
        target: "src/App.tsx",
        content: dedent`import { ComponentExample } from "@/components/component-example";

export function App() {
  return <ComponentExample />;
}

export default App;
`,
      },
    ],
  },
})
