import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import resolveConfig from "tailwindcss/resolveConfig"

import tailwindConfig from "../../tailwind.config.cjs"

const fullConfig = resolveConfig(tailwindConfig)

const meta: Meta<{
  radius: {
    name: string
    value: string
  }[]
}> = {
  title: "design/Radius",
  argTypes: {},
  args: {
    radius: Object.keys(fullConfig.theme.borderRadius).map((name) => {
      const value =
        fullConfig.theme.borderRadius[
          name as keyof typeof fullConfig.theme.borderRadius
        ]
      return {
        name,
        value,
      }
    }),
  },
  render: (args) => (
    <table className="w-full table-auto text-left text-sm text-foreground rtl:text-right">
      <thead className="text-x bg-muted uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="hidden px-6 py-3 sm:table-cell">
            Size
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Preview</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {args.radius.map(({ name, value }) => {
          const style = window.getComputedStyle(document.body)
          const variable = value.match(/var\(([^)]+)\)/)?.[1] ?? ""
          const resolved = style.getPropertyValue(variable)
          const resolvedValue = value.replace(/var\(--(.*?)\)/, resolved)
          return (
            <tr key={name} className="border-b bg-card">
              <td className="px-6 py-4">{name}</td>
              <td className="hidden px-6 py-4 sm:table-cell">
                {resolvedValue}
              </td>
              <td className="px-6 py-4">
                <div
                  className="size-20 border-2 bg-background"
                  style={{ borderRadius: value }}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Core: Story = {}
