import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import { Project, SyntaxKind } from "ts-morph"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  buildTailwindThemeColorsFromCssVars,
  nestSpreadElements,
  nestSpreadProperties,
  transformTailwindConfig,
  unnestSpreadProperties,
  unsetSpreadElements,
  updateTailwindConfig,
} from "./update-tailwind-config"

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
  })),
}))

const SHARED_CONFIG = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: true,
  tsx: true,
  tailwind: {
    config: "tailwind.config.ts",
    css: "app/globals.css",
    baseColor: "slate",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: ".",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "app/globals.css",
    components: "./components",
    utils: "./lib/utils",
    ui: "./components/ui",
  },
}

describe("transformTailwindConfig -> darkMode property", () => {
  it("should add darkMode property if not in config", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()

    expect(
      await transformTailwindConfig(
        `/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [],
}
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()

    expect(
      await transformTailwindConfig(
        `/** @type {import('tailwindcss').Config} */
const foo = {
  bar: 'baz',
}

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [],
}
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should append class to darkMode property if existing array", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["selector"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should preserve quote kind", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should convert string to array and add class if darkMode is string", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should work with multiple darkMode selectors", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ]],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should not add darkMode property if already in config", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()

    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

  const config: Config = {
  darkMode: ['class', 'selector'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  }
  export default config
  `,
        {
          properties: [
            {
              name: "darkMode",
              value: "class",
            },
          ],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })
})

describe("transformTailwindConfig -> plugin", () => {
  it("should add plugin if not in config", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
}
export default config
  `,
        {
          plugins: ['require("tailwindcss-animate")'],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should append plugin to existing array", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
export default config
  `,
        {
          plugins: ['require("tailwindcss-animate")'],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should not add plugin if already in config", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}
export default config
  `,
        {
          plugins: ["require('tailwindcss-animate')"],
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })
})

describe("transformTailwindConfig -> theme", () => {
  it("should add theme if not in config", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

  const config: Config = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  }
  export default config
    `,
        {
          theme: {
            extend: {
              colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                  DEFAULT: "hsl(var(--primary))",
                  foreground: "hsl(var(--primary-foreground))",
                },
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should merge existing theme", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: "hsl(var(--primary))",
                  foreground: "hsl(var(--primary-foreground))",
                },
                card: {
                  DEFAULT: "hsl(var(--card))",
                  foreground: "hsl(var(--card-foreground))",
                },
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should keep spread assignments", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: "hsl(var(--primary))",
                  foreground: "hsl(var(--primary-foreground))",
                },
                card: {
                  DEFAULT: "hsl(var(--card))",
                  foreground: "hsl(var(--card-foreground))",
                },
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should handle multiple properties", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        ...defaultColors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      boxShadow: {
        ...defaultBoxShadow,
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        "3xl": "2rem",
      },
      animation: {
        ...defaultAnimation,
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              fontFamily: {
                heading: ["var(--font-geist-sans)"],
              },
              colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                primary: {
                  DEFAULT: "hsl(var(--primary))",
                  foreground: "hsl(var(--primary-foreground))",
                },
                card: {
                  DEFAULT: "hsl(var(--card))",
                  foreground: "hsl(var(--card-foreground))",
                },
              },
              borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
              },
              animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should not make any updates running on already updated config", async () => {
    const input = `import type { Config } from 'tailwindcss'

const config: Config = {
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      mono: ["var(--font-mono)", ...fontFamily.mono],
    },
    colors: {
      ...defaultColors,
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
    },
    boxShadow: {
      ...defaultBoxShadow,
      "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
    },
    borderRadius: {
      "3xl": "2rem",
    },
    animation: {
      ...defaultAnimation,
      "spin-slow": "spin 3s linear infinite",
    },
  },
},
}
export default config
`

    const tailwindConfig = {
      theme: {
        extend: {
          fontFamily: {
            heading: ["var(--font-geist-sans)"],
          },
          colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            primary: {
              DEFAULT: "hsl(var(--primary))",
              foreground: "hsl(var(--primary-foreground))",
            },
            card: {
              DEFAULT: "hsl(var(--card))",
              foreground: "hsl(var(--card-foreground))",
            },
          },
          borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
          },
          animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
          },
        },
      },
    }

    const output1 = await transformTailwindConfig(input, tailwindConfig, {
      config: SHARED_CONFIG,
    } as any)

    const output2 = await transformTailwindConfig(output1, tailwindConfig, {
      config: SHARED_CONFIG,
    } as any)

    const output3 = await transformTailwindConfig(output2, tailwindConfig, {
      config: SHARED_CONFIG,
    } as any)

    expect(output3).toBe(output1)
    expect(output3).toBe(output2)
  })

  it("should keep quotes in strings", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...defaultColors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: "hsl(var(--primary))",
                  foreground: "hsl(var(--primary-foreground))",
                },
                card: {
                  DEFAULT: "hsl(var(--card))",
                  foreground: "hsl(var(--card-foreground))",
                },
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should keep arrays when formatted on multilines", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Figtree',
          ...defaultTheme.fontFamily.sans
        ],
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              fontFamily: {
                mono: ["Foo"],
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should handle objects nested in arrays", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: [
          '0.875rem',
          {
            lineHeight: '1.25rem',
          },
        ],
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              fontSize: {
                xl: [
                  "clamp(1.5rem, 1.04vi + 1.17rem, 2rem)",
                  {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em",
                    fontWeight: "600",
                  },
                ],
              },
            },
          },
        },
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })

  it("should preserve boolean values", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true
    }
  },
}
export default config
  `,
        {},
        {
          config: SHARED_CONFIG,
        } as any
      )
    ).toMatchSnapshot()
  })
})

