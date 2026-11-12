import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

const externalPackages = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
]

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      entryRoot: 'src',
      include: ['src'],
      exclude: ['src/**/*.test.ts'],
      insertTypesEntry: true,
      pathsToAliases: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'saaze-ui',
      cssFileName: 'style',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      // همه وابستگی‌ها (و زیرمسیرهایشان) بیرونی می‌مانند تا در بسته کتابخانه تکرار نشوند؛
      // فقط فایل‌های CSS باندل می‌شوند تا در dist/style.css قرار بگیرند.
      external: (id) =>
        !id.endsWith('.css') &&
        externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
    },
  },
})
