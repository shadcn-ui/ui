import type { Config } from 'tailwindcss'
import uiConfig from '../../packages/ui/tailwind.config'

const config: Config = {
  ...uiConfig,
  content: [
    './index.md',
    './guide/**/*.md',
    './components/**/*.md',
    './demos/**/*.vue',
    './.vitepress/theme/**/*.{vue,ts,css}',
    '../../packages/ui/src/**/*.{vue,ts}',
  ],
}

export default config