describe("nestSpreadProperties", () => {
  let project: Project

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true })
  })

  function testTransformation(input: string, expected: string) {
    const sourceFile = project.createSourceFile(
      "test.ts",
      `const config = ${input};`
    )
    const configObject = sourceFile.getFirstDescendantByKind(
      SyntaxKind.ObjectLiteralExpression
    )
    if (!configObject) throw new Error("Config object not found")

    nestSpreadProperties(configObject)

    const result = configObject.getText()
    expect(result.replace(/\s+/g, "")).toBe(expected.replace(/\s+/g, ""))
  }

  it("should nest spread properties", () => {
    testTransformation(
      `{ theme: { ...foo, bar: { ...baz, one: "two" }, other: { a: "b", ...c } } }`,
      `{ theme: { "___foo": "...foo", bar: { "___baz": "...baz", one: "two" }, other: { a: "b", "___c": "...c" } } }`
    )
  })

  it("should handle mixed property assignments", () => {
    testTransformation(
      `{ ...foo, a: 1, b() {}, ...bar, c: { ...baz } }`,
      `{ "___foo": "...foo", a: 1, b() {}, "___bar": "...bar", c: { "___baz": "...baz" } }`
    )
  })

  it("should handle objects with only spread properties", () => {
    testTransformation(
      `{ ...foo, ...bar, ...baz }`,
      `{ "___foo": "...foo", "___bar": "...bar", "___baz": "...baz" }`
    )
  })

  it("should handle property name conflicts", () => {
    testTransformation(`{ foo: 1, ...foo }`, `{ foo: 1, "___foo": "...foo" }`)
  })

  it("should handle shorthand property names", () => {
    testTransformation(`{ a, ...foo, b }`, `{ a, "___foo": "...foo", b }`)
  })

  it("should handle computed property names", () => {
    testTransformation(
      `{ ["computed"]: 1, ...foo }`,
      `{ ["computed"]: 1, "___foo": "...foo" }`
    )
  })

  it("should handle spreads in arrays", () => {
    testTransformation(
      `{ foo: [{ ...bar }] }`,
      `{ foo: [{ "___bar": "...bar" }] }`
    )
  })

  it("should handle deep nesting in arrays", () => {
    testTransformation(
      `{ foo: [{ baz: { ...other.baz }, ...bar }] }`,
      `{ foo: [{ baz: { "___other.baz": "...other.baz" }, "___bar": "...bar" }] }`
    )
  })
})

