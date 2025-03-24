import { UnistNode, UnistTree } from "types/unist"
import { visit } from "unist-util-visit"

export function rehypeNpmCommand() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return
      }

      // npm install.
      if (node.properties?.["__rawString__"]?.startsWith("npm install")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm install",
          "yarn add"
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm install",
          "pnpm add"
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npm install",
          "bun add"
        )
        node.properties["__denoCommand__"] = 'deno add ' + (npmCommand
          .split(' ').slice(2).map((arg) => arg.startsWith('-') ? arg : 'npm:' + arg).join(' '))
      }

      // npx create-.
      if (node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npx create-",
          "yarn create "
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npx create-",
          "pnpm create "
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npx",
          "bunx --bun"
        )
        node.properties["__denoCommand__"] = npmCommand.replace(
          "npx ",
          "deno run -A npm:"
        )
      }

      // npm create.
      if (node.properties?.["__rawString__"]?.startsWith("npm create")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm create",
          "yarn create"
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm create",
          "pnpm create"
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npm create",
          "bun create"
        )
        node.properties["__denoCommand__"] = npmCommand.replace(
          "npm create ",
          "deno run -A npm:create-"
        )
      }

      // npx.
      if (
        node.properties?.["__rawString__"]?.startsWith("npx") &&
        !node.properties?.["__rawString__"]?.startsWith("npx create-")
      ) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npx",
          "pnpm dlx"
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npx",
          "bunx --bun"
        )
        node.properties["__denoCommand__"] = npmCommand.replace(
          "npx ",
          "deno run -A npm:"
        )
      }

      // npm run.
      if (node.properties?.["__rawString__"]?.startsWith("npm run")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm run",
          "yarn"
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm run",
          "pnpm"
        )
        node.properties["__bunCommand__"] = npmCommand.replace("npm run", "bun")
        node.properties["__denoCommand__"] = npmCommand.replace("npm run", "deno task")
      }
    })
  }
}
