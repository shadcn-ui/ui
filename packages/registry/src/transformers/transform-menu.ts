import {
  getJsxAttributes,
  setJsxAttributeInitializer,
} from "@/src/codemod/jsx-attributes"
import { getText, parseTransformInput } from "@/src/codemod/parse"
import { type Transformer } from "@/src/transformers"
import { twMerge } from "cn"

// Hardcoded translucent classes inlined at install time.
const TRANSLUCENT_CLASSES =
  "animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!"

// Transforms cn-menu-target and cn-menu-translucent classes based on config.menuColor.
// If menuColor is "inverted", replaces cn-menu-target with "dark" and removes cn-menu-translucent.
// If menuColor is "default-translucent", removes cn-menu-target and inlines cn-menu-translucent styles.
// If menuColor is "inverted-translucent", replaces cn-menu-target with "dark" and inlines cn-menu-translucent styles.
// Otherwise, removes both cn-menu-target and cn-menu-translucent.
export const transformMenu: Transformer = (code, { config }) => {
  const menuColor = config.menuColor
  const isTranslucent =
    menuColor === "default-translucent" || menuColor === "inverted-translucent"

  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // Each edit parses the code again, and finds the attributes by index, which
  // the edits do not change.
  let attributes = getJsxAttributes(file)
  for (let index = 0; index < attributes.length; index++) {
    const { attribute } = attributes[index]
    const attrName = getText(code, attribute.name)
    if (attrName !== "className") {
      continue
    }

    const initializer = attribute.value
    if (!initializer) {
      continue
    }

    const text = getText(code, initializer)
    if (
      !text.includes("cn-menu-target") &&
      !text.includes("cn-menu-translucent")
    ) {
      continue
    }

    let newText = text
    let needsCleanup = false

    if (menuColor === "inverted" || menuColor === "inverted-translucent") {
      newText = newText.replace(/cn-menu-target/g, "dark")
    } else {
      newText = newText.replace(/cn-menu-target/g, "")
      needsCleanup = true
    }

    if (isTranslucent) {
      newText = newText.replace(
        /"([^"]*cn-menu-translucent[^"]*)"/g,
        (_, classes) => {
          const merged = twMerge(classes, TRANSLUCENT_CLASSES)
          return `"${merged.replace(/\s*\bcn-menu-translucent\b\s*/g, " ").trim()}"`
        }
      )
    } else if (newText.includes("cn-menu-translucent")) {
      newText = newText.replace(/cn-menu-translucent/g, "")
      needsCleanup = true
    }

    if (needsCleanup) {
      newText = newText.replace(/\s{2,}/g, " ")
      newText = newText.replace(/"\s+/g, '"')
      newText = newText.replace(/\s+"/g, '"')
      // Clean up empty strings in cn() calls.
      newText = newText.replace(/,\s*""\s*,/g, ",")
      newText = newText.replace(/\(\s*""\s*,/g, "(")
      newText = newText.replace(/,\s*""\s*\)/g, ")")
    }

    code = setJsxAttributeInitializer(code, attribute, newText)

    // ts-morph forgets the nodes in the initializer it replaced, and throws
    // when the loop gets to an attribute that was in there.
    const next = attributes[index + 1]
    if (next && next.attribute.start! < initializer.end!) {
      throw new Error(
        "Attempted to get information from a node that was removed or forgotten."
      )
    }

    attributes = getJsxAttributes(parseTransformInput(code)!)
  }

  return code
}
