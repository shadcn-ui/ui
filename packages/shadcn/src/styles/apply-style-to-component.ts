import {
  Node,
  Project,
  ScriptKind,
  type CallExpression,
  type JsxAttribute,
  type SourceFile,
} from "ts-morph"

import { type StyleMap } from "./parse-style"

export interface ApplyStyleToComponentParams {
  source: string
  styleMap: StyleMap
}

export function applyStyleToComponent({
  source,
  styleMap,
}: ApplyStyleToComponentParams) {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  const matchedClasses = new Set<string>()

  ensureCnImport(sourceFile)

  applyToCvaCalls(sourceFile, styleMap, matchedClasses)
  applyToClassNameAttributes(sourceFile, styleMap, matchedClasses)

  return sourceFile.getFullText()
}

function applyToCvaCalls(
  sourceFile: SourceFile,
  styleMap: StyleMap,
  matchedClasses: Set<string>
) {
  sourceFile.forEachDescendant((node) => {
    if (!Node.isCallExpression(node)) {
      return
    }

    const expression = node.getExpression()
    if (!Node.isIdentifier(expression) || expression.getText() !== "cva") {
      return
    }

    const baseArg = node.getArguments()[0]
    if (Node.isStringLiteral(baseArg)) {
      const baseString = baseArg.getLiteralText()
      const cnClass = extractCnClass(baseString)
      if (cnClass) {
        if (styleMap[cnClass]) {
          const updated = removeCnClasses(
            mergeClasses(styleMap[cnClass], baseString)
          )
          baseArg.setLiteralValue(updated)
          matchedClasses.add(cnClass)
        } else {
          // Remove cn-* class even if no styles match
          const updated = removeCnClasses(baseString)
          baseArg.setLiteralValue(updated)
        }
      }
    }

    const configArg = node.getArguments()[1]
    if (!configArg || !Node.isObjectLiteralExpression(configArg)) {
      return
    }

    const variantsProp = configArg
      .getProperties()
      .find(
        (prop) =>
          Node.isPropertyAssignment(prop) &&
          Node.isIdentifier(prop.getNameNode()) &&
          prop.getNameNode().getText() === "variants"
      )

    if (!variantsProp || !Node.isPropertyAssignment(variantsProp)) {
      return
    }

    const variantsObj = variantsProp.getInitializer()
    if (!variantsObj || !Node.isObjectLiteralExpression(variantsObj)) {
      return
    }

    variantsObj.getProperties().forEach((typeProp) => {
      if (!Node.isPropertyAssignment(typeProp)) {
        return
      }

      const typeObj = typeProp.getInitializer()
      if (!typeObj || !Node.isObjectLiteralExpression(typeObj)) {
        return
      }

      typeObj.getProperties().forEach((variantProp) => {
        if (!Node.isPropertyAssignment(variantProp)) {
          return
        }

        const variantValue = variantProp.getInitializer()
        if (!variantValue || !Node.isStringLiteral(variantValue)) {
          return
        }

        const variantString = variantValue.getLiteralText()
        const cnClass = extractCnClass(variantString)
        if (cnClass) {
          if (styleMap[cnClass]) {
            const updated = removeCnClasses(
              mergeClasses(styleMap[cnClass], variantString)
            )
            variantValue.setLiteralValue(updated)
            matchedClasses.add(cnClass)
          } else {
            // Remove cn-* class even if no styles match
            const updated = removeCnClasses(variantString)
            variantValue.setLiteralValue(updated)
          }
        }
      })
    })
  })
}

function applyToClassNameAttributes(
  sourceFile: SourceFile,
  styleMap: StyleMap,
  matchedClasses: Set<string>
) {
  sourceFile.forEachDescendant((node) => {
    if (
      !Node.isJsxAttribute(node) ||
      node.getNameNode().getText() !== "className"
    ) {
      return
    }

    const initializer = node.getInitializer()
    if (!initializer) {
      return
    }

    const cnClasses = extractCnClassesFromAttribute(initializer)

    if (cnClasses.length === 0) {
      return
    }

    const jsxElement = node.getParent()?.getParent()
    if (
      !jsxElement ||
      (!Node.isJsxOpeningElement(jsxElement) &&
        !Node.isJsxSelfClosingElement(jsxElement))
    ) {
      return
    }

    // Collect all tailwind classes for all cn-* classes found
    const tailwindClassesToApply: string[] = []
    const classesToMark: string[] = []

    for (const cnClass of cnClasses) {
      if (matchedClasses.has(cnClass)) {
        continue
      }

      const tailwindClasses = styleMap[cnClass]
      if (tailwindClasses) {
        tailwindClassesToApply.push(tailwindClasses)
      }
      classesToMark.push(cnClass)
    }

    // Apply tailwind classes if any
    if (tailwindClassesToApply.length > 0) {
      const mergedClasses = tailwindClassesToApply.join(" ")
      applyClassesToElement(jsxElement, mergedClasses)
    } else {
      // Even if no styles match, we still need to clean up cn-* classes
      cleanCnClassesFromAttribute(initializer)
    }

    // Mark all classes as matched
    for (const cnClass of classesToMark) {
      matchedClasses.add(cnClass)
    }
  })
}

