import { TransformerConfig } from "ts-morph-react"
import { expect, test } from "vitest"
import { transform } from "../../src/utils/transformers"
import { example } from "../fixtures/transform-react/example"

const sharedConfig = {
  tsx: true,
  rsc: true,
  style: "base-lyra",
  tailwind: { baseColor: "neutral", cssVariables: true },
  aliases: { components: "@/components", lib: "@/lib", utils: "@/lib/utils" }
}

const transformConfig = {
  enforceFormat: true,
  enforceEslint: true,
  enforcePrettier: true,
  eslint: {},
  format: {},
  prettier: {}
}

test("enforceNamedImports", async () => {
  expect(await transform({
    filename: "test.tsx",
    raw: example,
    config: {
      ...sharedConfig,
      transform: {
        enforceNamedImports: true,
        enforceDirectExports: false,
        enforceFunctionComponent: false,
        ...transformConfig
      } satisfies TransformerConfig
    }
  })).toMatchSnapshot()
})

test("enforceDirectExports", async () => {
  expect(await transform({
    filename: "test.tsx",
    raw: example,
    config: {
      ...sharedConfig,
      transform: {
        enforceNamedImports: false,
        enforceDirectExports: true,
        enforceFunctionComponent: false,
        ...transformConfig
      } satisfies TransformerConfig
    }
  })).toMatchSnapshot()
})

test("enforceFunctionComponent", async () => {
  expect(await transform({
    filename: "test.tsx",
    raw: example,
    config: {
      ...sharedConfig,
      transform: {
        enforceNamedImports: false,
        enforceDirectExports: false,
        enforceFunctionComponent: true,
        ...transformConfig
      } satisfies TransformerConfig
    }
  })).toMatchSnapshot()
})

test("combined", async () => {
  expect(await transform({
    filename: "test.tsx",
    raw: example,
    config: {
      ...sharedConfig,
      transform: {
        enforceNamedImports: true,
        enforceDirectExports: true,
        enforceFunctionComponent: true,
        ...transformConfig
      } satisfies TransformerConfig
    }
  })).toMatchSnapshot()
})