describe("nestSpreadElements", () => {
  let project: Project

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true })
  })

  function testTransformation(input: string, expected: string) {
    const sourceFile = project.createSourceFile(
      "test.ts",
      `const config = ${input};`
    )
    const configObject = sourceFile.getFirstDescendantByKind(
      SyntaxKind.ArrayLiteralExpression
    )
    if (!configObject) throw new Error("Config object not found")

    nestSpreadElements(configObject)

    const result = configObject.getText()
    expect(result.replace(/\s+/g, "")).toBe(expected.replace(/\s+/g, ""))
  }

  it("should spread elements", () => {
    testTransformation(`[...bar]`, `["...bar"]`)
  })

  it("should handle mixed element types", () => {
    testTransformation(
      `['foo', 2, true, ...bar, "baz"]`,
      `['foo', 2, true, "...bar", "baz"]`
    )
  })

  it("should handle arrays with only spread elements", () => {
    testTransformation(
      `[...foo, ...foo.bar, ...baz]`,
      `["...foo", "...foo.bar", "...baz"]`
    )
  })

  it("should handle nested arrays with spreads", () => {
    testTransformation(`[...foo, [...bar]]`, `["...foo", ["...bar"]]`)
  })

  it("should handle nested arrays within objects", () => {
    testTransformation(`[{ foo: [...foo] }]`, `[{ foo: ["...foo"] }]`)
  })

  it("should handle deeply nested arrays within spread objects", () => {
    testTransformation(
      `[{ foo: [...foo, { bar: ['bar', ...bar ]}] }]`,
      `[{ foo: ["...foo", { bar: ['bar', "...bar" ]}] }]`
    )
  })

  it("should handle optional paths in spread", () => {
    testTransformation(`[{ foo: [...foo?.bar] }]`, `[{ foo: ["...foo?.bar"] }]`)
  })

  it("should handle computed property paths within spread", () => {
    testTransformation(
      `[{ foo: [...foo["bar"]] }]`,
      `[{ foo: ["...foo["bar"]"] }]`
    )
  })

  it("should handle indexed paths in spread", () => {
    testTransformation(`[{ foo: [...foo[0]] }]`, `[{ foo: ["...foo[0]"] }]`)
  })
})

describe("unnestSpreadProperties", () => {
  let project: Project

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true })
  })

  function testTransformation(input: string, expected: string) {
    const sourceFile = project.createSourceFile(
      "test.ts",
      `const config = ${input};`
    )
    const configObject = sourceFile.getFirstDescendantByKind(
      SyntaxKind.ObjectLiteralExpression
    )
    if (!configObject) throw new Error("Config object not found")

    unnestSpreadProperties(configObject)

    const result = configObject.getText()
    expect(result.replace(/\s+/g, "")).toBe(expected.replace(/\s+/g, ""))
  }

  it("should nest spread properties", () => {
    testTransformation(
      `{ theme: { ___foo: "...foo", bar: { ___baz: "...baz", one: "two" }, other: { a: "b", ___c: "...c" } } }`,
      `{ theme: { ...foo, bar: { ...baz, one: "two" }, other: { a: "b", ...c } } }`
    )
  })

  it("should handle mixed property assignments", () => {
    testTransformation(
      `{ ___foo: "...foo", a: 1, b() {}, ___bar: "...bar", c: { ___baz: "...baz" } }`,
      `{ ...foo, a: 1, b() {}, ...bar, c: { ...baz } }`
    )
  })

  it("should handle objects with only spread properties", () => {
    testTransformation(
      `{ ___foo: "...foo", ___bar: "...bar", ___baz: "...baz" }`,
      `{ ...foo, ...bar, ...baz }`
    )
  })

  it("should handle property name conflicts", () => {
    testTransformation(`{ foo: 1, ___foo: "...foo" }`, `{ foo: 1, ...foo }`)
  })

  it("should handle shorthand property names", () => {
    testTransformation(`{ a, ___foo: "...foo", b }`, `{ a, ...foo, b }`)
  })

  it("should handle computed property names", () => {
    testTransformation(
      `{ ["computed"]: 1, "___foo": "...foo" }`,
      `{ ["computed"]: 1, ...foo }`
    )
  })

  it("should handle spread objects within arrays", () => {
    testTransformation(
      `{ ["computed"]: 1, foo: [{ "___foo": "...foo" }] }`,
      `{ ["computed"]: 1, foo: [{...foo}] }`
    )
  })

  it("should handle deeply nested spread objects within an array", () => {
    testTransformation(
      `{ ["computed"]: 1, foo: [{ "___foo": "...foo", bar: { baz: 'baz', "___foo.bar": "...foo.bar" } }] }`,
      `{ ["computed"]: 1, foo: [{...foo, bar: { baz: 'baz', ...foo.bar } }] }`
    )
  })
})

