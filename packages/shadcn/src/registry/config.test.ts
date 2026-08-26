import { BUILTIN_REGISTRIES, FALLBACK_STYLE } from "@/src/registry/constants"
import { createConfig } from "@/src/utils/get-config"
import { describe, expect, it } from "vitest"

import { configWithDefaults } from "./config"

describe("configWithDefaults", () => {
  it("should merge built-in registries with user registries", () => {
    const userConfig = createConfig({
      registries: {
        "@custom": "http://example.com/{name}",
      },
    })

    const result = configWithDefaults(userConfig)

    expect(result.registries).toEqual({
      ...BUILTIN_REGISTRIES,
      "@custom": "http://example.com/{name}",
    })
  })

  it("should preserve user registries when merging", () => {
    const userConfig = createConfig({
      registries: {
        "@one": "http://one.com/{name}",
        "@two": {
          url: "http://two.com/{name}",
          headers: {
            Authorization: "Bearer token",
          },
        },
      },
    })

    const result = configWithDefaults(userConfig)

    expect(result.registries?.["@one"]).toBe("http://one.com/{name}")
    expect(result.registries?.["@two"]).toEqual({
      url: "http://two.com/{name}",
      headers: {
        Authorization: "Bearer token",
      },
    })
    expect(result.registries?.["@shadcn"]).toBe(BUILTIN_REGISTRIES["@shadcn"])
  })

  it("should use FALLBACK_STYLE when style is new-york and tailwind.config is empty", () => {
    const config = createConfig({
      style: "new-york",
      tailwind: {
        config: "",
        css: "app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
    })

    const result = configWithDefaults(config)

    expect(result.style).toBe(FALLBACK_STYLE)
  })

  it("should keep new-york style when tailwind.config is not empty", () => {
    const config = createConfig({
      style: "new-york",
      tailwind: {
        config: "tailwind.config.js",
        css: "app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
    })

    const result = configWithDefaults(config)

    expect(result.style).toBe("new-york")
  })

  it("should preserve non-new-york styles regardless of tailwind config", () => {
    const config1 = createConfig({
      style: "default",
      tailwind: {
        config: "",
        css: "app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
    })

    const result1 = configWithDefaults(config1)
    expect(result1.style).toBe("default")

    const config2 = createConfig({
      style: "miami",
      tailwind: {
        config: "tailwind.config.js",
        css: "app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
    })

    const result2 = configWithDefaults(config2)
    expect(result2.style).toBe("miami")
  })

  it("should use FALLBACK_STYLE when no style is provided", () => {
    const config = createConfig({
      style: undefined,
    })

    const result = configWithDefaults(config)

    expect(result.style).toBe(FALLBACK_STYLE)
  })

  it("should deeply merge nested config properties", () => {
    const config = createConfig({
      tailwind: {
        css: "custom/path/globals.css",
        prefix: "tw-",
        baseColor: "zinc",
        cssVariables: false,
      },
      aliases: {
        components: "@/custom-components",
        utils: "@/custom-utils",
      },
    })

    const result = configWithDefaults(config)

    expect(result.tailwind.css).toBe("custom/path/globals.css")
    expect(result.tailwind.prefix).toBe("tw-")
    expect(result.tailwind.baseColor).toBe("zinc")
    expect(result.tailwind.cssVariables).toBe(false)
    expect(result.aliases.components).toBe("@/custom-components")
    expect(result.aliases.utils).toBe("@/custom-utils")
  })

  it("should preserve all user config properties", () => {
    const config = createConfig({
      style: "default",
      tsx: false,
      rsc: false,
      tailwind: {
        config: "custom.config.js",
        css: "styles/main.css",
        baseColor: "gray",
        cssVariables: true,
        prefix: "app-",
      },
      resolvedPaths: {
        cwd: "/custom/project",
        tailwindConfig: "/custom/project/tailwind.config.js",
        tailwindCss: "/custom/project/styles/main.css",
        utils: "/custom/project/lib/utils",
        components: "/custom/project/components",
        ui: "/custom/project/components/ui",
        lib: "/custom/project/lib",
        hooks: "/custom/project/hooks",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    })

    const result = configWithDefaults(config)

    expect(result.tsx).toBe(false)
    expect(result.rsc).toBe(false)
    expect(result.tailwind.config).toBe("custom.config.js")
    expect(result.tailwind.css).toBe("styles/main.css")
    expect(result.tailwind.baseColor).toBe("gray")
    expect(result.tailwind.prefix).toBe("app-")
    expect(result.resolvedPaths.cwd).toBe("/custom/project")
    expect(result.resolvedPaths.components).toBe("/custom/project/components")
  })

  it("should handle empty registries object", () => {
    const config = createConfig({
      registries: {},
    })

    const result = configWithDefaults(config)

    expect(result.registries).toEqual(BUILTIN_REGISTRIES)
  })

  it("should override built-in registries if user provides same key", () => {
    const config = createConfig({
      registries: {
        "@shadcn": "http://custom-shadcn.com/{name}",
      },
    })

    const result = configWithDefaults(config)

    // User's @shadcn should override the built-in one
    expect(result.registries?.["@shadcn"]).toBe(
      "http://custom-shadcn.com/{name}"
    )
  })

  it("should validate the final config with configSchema", () => {
    const config = createConfig({
      style: "default",
      registries: {
        "@test": "http://test.com/{name}",
      },
    })

    // This should not throw since configSchema.parse is called internally
    expect(() => configWithDefaults(config)).not.toThrow()
  })
})
