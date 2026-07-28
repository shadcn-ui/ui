import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const appRoot = fileURLToPath(new URL("./", import.meta.url))
const createRoot = fileURLToPath(
  new URL("./app/(app)/(create)", import.meta.url)
)

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/app/(create)", replacement: createRoot },
      { find: "@/app/(app)/create", replacement: createRoot },
      { find: "@", replacement: appRoot },
    ],
  },
  test: {
    include: [
      "components/deferred-component-source.test.tsx",
      "registry/file-tree*.test.{ts,tsx}",
    ],
    exclude: ["registry/file-tree.browser.test.tsx"],
  },
})
