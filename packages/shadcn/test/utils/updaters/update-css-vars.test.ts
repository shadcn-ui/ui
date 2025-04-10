import { describe, expect, test } from "vitest"

import {
  isLocalHSLValue,
  transformCssVars,
} from "../../../src/utils/updaters/update-css-vars"

describe("transformCssVars", () => {
  test("should add light and dark css vars if not present", async () => {
    expect(
      await transformCssVars(
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
        },
        {
          tailwind: {
            cssVariables: true,
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --background: white;
          --foreground: black
        }
        .dark {
          --background: black;
          --foreground: white
        }
      }

      @layer base {
        * {
          @apply border-border;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
        "
    `)
  })

  test("should update light and dark css vars if present", async () => {
    expect(
      await transformCssVars(
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
        },
        {
          tailwind: {
            cssVariables: true,
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



      @layer base {
        * {
          @apply border-border;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
        "
    `)
  })

  test("should not add the base layer if it is already present", async () => {
    expect(
      await transformCssVars(
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

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
  `,
        {},
        {
          tailwind: {
            cssVariables: true,
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@tailwind base;
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

      @layer base {
        * {
          @apply border-border;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
        "
    `)
  })
})

describe("transformCssVarsV4", () => {
  test("should transform css vars for v4", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "0 0% 100%",
            foreground: "240 10% 3.9%",
          },
          dark: {
            background: "240 10% 3.9%",
            foreground: "0 0% 98%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --background: hsl(0 0% 100%);
        --foreground: hsl(240 10% 3.9%);
      }

      .dark {
        --background: hsl(240 10% 3.9%);
        --foreground: hsl(0 0% 98%);
      }

      @theme inline {
        --color-background: var(--background);
        --color-foreground: var(--foreground);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should update light and dark css vars if present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }
        `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "oklch(0.72 0.11 178)",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: oklch(0.72 0.11 178);
              }

              @theme inline {
                --color-background: var(--background);
                --color-foreground: var(--foreground);
                --color-primary: var(--primary);
      }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should update theme vars if present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
        }
        `,
        {
          theme: {
            "font-poppins": "Poppins, sans-serif",
            "breakpoint-3xl": "120rem",
            "shadow-2xs": "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            "animate-bounce": "bounce 1s infinite",
          },
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --font-poppins: Poppins, sans-serif;
                --breakpoint-3xl: 120rem;
                --shadow-2xs: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
                --animate-bounce: bounce 1s infinite;
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should NOT override theme vars if overwriteCssVars is false", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
          --font-sans: Inter, sans-serif;
        }
        `,
        {
          theme: {
            "font-sans": "Poppins, sans-serif",
            "breakpoint-3xl": "120rem",
          },
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --font-sans: Inter, sans-serif;
                --breakpoint-3xl: 120rem;
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should override theme vars if overwriteCssVars is true", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
          --font-sans: Inter, sans-serif;
        }
        `,
        {
          theme: {
            "font-sans": "Poppins, sans-serif",
            "breakpoint-3xl": "120rem",
          },
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4", overwriteCssVars: true }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(215 20.2% 65.1%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --font-sans: Poppins, sans-serif;
                --breakpoint-3xl: 120rem;
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should only add hsl and color vars if color", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
        }
        `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
            foo: "0.5rem",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
                --foo: 0.5rem;
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --foo: var(--foo);
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should not add base layer if it is already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
        }

        @layer base {
          * {
            @apply border-border;
          }
          body {
            @apply bg-background text-foreground;
          }
        }
        `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
                * {
                  @apply border-border;
                }
                body {
                  @apply bg-background text-foreground;
                }
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("it should add the dark @custom-variant if not present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "0 0% 100%",
            foreground: "240 10% 3.9%",
          },
          dark: {
            background: "240 10% 3.9%",
            foreground: "0 0% 98%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --background: hsl(0 0% 100%);
        --foreground: hsl(240 10% 3.9%);
      }

      .dark {
        --background: hsl(240 10% 3.9%);
        --foreground: hsl(0 0% 98%);
      }

      @theme inline {
        --color-background: var(--background);
        --color-foreground: var(--foreground);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("it should only add hsl() if not already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "0 0% 100%",
            foreground: "hsl(240 10% 3.9%)",
          },
          dark: {
            background: "hsl(240 10% 3.9%)",
            foreground: "0 0% 98%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --background: hsl(0 0% 100%);
        --foreground: hsl(240 10% 3.9%);
      }

      .dark {
        --background: hsl(240 10% 3.9%);
        --foreground: hsl(0 0% 98%);
      }

      @theme inline {
        --color-background: var(--background);
        --color-foreground: var(--foreground);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("it should only add hsl() for rgb and hex values", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "rgb(255, 255, 255)",
            foreground: "hsl(240 10% 3.9%)",
          },
          dark: {
            background: "hsl(240 10% 3.9%)",
            foreground: "#000fff",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --background: rgb(255, 255, 255);
        --foreground: hsl(240 10% 3.9%);
      }

      .dark {
        --background: hsl(240 10% 3.9%);
        --foreground: #000fff;
      }

      @theme inline {
        --color-background: var(--background);
        --color-foreground: var(--foreground);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should add --radius-* if radius present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            radius: "0.125rem",
          },
          dark: {
            radius: "0.5rem",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --radius: 0.125rem;
      }

      .dark {
        --radius: 0.5rem;
      }

      @theme inline {
        --radius-sm: calc(var(--radius) - 4px);
        --radius-md: calc(var(--radius) - 2px);
        --radius-lg: var(--radius);
        --radius-xl: calc(var(--radius) + 4px);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should NOT add --radius-* if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
      @custom-variant dark (&:is(.dark *));
      :root {
        --radius: 0.125rem;
      }
      @theme inline {
        --radius-sm: calc(var(--radius) - 4px);
        --radius-md: calc(var(--radius) - 2px);
        --radius-lg: var(--radius);
        --radius-xl: calc(var(--radius) + 4px);
      }
        `,
        {
          light: {
            radius: "0.125rem",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";
            @custom-variant dark (&:is(.dark *));
            :root {
              --radius: 0.125rem;
            }
            @theme inline {
              --radius-sm: calc(var(--radius) - 4px);
              --radius-md: calc(var(--radius) - 2px);
              --radius-lg: var(--radius);
              --radius-xl: calc(var(--radius) + 4px);
            }

            @layer base {
        * {
          @apply border-border outline-ring/50;
              }
        body {
          @apply bg-background text-foreground;
              }
      }
              "
    `)
  })

  test("should use --sidebar for --sidebar-background", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            "sidebar-background": "hsl(0 0% 98%)",
          },
          dark: {
            "sidebar-background": "hsl(0 0% 10%)",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
        --sidebar: hsl(0 0% 98%);
      }

      .dark {
        --sidebar: hsl(0 0% 10%);
      }

      @theme inline {
        --color-sidebar: var(--sidebar);
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should add plugin if not present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: { plugins: ['require("tailwindcss-animate")'] },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin "tailwindcss-animate";

      @custom-variant dark (&:is(.dark *));

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should NOT add plugin if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        @plugin "tailwindcss-animate";
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            plugins: [
              'require("tailwindcss-animate")',
              'require("@tailwindcss/typography")',
            ],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              @plugin "tailwindcss-animate";

              @plugin "@tailwindcss/typography";

              @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should preserve quotes", async () => {
    expect(
      await transformCssVars(
        `@import 'tailwindcss';
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            plugins: [
              'require("tailwindcss-animate")',
              'require("@tailwindcss/typography")',
            ],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import 'tailwindcss';

      @plugin '@tailwindcss/typography';

      @plugin 'tailwindcss-animate';

      @custom-variant dark (&:is(.dark *));

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should add @keyframes if not present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            theme: {
              extend: {
                keyframes: {
                  "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                  },
                },
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      @theme inline {

        @keyframes accordion-down {
          from {
            height: 0;
          }
          to {
            height: var(--radix-accordion-content-height);
          }
        }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
          }
          to {
            height: 0;
          }
        }
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should NOT add @keyframes if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";

        @theme inline {
          @keyframes accordion-down {
          from {
            height: 0;
          }
          to {
            height: var(--radix-accordion-content-height);
          }
        }
        }
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            theme: {
              extend: {
                keyframes: {
                  "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                  },
                },
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

              @theme inline {
                @keyframes accordion-down {
                from {
                  height: 0;
                }
                to {
                  height: var(--radix-accordion-content-height);
                }
              }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
                          }
          to {
            height: 0;
                          }
                }
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })

  test("should add --animate if not present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            theme: {
              extend: {
                keyframes: {
                  "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                  },
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                },
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      @theme inline {
        --animate-accordion-down: accordion-down 0.2s ease-out;
        --animate-accordion-up: accordion-up 0.2s ease-out;

        @keyframes accordion-down {
          from {
            height: 0;
          }
          to {
            height: var(--radix-accordion-content-height);
          }
        }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
          }
          to {
            height: 0;
          }
        }
      }

      @layer base {
        * {
          @apply border-border outline-ring/50;
        }
        body {
          @apply bg-background text-foreground;
        }
      }
              "
    `)
  })

  test("should NOT add --animate if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        @theme inline {
          --animate-accordion-up: accordion-up 0.3s ease-out;
        }
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            theme: {
              extend: {
                keyframes: {
                  "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                  },
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                },
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              @theme inline {
                --animate-accordion-up: accordion-up 0.3s ease-out;
        --animate-accordion-down: accordion-down 0.2s ease-out;

        @keyframes accordion-down {
          from {
            height: 0;
                          }
          to {
            height: var(--radix-accordion-content-height);
                          }
                }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
                          }
          to {
            height: 0;
                          }
                }
              }

              @layer base {
        * {
          @apply border-border outline-ring/50;
                }
        body {
          @apply bg-background text-foreground;
                }
      }
              "
    `)
  })
})

describe("isLocalHSLValue", () => {
  test.each([
    ["210 40% 98%", true],
    ["rgb(210 40% 98%)", false],
    ["oklch(210 40% 98%)", false],
    ["10 42 98%", false],
    ["hsl(210 40% 98% / 0.5)", false],
  ])("%s -> %s", (value, expected) => {
    expect(isLocalHSLValue(value)).toBe(expected)
  })
})
