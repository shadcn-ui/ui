import React, { CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import resolveConfig from "tailwindcss/resolveConfig"

import tailwindConfig from "../../tailwind.config.cjs"

const fullConfig = resolveConfig(tailwindConfig)

const meta: Meta<{
  children: string
  key: keyof CSSProperties
  property: {
    name: string
    value: string
  }[]
}> = {
  title: "design/Typography",
  argTypes: {},
  args: {
    children: "Typeface",
  },
  render: (args) => (
    <table className="w-full table-auto text-left text-sm text-foreground rtl:text-right">
      <thead className="text-xs bg-muted uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="hidden px-6 py-3 sm:table-cell">
            Property
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Preview</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {args.property.map(({ name, value }) => {
          const style = window.getComputedStyle(document.body)
          const variable = value.match(/var\(([^)]+)\)/)?.[1] ?? ""
          const resolved = style.getPropertyValue(variable)
          const resolvedValue = resolved
            ? value.replace(/var\(--(.*?)\)/, resolved)
            : value

          return (
            <tr key={name} className="border-b bg-card">
              <td className="px-6 py-4">{name}</td>
              <td className="hidden px-6 py-4 sm:table-cell">
                {resolvedValue}
              </td>
              <td className="px-6 py-4 leading-tight">
                <p className="line-clamp-1" style={{ [args.key]: value }}>
                  {args.children}
                </p>
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

export const FontFamily: Story = {
  args: {
    key: "fontFamily",
    property: Object.keys(fullConfig.theme.fontFamily).map((name) => {
      const value =
        fullConfig.theme.fontFamily[
          name as keyof typeof fullConfig.theme.fontFamily
        ]
      return {
        name,
        value: Array.isArray(value) ? value.join(", ") : value,
      }
    }),
  },
}
export const FontSize: Story = {
  args: {
    key: "fontSize",
    property: Object.keys(fullConfig.theme.fontSize).map((name) => {
      const value =
        fullConfig.theme.fontSize[
          name as keyof typeof fullConfig.theme.fontSize
        ]
      return {
        name,
        value: value[0],
      }
    }),
  },
}
export const FontWeight: Story = {
  args: {
    key: "fontWeight",
    property: Object.keys(fullConfig.theme.fontWeight).map((name) => {
      const value =
        fullConfig.theme.fontWeight[
          name as keyof typeof fullConfig.theme.fontWeight
        ]
      return {
        name,
        value: Array.isArray(value) ? value.join(", ") : value,
      }
    }),
  },
}
