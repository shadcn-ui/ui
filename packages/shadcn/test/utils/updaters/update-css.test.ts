import { describe, expect, test } from "vitest"

import { transformCss } from "../../../src/utils/updaters/update-css"

describe("transformCss", () => {
  test("should add utility classes", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@utility content-auto": {
        "content-visibility": "auto",
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @utility content-auto {
          content-visibility: auto;
      }"
    `)
  })

  test("should add utility classes with pseudo-selectors", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@utility scrollbar-hidden": {
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @utility scrollbar-hidden {
        &::-webkit-scrollbar {
          display: none;
        }
      }"
    `)
  })

  test("should add parameterized utility classes", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@utility tab-*": {
        "tab-size": "--value([integer])",
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @utility tab-* {
          tab-size: --value([integer]);
      }"
    `)
  })

  test("should add component styles", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@layer components": {
        ".card": {
          "background-color": "var(--color-white)",
          "border-radius": "var(--rounded-lg)",
          padding: "var(--spacing-6)",
          "box-shadow": "var(--shadow-xl)",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer components {
        .card {
          background-color: var(--color-white);
          border-radius: var(--rounded-lg);
          padding: var(--spacing-6);
          box-shadow: var(--shadow-xl);
        }
      }"
    `)
  })

  test("should add base styles", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@layer base": {
        h1: {
          "font-size": "var(--text-2xl)",
        },
        h2: {
          "font-size": "var(--text-xl)",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        h1 {
          font-size: var(--text-2xl);
        }
        h2 {
          font-size: var(--text-xl);
        }
      }"
    `)
  })

  test("should update existing rules", async () => {
    const input = `@import "tailwindcss";

@layer components {
  .card {
    background-color: white;
    padding: 1rem;
  }
}`

    const result = await transformCss(input, {
      "@layer components": {
        ".card": {
          "background-color": "var(--color-white)",
          "border-radius": "var(--rounded-lg)",
          "box-shadow": "var(--shadow-xl)",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @layer components {
        .card {
          background-color: var(--color-white);
          padding: 1rem;
          border-radius: var(--rounded-lg);
          box-shadow: var(--shadow-xl);
        }
      }"
    `)
  })

  test("should add multiple rules and types", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@utility content-auto": {
        "content-visibility": "auto",
      },
      "@layer components": {
        ".card": {
          "background-color": "var(--color-white)",
          "border-radius": "var(--rounded-lg)",
        },
      },
      "@layer base": {
        h1: {
          "font-size": "var(--text-2xl)",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @utility content-auto {
          content-visibility: auto;
      }

      @layer components {
        .card {
          background-color: var(--color-white);
          border-radius: var(--rounded-lg);
          }
      }

      @layer base {
        h1 {
          font-size: var(--text-2xl);
          }
      }"
    `)
  })

  test("should handle nested selectors with &", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@layer components": {
        ".button": {
          "background-color": "var(--color-primary)",
          "&:hover": {
            "background-color": "var(--color-primary-dark)",
          },
          "&:active": {
            "background-color": "var(--color-primary-darker)",
          },
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer components {
        .button {
          background-color: var(--color-primary);
        }
        .button:hover {
          background-color: var(--color-primary-dark);
        }
        .button:active {
          background-color: var(--color-primary-darker);
        }
      }"
    `)
  })

  test("should handle direct string content", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@layer base": {
        body: "font-family: var(--font-sans); line-height: 1.5;",
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        body {
          font-family: var(--font-sans);
          line-height: 1.5;
        }
      }"
    `)
  })

  test("should handle nested at-rules", async () => {
    const input = `@tailwind base;
@tailwind components;
@tailwind utilities;`

    const result = await transformCss(input, {
      "@layer components": {
        "@media (min-width: 768px)": {
          ".card": {
            padding: "2rem",
          },
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer components {

      @media (min-width: 768px) {
        .card {
          padding: 2rem;
      }
      }
      }"
    `)
  })

  test("should place keyframes under @theme inline directive", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@keyframes spin": {
        "0%": {
          transform: "rotate(0deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @theme inline {
        @keyframes spin {
        0% {
          transform: rotate(0deg);
          }
        100% {
          transform: rotate(360deg);
          }
        }
      }"
    `)
  })
})
