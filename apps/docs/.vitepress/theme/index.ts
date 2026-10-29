import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoBlock from './DemoBlock.vue'
import '@/styles/index.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
