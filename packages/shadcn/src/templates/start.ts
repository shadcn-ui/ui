import dedent from "dedent"

import { createTemplate } from "./create-template"
import { fontsourceMonorepoInit } from "./monorepo"

export const start = createTemplate({
  name: "start",
  title: "TanStack Start",
  defaultProjectName: "start-app",
  templateDir: "start-app",
  frameworks: ["tanstack-start"],
  create: async () => {
    // Empty for now.
  },
  files: [
    {
      type: "registry:file",
      path: "src/routes/index.tsx",
      target: "src/routes/index.tsx",
      content: dedent`import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <ComponentExample />
  );
}
`,
    },
  ],
  monorepo: {
    templateDir: "start-monorepo",
    init: fontsourceMonorepoInit,
    files: [
      {
        type: "registry:file",
        path: "src/routes/index.tsx",
        target: "src/routes/index.tsx",
        content: dedent`import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <ComponentExample />
  );
}
`,
      },
    ],
  },
})
