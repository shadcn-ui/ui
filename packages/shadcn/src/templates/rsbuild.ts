import dedent from "dedent"

import { createTemplate } from "./create-template"

export const rsbuild = createTemplate({
  name: "rsbuild",
  title: "Rsbuild",
  defaultProjectName: "rsbuild-app",
  templateDir: "rsbuild-app",
  frameworks: ["rsbuild"],
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
})
