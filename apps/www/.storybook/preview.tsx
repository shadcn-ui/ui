import type { Preview } from "@storybook/react"
import { Inter } from "next/font/google"
import React from "react"

import { cn } from "../lib/utils"
import "../styles/globals.css"

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const decorators = [
  (Story) => (
    <div className={cn("font-sans", fontSans.variable)}>
      <Story />
    </div>
  ),
]

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
