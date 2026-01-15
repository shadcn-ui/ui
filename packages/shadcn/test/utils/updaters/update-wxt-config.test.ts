import { describe, expect, test } from "vitest"

import { transformWxtConfig } from "../../../src/utils/updaters/update-wxt-config"

describe("transformWxtConfig", () => {
  test("should add tailwindcss import and vite config when not present", async () => {
    const input = `import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(output).toContain("plugins: [tailwindcss()]")
  })

  test("should not add duplicate import if already exists", async () => {
    const input = `import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
`
    const output = await transformWxtConfig(input)

    // Should only have one import
    const importCount = (output.match(/import tailwindcss from "@tailwindcss\/vite"/g) || []).length
    expect(importCount).toBe(1)
  })

  test("should add plugin to existing vite config with arrow function", async () => {
    const input = `import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [],
  }),
});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(output).toContain("tailwindcss()")
  })

  test("should add plugin to existing vite config with plugins array", async () => {
    const input = `import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [react()],
  }),
});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(output).toContain("react()")
    expect(output).toContain("tailwindcss()")
  })

  test("should not add duplicate plugin if already exists", async () => {
    const input = `import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
`
    const output = await transformWxtConfig(input)

    // Should only have one tailwindcss() call
    const pluginCount = (output.match(/tailwindcss\(\)/g) || []).length
    expect(pluginCount).toBe(1)
  })

  test("should handle vite config as object literal", async () => {
    const input = `import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: {
    plugins: [],
  },
});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(output).toContain("tailwindcss()")
  })

  test("should handle empty defineConfig", async () => {
    const input = `import { defineConfig } from 'wxt';

export default defineConfig({});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(output).toContain("vite:")
    expect(output).toContain("plugins: [tailwindcss()]")
  })

  test("should preserve other config options", async () => {
    const input = `import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
  },
});
`
    const output = await transformWxtConfig(input)

    expect(output).toContain("srcDir: 'src'")
    expect(output).toContain("modules: ['@wxt-dev/module-react']")
    expect(output).toContain("permissions: ['storage']")
    expect(output).toContain("plugins: [tailwindcss()]")
  })
})
