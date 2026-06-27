/// <reference types="vite/client" />

declare module '*.svg?component' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