function extractCnClassesFromAttribute(initializer: Node) {
  const classes: string[] = []

  if (
    Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    return extractCnClasses(initializer.getLiteralText())
  }

  if (!Node.isJsxExpression(initializer)) {
    return classes
  }

  const expression = initializer.getExpression()
  if (!expression) {
    return classes
  }

  if (
    Node.isStringLiteral(expression) ||
    Node.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return extractCnClasses(expression.getLiteralText())
  }

  if (Node.isCallExpression(expression) && isCnCall(expression)) {
    for (const argument of expression.getArguments()) {
      if (
        Node.isStringLiteral(argument) ||
        Node.isNoSubstitutionTemplateLiteral(argument)
      ) {
        classes.push(...extractCnClasses(argument.getLiteralText()))
      }
    }
  }

  return classes
}

function cleanCnClassesFromAttribute(initializer: Node) {
  if (
    Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    const cleaned = removeCnClasses(initializer.getLiteralText())
    initializer.setLiteralValue(cleaned)
    return
  }

  if (!Node.isJsxExpression(initializer)) {
    return
  }

  const expression = initializer.getExpression()
  if (!expression) {
    return
  }

  if (
    Node.isStringLiteral(expression) ||
    Node.isNoSubstitutionTemplateLiteral(expression)
  ) {
    const cleaned = removeCnClasses(expression.getLiteralText())
    expression.setLiteralValue(cleaned)
    return
  }

  if (Node.isCallExpression(expression) && isCnCall(expression)) {
    // Clean cn-* classes from all string literal arguments
    for (const argument of expression.getArguments()) {
      if (
        Node.isStringLiteral(argument) ||
        Node.isNoSubstitutionTemplateLiteral(argument)
      ) {
        const cleaned = removeCnClasses(argument.getLiteralText())
        argument.setLiteralValue(cleaned)
      }
    }

    // Remove empty string arguments
    removeEmptyArgumentsFromCnCall(expression)
  }
}

function extractCnClasses(str: string) {
  const matches = str.matchAll(/\bcn-[\w-]+\b/g)
  return Array.from(matches, (match) => match[0])
}

function extractCnClass(str: string) {
  const classes = extractCnClasses(str)
  return classes[0] ?? null
}

