import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

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
      external: ['vue', 'radix-vue', 'lucide-vue-next', 'class-variance-authority', '@saaze/utils'],
    },
  },
})
