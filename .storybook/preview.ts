import type { Preview } from "@storybook/react"
import '../apps/www/styles/globals.css';  

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
