import path from "path"
import { build } from "esbuild"
import { expect, it } from "vitest"

import * as registry from "./index"

// The whole API, addRegistryItems and the transformers it runs included, must
// bundle without ts-morph, or the TypeScript copy that comes with it (about
// 6 MB).
it("bundles the API without ts-morph or typescript", async () => {
  const result = await build({
    stdin: {
      contents: `export { ${Object.keys(registry).join(", ")} } from "./index"`,
      resolveDir: __dirname,
      loader: "ts",
    },
    bundle: true,
    platform: "node",
    format: "esm",
    outfile: "out.mjs",
    write: false,
    metafile: true,
    logLevel: "silent",
  })

  const bundled = Object.entries(result.metafile.outputs["out.mjs"].inputs)
    .filter(([, input]) => input.bytesInOutput > 0)
    .map(([file]) => path.relative(process.cwd(), file))

  expect(
    bundled.filter((file) =>
      /node_modules\/(ts-morph|@ts-morph|typescript)\//.test(file)
    )
  ).toEqual([])
})
