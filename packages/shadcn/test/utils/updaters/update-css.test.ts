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

  test("should add plugin directive", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@plugin foo": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin foo;"
    `)
  })

  test("should group plugins together after imports", async () => {
    const input = `@import "tailwindcss";

@layer base {
  body {
    font-family: sans-serif;
  }
}

@utility content-auto {
  content-visibility: auto;
}`

    const result = await transformCss(input, {
      "@plugin foo": {},
      "@plugin bar": {},
      "@layer components": {
        ".card": {
          padding: "1rem",
        },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin foo;
      @plugin bar;

      @layer base {
        body {
          font-family: sans-serif;
        }
      }

      @utility content-auto {
        content-visibility: auto;
      }

      @layer components {
        .card {
          padding: 1rem;
        }
      }"
    `)
  })

  test("should not add duplicate plugins", async () => {
    const input = `@import "tailwindcss";

@plugin foo;

@layer base {
  body {
    font-family: sans-serif;
  }
}`

    const result = await transformCss(input, {
      "@plugin foo": {},
      "@plugin bar": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin foo;

      @plugin bar;

      @layer base {
        body {
          font-family: sans-serif;
        }
      }"
    `)
  })

  test("should add plugin when no imports exist", async () => {
    const input = `@layer base {
  body {
    font-family: sans-serif;
  }
}`

    const result = await transformCss(input, {
      "@plugin foo": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "
      @plugin foo;

      @layer base {
        body {
          font-family: sans-serif;
        }
      }"
    `)
  })

  test("should handle plugins with quoted parameters", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@plugin @tailwindcss/typography": {},
      "@plugin ./custom-plugin.js": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin @tailwindcss/typography;
      @plugin ./custom-plugin.js;"
    `)
  })

  test("should handle plugins with complex parameters", async () => {
    const input = `@import "tailwindcss";`

    const result = await transformCss(input, {
      "@plugin tailwindcss/plugin": {},
      "@plugin @headlessui/tailwindcss": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin tailwindcss/plugin;
      @plugin @headlessui/tailwindcss;"
    `)
  })

  test("should handle multiple imports with plugins", async () => {
    const input = `@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");`

    const result = await transformCss(input, {
      "@plugin foo": {},
      "@plugin bar": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

      @plugin foo;
      @plugin bar;"
    `)
  })

  test("should add plugins to empty file", async () => {
    const input = ``

    const result = await transformCss(input, {
      "@plugin foo": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "
      @plugin foo"
    `)
  })

  test("should maintain plugin order with existing plugins", async () => {
    const input = `@import "tailwindcss";

@plugin existing-plugin;
@plugin another-existing;`

    const result = await transformCss(input, {
      "@plugin new-plugin": {},
      "@plugin final-plugin": {},
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin existing-plugin;
      @plugin another-existing;
      @plugin new-plugin;
      @plugin final-plugin;"
    `)
  })

  test("should handle comprehensive CSS with plugins", async () => {
    const input = `@import "tailwindcss";
@import url("fonts.css");

@layer base {
  * {
    box-sizing: border-box;
  }
}

@utility content-auto {
  content-visibility: auto;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}`

    const result = await transformCss(input, {
      "@plugin @tailwindcss/typography": {},
      "@plugin ./custom": {},
      "@layer components": {
        ".btn": {
          padding: "0.5rem 1rem",
          "&:hover": {
            "background-color": "blue",
          },
        },
      },
      "@utility animate-fast": {
        "animation-duration": "0.1s",
      },
      "@keyframes spin-fast": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
    })

    expect(result).toMatchInlineSnapshot(`
      "@import "tailwindcss";
      @import url("fonts.css");

      @plugin @tailwindcss/typography;
      @plugin ./custom;

      @layer base {
        * {
          box-sizing: border-box;
        }
      }

      @utility content-auto {
        content-visibility: auto;
      }

      @keyframes fade {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @layer components {
        .btn {
          padding: 0.5rem 1rem;
        }
        .btn:hover {
          background-color: blue;
        }
      }

      @utility animate-fast {
          animation-duration: 0.1s;
      }

      @theme inline {
        @keyframes spin-fast {
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
