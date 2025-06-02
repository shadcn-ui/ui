import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"
import { applyPrefixesCss } from "../../src/utils/transformers/transform-tw-prefix"
import stone from "../fixtures/colors/stone.json"

test("transform tailwind prefix", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
            export function Foo() {
                return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
            }
        `,
      config: {
        tailwind: {
          baseColor: "stone",
          prefix: "tw:",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: "stone",
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className={cn("bg-background hover:bg-muted", true && "text-primary-foreground sm:focus:text-accent-foreground")}>foo</div>
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className={cn('bg-background hover:bg-muted', true && 'text-primary-foreground sm:focus:text-accent-foreground')}>foo</div>
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    applyPrefixesCss(
      "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n \n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 224 71.4% 4.1%;\n \n    --muted: 220 14.3% 95.9%;\n    --muted-foreground: 220 8.9% 46.1%;\n \n    --popover: 0 0% 100%;\n    --popover-foreground: 224 71.4% 4.1%;\n \n    --card: 0 0% 100%;\n    --card-foreground: 224 71.4% 4.1%;\n \n    --border: 220 13% 91%;\n    --input: 220 13% 91%;\n \n    --primary: 220.9 39.3% 11%;\n    --primary-foreground: 210 20% 98%;\n \n    --secondary: 220 14.3% 95.9%;\n    --secondary-foreground: 220.9 39.3% 11%;\n \n    --accent: 220 14.3% 95.9%;\n    --accent-foreground: 220.9 39.3% 11%;\n \n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 210 20% 98%;\n \n    --ring: 217.9 10.6% 64.9%;\n \n    --radius: 0.5rem;\n  }\n \n  .dark {\n    --background: 224 71.4% 4.1%;\n    --foreground: 210 20% 98%;\n \n    --muted: 215 27.9% 16.9%;\n    --muted-foreground: 217.9 10.6% 64.9%;\n \n    --popover: 224 71.4% 4.1%;\n    --popover-foreground: 210 20% 98%;\n \n    --card: 224 71.4% 4.1%;\n    --card-foreground: 210 20% 98%;\n \n    --border: 215 27.9% 16.9%;\n    --input: 215 27.9% 16.9%;\n \n    --primary: 210 20% 98%;\n    --primary-foreground: 220.9 39.3% 11%;\n \n    --secondary: 215 27.9% 16.9%;\n    --secondary-foreground: 210 20% 98%;\n \n    --accent: 215 27.9% 16.9%;\n    --accent-foreground: 210 20% 98%;\n \n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 0 85.7% 97.3%;\n \n    --ring: 215 27.9% 16.9%;\n  }\n}\n \n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}",
      "tw:",
      "v4"
    )
  ).toMatchSnapshot()
})
