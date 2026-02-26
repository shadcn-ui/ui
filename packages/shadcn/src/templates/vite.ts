import path from "path"
import { iconLibraries, type IconLibraryName } from "@/src/icons/libraries"
import { configWithDefaults } from "@/src/registry/config"
import { resolveRegistryTree } from "@/src/registry/resolver"
import { rawConfigSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { resolveConfigPaths } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { updateCss } from "@/src/utils/updaters/update-css"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import dedent from "dedent"
import deepmerge from "deepmerge"
import fs from "fs-extra"

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
