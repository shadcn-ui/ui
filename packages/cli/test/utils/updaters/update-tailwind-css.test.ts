import { describe, expect, test } from "vitest"

import { transformTailwindCss } from "../../../src/utils/updaters/update-tailwind-css"

describe("transformTailwindCss", () => {
  test("should add light and dark css vars if not present", async () => {
    expect(
      await transformTailwindCss(
        `@tailwind base;
@tailwind components;
@tailwind utilities;
  `,
        {
          light: {
            background: "white",
            foreground: "black",
          },
          dark: {
            background: "black",
            foreground: "white",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;
      @layer base{
          :root{
              --background: white;
              --foreground: black
          }
          .dark{
              --background: black;
              --foreground: white
          }
      }
        "
    `)
  })

  test("should update light and dark css vars if present", async () => {
    expect(
      await transformTailwindCss(
        `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base{
  :root{
    --background: 210 40% 98%;
  }

  .dark{
    --background: 222.2 84% 4.9%;
  }
}
  `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base{
        :root{
          --background: 215 20.2% 65.1%;
          --foreground: 222.2 84% 4.9%;
        }

        .dark{
          --background: 222.2 84% 4.9%;
          --foreground: 60 9.1% 97.8%;
        }
      }
        "
    `)
  })
})
