import { API, FileInfo } from "jscodeshift"

const COLOR_MAPPING = {
  background: {
    light: "white",
    dark: "slate-950",
  },
  foreground: {
    light: "slate-950",
    dark: "slate-50",
  },
  muted: {
    light: "slate-100",
    dark: "slate-800",
  },
  "muted-foreground": {
    light: "slate-500",
    dark: "slate-400",
  },
  popover: {
    light: "white",
    dark: "slate-950",
  },
  "popover-foreground": {
    light: "slate-950",
    dark: "slate-50",
  },
  border: {
    light: "slate-200",
    dark: "slate-800",
  },
  "border-input": {
    light: "slate-200",
    dark: "slate-800",
  },
  card: {
    light: "white",
    dark: "slate-950",
  },
  "card-foreground": {
    light: "slate-950",
    dark: "slate-50",
  },
  primary: {
    light: "slate-900",
    dark: "slate-50",
  },
  "primary-foreground": {
    light: "slate-50",
    dark: "slate-900",
  },
  secondary: {
    light: "slate-100",
    dark: "slate-800",
  },
  "secondary-foreground": {
    light: "slate-900",
    dark: "slate-50",
  },
  accent: {
    light: "slate-100",
    dark: "slate-800",
  },
  "accent-foreground": {
    light: "slate-900",
    dark: "slate-50",
  },
  destructive: {
    light: "red-500",
    dark: "red-900",
  },
  "destructive-foreground": {
    light: "slate-50",
    dark: "red-50",
  },
  ring: {
    light: "slate-400",
    dark: "slate-800",
  },
}

const PREFIXES = ["bg-", "text-", "border-", "ring-", "ring-offset-"]

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift.withParser("tsx")

  // Replace bg-background with "bg-white dark:bg-slate-950"
  const $j = j(file.source)
  return $j
    .find(j.JSXAttribute, {
      name: {
        name: "className",
      },
    })
    .forEach((path) => {
      const { node } = path
      if (node?.value?.type) {
        if (node.value.type === "StringLiteral") {
          node.value.value = applyColorMapping(node.value.value)
          console.log(node.value.value)
        }

        if (
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "CallExpression"
        ) {
          const callee = node.value.expression.callee
          if (callee.type === "Identifier" && callee.name === "cn") {
            node.value.expression.arguments.forEach((arg) => {
              if (arg.type === "StringLiteral") {
                arg.value = applyColorMapping(arg.value)
              }

              if (
                arg.type === "LogicalExpression" &&
                arg.right.type === "StringLiteral"
              ) {
                arg.right.value = applyColorMapping(arg.right.value)
              }
            })
          }
        }
      }
    })
    .toSource()
}

// export function splitClassName(input: string): (string | null)[] {
//   const parts = input.split(":")
//   const classNames = parts.map((part) => {
//     const match = part.match(/^\[?(.+)\]$/)
//     if (match) {
//       return match[1]
//     } else {
//       return null
//     }
//   })

//   return classNames
// }

export function splitClassName(className: string): (string | null)[] {
  const parts: (string | null)[] = []
  const regex = /^(.*?:)?([^/]+)(?:\/(.+))?$/

  const match = className.match(regex)
  if (match) {
    const [, prefix, baseClass, suffix] = match
    parts.push(prefix ? prefix.slice(0, -1) : null)
    parts.push(baseClass)
    parts.push(suffix || null)
  } else {
    parts.push(null, null, null)
  }

  return parts
}

export function glueClassName(input: (string | null)[]): string {
  const classNames = input.map((value) => {
    if (value === null) {
      return ""
    } else {
      return value
    }
  })

  return classNames.filter((className) => className !== "").join(":")
}

export function applyColorMapping(input: string) {
  console.log(`Input: ${input}`)
  // First we split the string by spaces.
  const classNames = input.split(" ")

  // Next we loop and split each class by the colon.
  const splitClassNames = classNames.map((className) =>
    splitClassName(className)
  )

  console.log({ splitClassNames })

  // Now we can loop through each class and apply the color mapping.
  const darkMode: string[] = []
  const result = []
  for (const className of splitClassNames) {
    const [variant, value, modifier] = className

    for (const PREFIX of PREFIXES) {
      for (const [key, { light, dark }] of Object.entries(COLOR_MAPPING)) {
        const needle = `${PREFIX}${key}`

        if (value?.startsWith(needle)) {
          result.push(
            [
              variant,
              value.replace(needle, `${PREFIX}${light}`),
              modifier,
            ].join(":")
          )
          darkMode.push([variant, `dark:${PREFIX}${dark}`, modifier].join(":"))
        }
      }
    }
  }

  // Finally we join the classes back together.
  const output = result.join(" ") + " " + darkMode.join(" ")

  console.log(`Output: ${output}`)
  console.log("")
  console.log("")

  return output
}
