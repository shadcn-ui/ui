import type { Preview } from "@storybook/react-vite"

import "@leadbank/ui/styles.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Foundations", "Components"],
      },
    },
  },
}

export default preview