describe("unnestSpreadElements", () => {
  let project: Project

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true })
  })

  function testTransformation(input: string, expected: string) {
    const sourceFile = project.createSourceFile(
      "test.ts",
      `const config = ${input};`
    )
    const configObject = sourceFile.getFirstDescendantByKind(
      SyntaxKind.ArrayLiteralExpression
    )
    if (!configObject) throw new Error("Config object not found")

    unsetSpreadElements(configObject)

    const result = configObject.getText()
    expect(result.replace(/\s+/g, "")).toBe(expected.replace(/\s+/g, ""))
  }

  it("should spread elements", () => {
    testTransformation(`["...bar"]`, `[...bar]`)
  })

  it("should handle mixed element types", () => {
    testTransformation(
      `['foo', 2, true, "...bar", "baz"]`,
      `['foo', 2, true, ...bar, "baz"]`
    )
  })

  it("should handle arrays with only spread elements", () => {
    testTransformation(
      `["...foo", "...foo.bar", "...baz"]`,
      `[...foo, ...foo.bar, ...baz]`
    )
  })

  it("should handle nested arrays with spreads", () => {
    testTransformation(`["...foo", ["...bar"]]`, `[...foo, [...bar]]`)
  })

  it("should handle nested arrays within objects", () => {
    testTransformation(`[{ foo: ["...foo"] }]`, `[{ foo: [...foo] }]`)
  })

  it("should handle deeply nested arrays within spread objects", () => {
    testTransformation(
      `[{ foo: ["...foo", { bar: ['bar', "...bar" ]}] }]`,
      `[{ foo: [...foo, { bar: ['bar', ...bar ]}] }]`
    )
  })

  it("should handle optional paths in spread", () => {
    testTransformation(`[{ foo: ["...foo?.bar"] }]`, `[{ foo: [...foo?.bar] }]`)
  })

  it("should handle computed property paths (') within spread", () => {
    testTransformation(
      `[{ foo: ["...foo['bar']"] }]`,
      `[{ foo: [...foo['bar']] }]`
    )
  })

  it('should handle computed property paths (") within spread', () => {
    testTransformation(
      `[{ foo: ['...foo["bar"]'] }]`,
      `[{ foo: [...foo["bar"]] }]`
    )
  })

  it("should handle indexed paths in spread", () => {
    testTransformation(`[{ foo: ["...foo[0]"] }]`, `[{ foo: [...foo[0]] }]`)
  })
})

describe("buildTailwindThemeColorsFromCssVars", () => {
  it("should inline color names", () => {
    expect(
      buildTailwindThemeColorsFromCssVars({
        primary: "blue",
        "primary-light": "skyblue",
        "primary-dark": "navy",
        secondary: "green",
        accent: "orange",
        "accent-hover": "darkorange",
        "accent-active": "orangered",
      } as any)
    ).toEqual({
      primary: {
        DEFAULT: "hsl(var(--primary))",
        light: "hsl(var(--primary-light))",
        dark: "hsl(var(--primary-dark))",
      },
      secondary: "hsl(var(--secondary))",
      accent: {
        DEFAULT: "hsl(var(--accent))",
        hover: "hsl(var(--accent-hover))",
        active: "hsl(var(--accent-active))",
      },
    })
  })

  it("should not add a DEFAULT if not present", () => {
    expect(
      buildTailwindThemeColorsFromCssVars({
        "primary-light": "skyblue",
        "primary-dark": "navy",
        secondary: "green",
        accent: "orange",
        "accent-hover": "darkorange",
        "accent-active": "orangered",
      } as any)
    ).toEqual({
      primary: {
        light: "hsl(var(--primary-light))",
        dark: "hsl(var(--primary-dark))",
      },
      secondary: "hsl(var(--secondary))",
      accent: {
        DEFAULT: "hsl(var(--accent))",
        hover: "hsl(var(--accent-hover))",
        active: "hsl(var(--accent-active))",
      },
    })
  })

  it("should set DEFAULT on an existing object when the base key comes last", () => {
    expect(
      buildTailwindThemeColorsFromCssVars({
        "primary-foreground": "white",
        primary: "blue",
      } as any)
    ).toEqual({
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
    })
  })

  it("should build tailwind theme colors from css vars", () => {
    expect(
      buildTailwindThemeColorsFromCssVars({
        background: "0 0% 100%",
        foreground: "224 71.4% 4.1%",
        card: "0 0% 100%",
        "card-foreground": "224 71.4% 4.1%",
        popover: "0 0% 100%",
        "popover-foreground": "224 71.4% 4.1%",
        primary: "220.9 39.3% 11%",
        "primary-foreground": "210 20% 98%",
        secondary: "220 14.3% 95.9%",
        "secondary-foreground": "220.9 39.3% 11%",
        muted: "220 14.3% 95.9%",
        "muted-foreground": "220 8.9% 46.1%",
        accent: "220 14.3% 95.9%",
        "accent-foreground": "220.9 39.3% 11%",
        destructive: "0 84.2% 60.2%",
        "destructive-foreground": "210 20% 98%",
        border: "220 13% 91%",
        input: "220 13% 91%",
        ring: "224 71.4% 4.1%",
      } as any)
    ).toEqual({
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    })
  })
})