function removeCnClasses(str: string) {
  return str
    .replace(/\bcn-[\w-]+\b/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function removeEmptyArgumentsFromCnCall(callExpression: CallExpression) {
  if (!isCnCall(callExpression)) {
    return
  }

  // Get arguments and filter out empty string literals
  const args = callExpression.getArguments()
  const nonEmptyArgs = args.filter((arg) => {
    if (
      Node.isStringLiteral(arg) ||
      Node.isNoSubstitutionTemplateLiteral(arg)
    ) {
      const text = arg.getLiteralText().trim()
      return text !== ""
    }
    return true
  })

  // Only rebuild if we removed some arguments
  if (nonEmptyArgs.length !== args.length) {
    const argTexts = nonEmptyArgs.map((arg) => arg.getText())
    const parent = callExpression.getParent()
    if (parent && Node.isJsxExpression(parent)) {
      parent.replaceWithText(`{cn(${argTexts.join(", ")})}`)
    } else {
      callExpression.replaceWithText(`cn(${argTexts.join(", ")})`)
    }
  }
}

function applyClassesToElement(element: Node, tailwindClasses: string) {
  if (
    !Node.isJsxOpeningElement(element) &&
    !Node.isJsxSelfClosingElement(element)
  ) {
    return
  }

  const attribute = element
    .getAttributes()
    .find(
      (attr) =>
        Node.isJsxAttribute(attr) &&
        attr.getNameNode().getText() === "className"
    )

  if (!attribute || !Node.isJsxAttribute(attribute)) {
    ensureCnImport(element.getSourceFile())
    element.addAttribute({
      name: "className",
      initializer: `{cn(${JSON.stringify(tailwindClasses)})}`,
    })
    return
  }

  const initializer = attribute.getInitializer()

  if (!initializer) {
    ensureCnImport(element.getSourceFile())
    attribute.setInitializer(`{cn(${JSON.stringify(tailwindClasses)})}`)
    return
  }

  if (
    Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    const existing = initializer.getLiteralText()
    const updated = removeCnClasses(mergeClasses(tailwindClasses, existing))
    initializer.setLiteralValue(updated)
    return
  }

  if (!Node.isJsxExpression(initializer)) {
    return
  }

  const expression = initializer.getExpression()

  if (!expression) {
    ensureCnImport(element.getSourceFile())
    attribute.setInitializer(`{cn(${JSON.stringify(tailwindClasses)})}`)
    return
  }

  if (
    Node.isStringLiteral(expression) ||
    Node.isNoSubstitutionTemplateLiteral(expression)
  ) {
    const existing = expression.getLiteralText()
    const updated = removeCnClasses(mergeClasses(tailwindClasses, existing))
    expression.setLiteralValue(updated)
    return
  }

  if (Node.isCallExpression(expression) && isCnCall(expression)) {
    const firstArg = expression.getArguments()[0]
    if (
      Node.isStringLiteral(firstArg) ||
      Node.isNoSubstitutionTemplateLiteral(firstArg)
    ) {
      const existing = firstArg.getLiteralText()
      const updated = removeCnClasses(mergeClasses(tailwindClasses, existing))
      firstArg.setLiteralValue(updated)

      // Clean cn-* classes from all other string literal arguments
      for (let i = 1; i < expression.getArguments().length; i++) {
        const arg = expression.getArguments()[i]
        if (
          Node.isStringLiteral(arg) ||
          Node.isNoSubstitutionTemplateLiteral(arg)
        ) {
          const argText = arg.getLiteralText()
          const cleaned = removeCnClasses(argText)
          if (cleaned !== argText) {
            arg.setLiteralValue(cleaned)
          }
        }
      }

      // Remove empty string arguments
      removeEmptyArgumentsFromCnCall(expression)
      return
    }

    const argumentTexts = expression
      .getArguments()
      .map((argument) => {
        if (
          Node.isStringLiteral(argument) ||
          Node.isNoSubstitutionTemplateLiteral(argument)
        ) {
          const cleaned = removeCnClasses(argument.getLiteralText())
          return cleaned ? JSON.stringify(cleaned) : null
        }
        return argument.getText()
      })
      .filter((arg): arg is string => arg !== null)

    const updatedArguments = [JSON.stringify(tailwindClasses), ...argumentTexts]

    attribute.setInitializer(`{cn(${updatedArguments.join(", ")})}`)
    return
  }

  ensureCnImport(element.getSourceFile())
  attribute.setInitializer(
    `{cn(${JSON.stringify(tailwindClasses)}, ${expression.getText()})}`
  )
}

function mergeClasses(newClasses: string, existing: string) {
  const existingParts = existing.split(/\s+/).filter(Boolean)
  const newParts = newClasses.split(/\s+/).filter(Boolean)
  const combined = [...newParts, ...existingParts]
  return combined.join(" ").trim()
}

function getAttributeStringValue(attribute: JsxAttribute) {
  const initializer = attribute.getInitializer()

  if (!initializer) {
    return null
  }

  if (
    Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    return initializer.getLiteralText()
  }

  if (!Node.isJsxExpression(initializer)) {
    return null
  }

  const expression = initializer.getExpression()

  if (!expression) {
    return null
  }

  if (
    Node.isStringLiteral(expression) ||
    Node.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.getLiteralText()
  }

  return null
}

function isCnCall(call: CallExpression) {
  const expression = call.getExpression()
  return Node.isIdentifier(expression) && expression.getText() === "cn"
}

function ensureCnImport(sourceFile: SourceFile) {
  const existingImport = sourceFile
    .getImportDeclarations()
    .find(
      (declaration) => declaration.getModuleSpecifierValue() === "@/lib/utils"
    )

  if (!existingImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "@/lib/utils",
      namedImports: [{ name: "cn" }],
    })
    return
  }

  const hasCn = existingImport
    .getNamedImports()
    .some((namedImport) => namedImport.getName() === "cn")

  if (hasCn) {
    return
  }

  if (existingImport.getNamespaceImport()) {
    return
  }

  existingImport.addNamedImport({ name: "cn" })
}