const SHADCN_TAILWIND_CONFIG = {
  plugins: ['require("tailwindcss-animate")'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
}

function configWithPath(tailwindConfig: string) {
  return {
    ...SHARED_CONFIG,
    resolvedPaths: { ...SHARED_CONFIG.resolvedPaths, tailwindConfig },
  } as any
}

describe("transformTailwindConfig -> config file shapes", () => {
  it("should update a 2-space indented ts config using satisfies Config", async () => {
    const input = `import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.ts")
    )

    expect(output).toMatchInlineSnapshot(`
      "import type { Config } from "tailwindcss"

      export default {
          darkMode: ["class"],
          content: ["./src/**/*.{ts,tsx}"],
        theme: {
        	extend: {
        		colors: {
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
        plugins: [require("tailwindcss-animate")],
      } satisfies Config
      "
    `)
    expect(
      await transformTailwindConfig(
        output,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.ts")
      )
    ).toBe(output)
  })

  it("should parse a .js config path as JavaScript with the same output", async () => {
    const input = `import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
`
    expect(
      await transformTailwindConfig(
        input,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.js")
      )
    ).toBe(
      await transformTailwindConfig(
        input,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.ts")
      )
    )
  })

  it("should update a tab-indented module.exports js config", async () => {
    const input = `/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: "#ff0000",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    expect(output).toMatchInlineSnapshot(`
      "/** @type {import('tailwindcss').Config} */
      module.exports = {
          darkMode: ["class"],
          content: [
      		"./pages/**/*.{js,jsx}",
      		"./components/**/*.{js,jsx}",
      	],
      	theme: {
          	extend: {
          		colors: {
          			brand: '#ff0000',
          			border: 'hsl(var(--border))',
          			primary: {
          				DEFAULT: 'hsl(var(--primary))',
          				foreground: 'hsl(var(--primary-foreground))'
          			}
          		},
          		borderRadius: {
          			lg: 'var(--radius)'
          		}
          	}
          },
      	plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
      }
      "
    `)
    expect(
      await transformTailwindConfig(
        output,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.js")
      )
    ).toBe(output)
  })

  it("should update a single-quoted export default mjs config", async () => {
    const input = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.mjs")
    )

    expect(output).toMatchInlineSnapshot(`
      "/** @type {import('tailwindcss').Config} */
      export default {
          darkMode: ['class'],
          content: ['./index.html', './src/**/*.{js,jsx}'],
        theme: {
        	extend: {
        		colors: {
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
        plugins: [require("tailwindcss-animate")],
      }
      "
    `)
  })

  it("should update a cjs config without theme or plugins", async () => {
    const input = `module.exports = {
  content: ["./app/**/*.{js,jsx}"],
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.cjs")
    )

    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
          darkMode: ["class"],
          content: ["./app/**/*.{js,jsx}"],
          plugins: [require("tailwindcss-animate")],
          theme: {
          	extend: {
          		colors: {
          			border: 'hsl(var(--border))',
          			primary: {
          				DEFAULT: 'hsl(var(--primary))',
          				foreground: 'hsl(var(--primary-foreground))'
          			}
          		},
          		borderRadius: {
          			lg: 'var(--radius)'
          		}
          	}
          }
      }
      "
    `)
  })

  it("should update a config with CRLF line endings", async () => {
    const input = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`.replace(/\n/g, "\r\n")
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.ts")
    )

    // Current behavior: inserted and reprinted lines use LF, so the output mixes
    // line endings.
    expect(output.replace(/\r/g, "\\r")).toMatchInlineSnapshot(`
      "import type { Config } from "tailwindcss"\\r
      \\r
      const config: Config = {
          darkMode: ["class"],
          content: ["./app/**/*.{ts,tsx}"],\\r
        theme: {
        	extend: {
        		colors: {
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },\\r
        plugins: [require("tailwindcss-animate")],\\r
      }\\r
      export default config\\r
      "
    `)
  })

  it("should return the input unchanged when no object has a content property", async () => {
    const input = `module.exports = require("@acme/tailwind-config")
`
    expect(
      await transformTailwindConfig(
        input,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.js")
      )
    ).toBe(input)
  })

  it("should return the input unchanged when content is a shorthand property", async () => {
    const input = `const content = ["./app/**/*.{ts,tsx}"]

export default {
  content,
  theme: {
    extend: {},
  },
}
`
    // Current behavior: a shorthand content property is not matched.
    expect(
      await transformTailwindConfig(
        input,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.ts")
      )
    ).toBe(input)
  })

  it("should update the first object with a content property", async () => {
    const input = `const shared = {
  content: ["./packages/ui/**/*.{ts,tsx}"],
}

export default {
  presets: [shared],
  content: ["./app/**/*.{ts,tsx}"],
}
`
    const output = await transformTailwindConfig(
      input,
      { plugins: ['require("tailwindcss-animate")'] },
      configWithPath("tailwind.config.ts")
    )

    // Current behavior: the preset object is edited, not the exported config.
    expect(output).toMatchInlineSnapshot(`
      "const shared = {
          darkMode: ["class"],
          content: ["./packages/ui/**/*.{ts,tsx}"],
          plugins: [require("tailwindcss-animate")]
      }

      export default {
        presets: [shared],
        content: ["./app/**/*.{ts,tsx}"],
      }
      "
    `)
  })
})

describe("transformTailwindConfig -> darkMode variants", () => {
  it("should keep a shorthand darkMode property", async () => {
    const input = `const darkMode = "media"

module.exports = {
  darkMode,
  content: ["./app/**/*.{js,jsx}"],
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.js")
    )

    expect(output).toBe(input)
  })

  it("should keep a darkMode expression that is not a string or array", async () => {
    const input = `module.exports = {
  darkMode: process.env.DARK_MODE,
  content: ["./app/**/*.{js,jsx}"],
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.js")
    )

    expect(output).toBe(input)
  })

  it("should duplicate class when darkMode is already the string class", async () => {
    const input = `module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}"],
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.js")
    )

    // Current behavior: the string is converted to an array without checking it.
    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
        darkMode: ["class", "class"],
        content: ["./app/**/*.{js,jsx}"],
      }
      "
    `)
  })

  it("should use the quote kind of the first string in the config object", async () => {
    const input = `module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  darkMode: "media",
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.js")
    )

    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
        content: ['./app/**/*.{js,jsx}'],
        darkMode: ["media", 'class'],
      }
      "
    `)
  })

  it("should use double quotes when the config object has no string literal", async () => {
    const input = `module.exports = {
  content: [\`./app/**/*.{js,jsx}\`],
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.js")
    )

    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
          darkMode: ["class"],
          content: [\`./app/**/*.{js,jsx}\`],
      }
      "
    `)
  })

  it("should insert darkMode at 4 spaces in a tab-indented config", async () => {
    const input = `export default {
	content: ["./app/**/*.{ts,tsx}"],
	plugins: [],
}
`
    const output = await transformTailwindConfig(
      input,
      {},
      configWithPath("tailwind.config.ts")
    )

    expect(output.replace(/\t/g, "<tab>")).toMatchInlineSnapshot(`
      "export default {
          darkMode: ["class"],
          content: ["./app/**/*.{ts,tsx}"],
      <tab>plugins: [],
      }
      "
    `)
  })
})

describe("transformTailwindConfig -> plugin variants", () => {
  it("should keep a shorthand plugins property", async () => {
    const input = `const plugins = [require("@tailwindcss/typography")]

module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}"],
  plugins,
}
`
    const output = await transformTailwindConfig(
      input,
      { plugins: ['require("tailwindcss-animate")'] },
      configWithPath("tailwind.config.js")
    )

    expect(output).toBe(input)
  })

  it("should append to a multi-line plugins array", async () => {
    const input = `module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}"],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
}
`
    const output = await transformTailwindConfig(
      input,
      {
        plugins: [
          'require("tailwindcss-animate")',
          "require('@tailwindcss/forms')",
        ],
      },
      configWithPath("tailwind.config.js")
    )

    // Current behavior: the trailing comma is dropped and the new element and
    // closing bracket are misindented.
    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
        darkMode: ["class"],
        content: ["./app/**/*.{js,jsx}"],
        plugins: [
          require("@tailwindcss/typography"),
          require("@tailwindcss/forms"),
            require("tailwindcss-animate")
      ],
      }
      "
    `)
  })

  it("should leave a plugins expression that is not an array", async () => {
    const input = `module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}"],
  plugins: getPlugins(),
}
`
    const output = await transformTailwindConfig(
      input,
      { plugins: ['require("tailwindcss-animate")'] },
      configWithPath("tailwind.config.js")
    )

    expect(output).toBe(input)
  })
})

describe("transformTailwindConfig -> theme variants", () => {
  it("should keep spreads at the root of the config object", async () => {
    const input = `const base = require("./tailwind.base")

module.exports = {
  ...base,
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    ...base.theme,
    extend: {
      colors: {
        ...base.theme.extend.colors,
      },
    },
  },
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    expect(output).toMatchInlineSnapshot(`
      "const base = require("./tailwind.base")

      module.exports = {
          darkMode: ["class"],
          ...base,
        content: ["./app/**/*.{js,jsx}"],
        theme: {
            ...base.theme,
        	extend: {
        		colors: {
                      ...base.theme.extend.colors,
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
          plugins: [require("tailwindcss-animate")]
      }
      "
    `)
  })

  it("should round-trip numbers, booleans, null, identifiers, calls and nested arrays", async () => {
    const input = `const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        gray: colors.zinc,
        brand: rgb(0, 0, 0),
        accent: \`var(--accent)\`,
      },
      zIndex: {
        100: 100,
      },
      opacity: {
        15: 0.15,
      },
      aspectRatio: false,
      outline: null,
      gridTemplateAreas: {
        layout: [["header", "header"], ["sidebar", "main"]],
      },
    },
  },
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    // Current behavior: identifiers, calls and template literals are turned into
    // string literals, and numeric keys are quoted.
    expect(output).toMatchInlineSnapshot(`
      "const colors = require("tailwindcss/colors")

      module.exports = {
          darkMode: ["class"],
          content: ["./app/**/*.{js,jsx}"],
        theme: {
        	container: {
        		center: true,
        		padding: '2rem'
        	},
        	extend: {
        		colors: {
        			gray: 'colors.zinc',
        			brand: 'rgb(0, 0, 0)',
        			accent: '\`var(--accent)\`',
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		zIndex: {
        			'100': 100
        		},
        		opacity: {
        			'15': 0.15
        		},
        		aspectRatio: false,
        		outline: null,
        		gridTemplateAreas: {
        			layout: [
        				[
        					'header',
        					'header'
        				],
        				[
        					'sidebar',
        					'main'
        				]
        			]
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
          plugins: [require("tailwindcss-animate")]
      }
      "
    `)
  })

  it("should drop shorthand and method properties inside the theme when merging", async () => {
    const input = `const fontFamily = { sans: ["Inter"] }

module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    fontFamily,
    extend: {
      spacing(base) {
        return base
      },
    },
  },
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    // Current behavior: only property assignments survive the theme merge.
    expect(output).toMatchInlineSnapshot(`
      "const fontFamily = { sans: ["Inter"] }

      module.exports = {
          darkMode: ["class"],
          content: ["./app/**/*.{js,jsx}"],
        theme: {
        	extend: {
        		colors: {
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
          plugins: [require("tailwindcss-animate")]
      }
      "
    `)
  })

  it("should drop comments inside the theme when merging", async () => {
    const input = `module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    // Brand colors.
    extend: {
      colors: {
        brand: "#ff0000", // primary brand
      },
    },
  },
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    // Current behavior: the theme object is reprinted, so its comments are lost.
    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
          darkMode: ["class"],
          content: ["./app/**/*.{js,jsx}"],
        theme: {
        	extend: {
        		colors: {
        			brand: '#ff0000',
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
          plugins: [require("tailwindcss-animate")]
      }
      "
    `)
  })

  it("should not merge into a theme function", async () => {
    const input = `module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: ({ theme }) => ({
    extend: {
      colors: theme("colors"),
    },
  }),
}
`
    const output = await transformTailwindConfig(
      input,
      SHADCN_TAILWIND_CONFIG,
      configWithPath("tailwind.config.js")
    )

    expect(output).toMatchInlineSnapshot(`
      "module.exports = {
          darkMode: ["class"],
          content: ["./app/**/*.{js,jsx}"],
        theme: ({ theme }) => ({
          extend: {
            colors: theme("colors"),
          },
        }),
          plugins: [require("tailwindcss-animate")]
      }
      "
    `)
  })

  it("should throw when theme is a shorthand property", async () => {
    const input = `const theme = { extend: {} }

module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme,
}
`
    // Current behavior: a shorthand theme property is not supported and throws.
    await expect(
      transformTailwindConfig(
        input,
        SHADCN_TAILWIND_CONFIG,
        configWithPath("tailwind.config.js")
      )
    ).rejects.toThrow()
  })
})

describe("updateTailwindConfig", () => {
  let cwd: string

  const INPUT = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`

  function configFor(file: string) {
    return {
      ...SHARED_CONFIG,
      resolvedPaths: {
        ...SHARED_CONFIG.resolvedPaths,
        cwd,
        tailwindConfig: path.join(cwd, file),
      },
    } as any
  }

  beforeEach(async () => {
    cwd = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-tailwind-config-"))
    vi.mocked(spinner).mockClear()
  })

  afterEach(async () => {
    await fs.rm(cwd, { recursive: true, force: true })
  })

  it("should do nothing without a tailwind config", async () => {
    // The config file does not exist, so reading it would throw.
    await updateTailwindConfig(undefined, configFor("tailwind.config.ts"), {})

    expect(spinner).not.toHaveBeenCalled()
  })

  it("should do nothing for tailwind v4", async () => {
    await updateTailwindConfig(
      SHADCN_TAILWIND_CONFIG,
      configFor("tailwind.config.ts"),
      { tailwindVersion: "v4" }
    )

    expect(spinner).not.toHaveBeenCalled()
  })

  it("should default to v3 and write the transformed config", async () => {
    await fs.writeFile(path.join(cwd, "tailwind.config.ts"), INPUT, "utf8")

    await updateTailwindConfig(
      SHADCN_TAILWIND_CONFIG,
      configFor("tailwind.config.ts"),
      { silent: true }
    )

    const written = await fs.readFile(
      path.join(cwd, "tailwind.config.ts"),
      "utf8"
    )
    expect(written).toBe(
      await transformTailwindConfig(
        INPUT,
        SHADCN_TAILWIND_CONFIG,
        configFor("tailwind.config.ts")
      )
    )
    expect(written).toMatchInlineSnapshot(`
      "import type { Config } from "tailwindcss"

      const config: Config = {
          darkMode: ["class"],
          content: ["./app/**/*.{ts,tsx}"],
        theme: {
        	extend: {
        		colors: {
        			border: 'hsl(var(--border))',
        			primary: {
        				DEFAULT: 'hsl(var(--primary))',
        				foreground: 'hsl(var(--primary-foreground))'
        			}
        		},
        		borderRadius: {
        			lg: 'var(--radius)'
        		}
        	}
        },
        plugins: [require("tailwindcss-animate")],
      }
      export default config
      "
    `)
    expect(spinner).toHaveBeenCalledWith(
      `Updating ${highlighter.info("tailwind.config.ts")}`,
      { silent: true }
    )
    expect(
      vi.mocked(spinner).mock.results[0].value.succeed
    ).toHaveBeenCalledTimes(1)
  })

  it("should update a nested .js config and default silent to false", async () => {
    const input = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  plugins: [],
}
`
    await fs.mkdir(path.join(cwd, "config"))
    await fs.writeFile(path.join(cwd, "config/tailwind.config.js"), input)

    await updateTailwindConfig(
      { plugins: ['require("tailwindcss-animate")'] },
      configFor("config/tailwind.config.js"),
      { tailwindVersion: "v3" }
    )

    expect(
      await fs.readFile(path.join(cwd, "config/tailwind.config.js"), "utf8")
    ).toMatchInlineSnapshot(`
      "/** @type {import('tailwindcss').Config} */
      module.exports = {
          darkMode: ['class'],
          content: ['./src/**/*.{js,jsx}'],
        plugins: [require("tailwindcss-animate")],
      }
      "
    `)
    expect(spinner).toHaveBeenCalledWith(
      `Updating ${highlighter.info(path.join("config", "tailwind.config.js"))}`,
      { silent: false }
    )
  })

  it("should reject when the config file is missing", async () => {
    await expect(
      updateTailwindConfig(
        SHADCN_TAILWIND_CONFIG,
        configFor("tailwind.config.ts"),
        { silent: true }
      )
    ).rejects.toThrow(/ENOENT/)
  })
})
