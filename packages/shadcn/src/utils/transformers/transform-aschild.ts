import { Transformer } from "@/src/utils/transformers"
import {
  ImportDeclaration,
  JsxAttribute,
  JsxElement,
  Node,
  SourceFile,
  SyntaxKind,
  type Identifier,
  type JsxAttributeLike,
} from "ts-morph"

const ELEMENTS_REQUIRING_NATIVE_BUTTON_FALSE = [
  "a",
  "span",
  "div",
  "Link",
  "label",
  "Label",
]

const BUTTON_BEHAVIOR_PROPS: readonly string[] = [
  "disabled",
  "focusableWhenDisabled",
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "name",
  "type",
  "value",
]

const BUTTON_ONLY_PROPS = [
  "asChild",
  ...BUTTON_BEHAVIOR_PROPS,
  "nativeButton",
] as const

interface TransformInfo {
  parentElement: JsxElement
  parentTagName: string
  childTagName: string
  childProps: string
  childChildren: string
  needsNativeButton: boolean
  link?: {
    attributes?: string
    buttonLocalName: string
    helperName?: string
  }
}

interface ButtonLinkHelper {
  buttonVariants: string
  helperName: string
  propsName: string
}

const ROUTER_LINK_MODULES = new Set([
  "@remix-run/react",
  "@tanstack/react-router",
  "expo-router",
  "gatsby",
  "next-view-transitions",
  "next/link",
  "react-router",
  "react-router-dom",
])

const ROUTER_LINK_EXPORTS = new Set(["Link", "NavLink"])

export const transformAsChild: Transformer = async ({ sourceFile, config }) => {
  if (!config.style?.startsWith("base-")) {
    return sourceFile
  }

  if (!config.tsx) {
    sourceFile.getProject().compilerOptions.set({ allowJs: true })
  }

  const convertedButtons = new Set<string>()
  let buttonLinkHelper: ButtonLinkHelper | undefined
  const uiButtonImport = `${
    config.aliases.ui ?? `${config.aliases.components}/ui`
  }/button`.replace(/\/{2,}/g, "/")
  const MAX_ITERATIONS = 10
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
    const asChildElements = jsxElements.filter((el) =>
      el.getOpeningElement().getAttribute("asChild")
    )

    if (asChildElements.length === 0) {
      break
    }

    const leafElements = asChildElements.filter((el) => {
      const descendants = el.getDescendantsOfKind(SyntaxKind.JsxElement)
      return !descendants.some((d) =>
        d.getOpeningElement().getAttribute("asChild")
      )
    })

    const transformations: TransformInfo[] = []

    for (const jsxElement of leafElements) {
      const openingElement = jsxElement.getOpeningElement()
      const asChildAttr = openingElement.getAttribute("asChild")

      if (!asChildAttr) {
        continue
      }

      const parentTagNode = openingElement.getTagNameNode()
      const parentTagName = parentTagNode.getText()
      const children = jsxElement.getJsxChildren()
      const childElement = children.find(
        (child) =>
          child.getKind() === SyntaxKind.JsxElement ||
          child.getKind() === SyntaxKind.JsxSelfClosingElement
      )

      if (!childElement) {
        asChildAttr.remove()
        continue
      }

      let childTagName: string
      let childTagNode: Node
      let childProps: string
      let childChildren: string
      let childAttributes: JsxAttributeLike[]

      if (childElement.getKind() === SyntaxKind.JsxSelfClosingElement) {
        const selfClosing = childElement.asKindOrThrow(
          SyntaxKind.JsxSelfClosingElement
        )
        childTagNode = selfClosing.getTagNameNode()
        childTagName = childTagNode.getText()
        childAttributes = selfClosing.getAttributes()
        childProps = childAttributes.map((attr) => attr.getText()).join(" ")
        childChildren = ""
      } else {
        const jsxChild = childElement.asKindOrThrow(SyntaxKind.JsxElement)
        const openingEl = jsxChild.getOpeningElement()
        childTagNode = openingEl.getTagNameNode()
        childTagName = childTagNode.getText()
        childAttributes = openingEl.getAttributes()
        childProps = childAttributes.map((attr) => attr.getText()).join(" ")
        childChildren = jsxChild
          .getJsxChildren()
          .map((c) => c.getText())
          .join("")
      }

      const buttonImport = findButtonImport(parentTagNode, uiButtonImport)
      const isLink = isLinkElement(childTagNode, childAttributes)

      // Base UI Button always applies button semantics, so links must own the
      // final element and receive only the Button's visual variants.
      if (buttonImport && isLink) {
        const moduleSpecifier = buttonImport.getModuleSpecifierValue()
        const buttonVariants = ensureValueImport(
          sourceFile,
          moduleSpecifier,
          "buttonVariants",
          buttonImport
        )
        let helper: ButtonLinkHelper | undefined

        if (
          requiresButtonLinkHelper(
            openingElement.getAttributes(),
            childAttributes
          )
        ) {
          helper = buttonLinkHelper

          if (!helper) {
            const helperName = getAvailableComponentIdentifier(
              sourceFile,
              "ButtonLink"
            )
            helper = {
              buttonVariants,
              helperName,
              propsName: getAvailableIdentifier(
                sourceFile,
                `${helperName}Props`
              ),
            }
            buttonLinkHelper = helper
          }
        }

        transformations.push({
          parentElement: jsxElement,
          parentTagName,
          childTagName,
          childProps,
          childChildren,
          needsNativeButton: false,
          link: {
            attributes: helper
              ? undefined
              : buildLinkAttributes(
                  openingElement.getAttributes(),
                  childAttributes,
                  buttonVariants
                ),
            buttonLocalName: parentTagName,
            helperName: helper?.helperName,
          },
        })
        continue
      }

      const needsNativeButton =
        Boolean(buttonImport) &&
        ELEMENTS_REQUIRING_NATIVE_BUTTON_FALSE.includes(childTagName) &&
        !openingElement.getAttribute("nativeButton")

      transformations.push({
        parentElement: jsxElement,
        parentTagName,
        childTagName,
        childProps,
        childChildren,
        needsNativeButton,
      })
    }

    if (transformations.length === 0) {
      break
    }

    for (const info of transformations.reverse()) {
      if (info.link) {
        let newElementText: string
        if (info.link.helperName) {
          const openingElement = info.parentElement.getOpeningElement()
          const existingAttrs = openingElement
            .getAttributes()
            .filter((attribute) => {
              if (attribute.getKind() !== SyntaxKind.JsxAttribute) {
                return true
              }

              const name = attribute
                .asKindOrThrow(SyntaxKind.JsxAttribute)
                .getNameNode()
                .getText()
              return name !== "asChild" && name !== "nativeButton"
            })
            .map((attribute) => attribute.getText())
            .join(" ")
          const renderValue = info.childProps
            ? `{<${info.childTagName} ${info.childProps} />}`
            : `{<${info.childTagName} />}`
          const attributes = existingAttrs ? `${existingAttrs} ` : ""
          newElementText = `<${info.link.helperName} ${attributes}render=${renderValue}>${info.childChildren}</${info.link.helperName}>`
        } else {
          const attributes = info.link.attributes
            ? ` ${info.link.attributes}`
            : ""
          newElementText = `<${info.childTagName}${attributes}>${info.childChildren}</${info.childTagName}>`
        }

        info.parentElement.replaceWithText(newElementText)
        convertedButtons.add(info.link.buttonLocalName)
        continue
      }

      const openingElement = info.parentElement.getOpeningElement()
      const existingAttrs = openingElement
        .getAttributes()
        .filter((attr) => {
          if (attr.getKind() === SyntaxKind.JsxAttribute) {
            const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
            return jsxAttr.getNameNode().getText() !== "asChild"
          }
          return true
        })
        .map((attr) => attr.getText())
        .join(" ")

      const renderValue = info.childProps
        ? `{<${info.childTagName} ${info.childProps} />}`
        : `{<${info.childTagName} />}`

      let newAttrs = existingAttrs ? `${existingAttrs} ` : ""
      newAttrs += `render=${renderValue}`
      if (info.needsNativeButton) {
        newAttrs += ` nativeButton={false}`
      }

      const newElementText = `<${info.parentTagName} ${newAttrs}>${info.childChildren}</${info.parentTagName}>`
      info.parentElement.replaceWithText(newElementText)
    }
  }

  if (buttonLinkHelper) {
    insertButtonLinkHelper(sourceFile, buttonLinkHelper)
  }

  convertedButtons.forEach((localName) => {
    removeUnusedButtonImport(sourceFile, uiButtonImport, localName)
  })

  return sourceFile
}

function findButtonImport(tagNameNode: Node, moduleSpecifier: string) {
  if (!Node.isIdentifier(tagNameNode)) {
    return undefined
  }

  const specifier = getImportBinding(tagNameNode)
  if (!Node.isImportSpecifier(specifier)) {
    return undefined
  }

  const declaration = specifier?.getImportDeclaration()

  return specifier.getName() === "Button" &&
    declaration?.getModuleSpecifierValue() === moduleSpecifier
    ? declaration
    : undefined
}

function isLinkElement(tagNameNode: Node, attributes: JsxAttributeLike[]) {
  const hasSpread = attributes.some(Node.isJsxSpreadAttribute)
  const attributeNames = new Set(
    attributes
      .filter(Node.isJsxAttribute)
      .map((attribute) => attribute.getNameNode().getText())
  )

  if (tagNameNode.getText() === "a") {
    return attributeNames.has("href") || hasSpread
  }

  if (!attributeNames.has("href") && !attributeNames.has("to") && !hasSpread) {
    return false
  }

  if (Node.isIdentifier(tagNameNode)) {
    const binding = getImportBinding(tagNameNode)
    const declaration = binding?.getFirstAncestorByKind(
      SyntaxKind.ImportDeclaration
    )

    if (
      !declaration ||
      !ROUTER_LINK_MODULES.has(declaration.getModuleSpecifierValue())
    ) {
      return false
    }

    return (
      (Node.isImportClause(binding) &&
        declaration.getDefaultImport()?.getText() === tagNameNode.getText()) ||
      (Node.isImportSpecifier(binding) &&
        ROUTER_LINK_EXPORTS.has(binding.getName()))
    )
  }

  if (Node.isPropertyAccessExpression(tagNameNode)) {
    const namespace = tagNameNode.getExpression()
    const binding = Node.isIdentifier(namespace)
      ? getImportBinding(namespace)
      : undefined
    const declaration = binding?.getFirstAncestorByKind(
      SyntaxKind.ImportDeclaration
    )

    if (!Node.isNamespaceImport(binding) || !declaration) {
      return false
    }

    return (
      ROUTER_LINK_MODULES.has(declaration.getModuleSpecifierValue()) &&
      ROUTER_LINK_EXPORTS.has(tagNameNode.getName())
    )
  }

  return false
}

function getImportBinding(identifier: Identifier) {
  return identifier.getSymbol()?.getDeclarations()[0]
}

function ensureValueImport(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importName: string,
  preferredDeclaration?: ImportDeclaration
) {
  const existingDeclaration = sourceFile
    .getImportDeclarations()
    .find(
      (declaration) =>
        declaration.getModuleSpecifierValue() === moduleSpecifier &&
        declaration
          .getNamedImports()
          .some((specifier) => specifier.getName() === importName)
    )
  const existing = existingDeclaration
    ?.getNamedImports()
    .find((specifier) => specifier.getName() === importName)

  if (existing && existingDeclaration) {
    if (existingDeclaration.isTypeOnly()) {
      existingDeclaration.setIsTypeOnly(false)
      existingDeclaration
        .getNamedImports()
        .filter((specifier) => specifier !== existing)
        .forEach((specifier) => specifier.setIsTypeOnly(true))
    }
    existing.setIsTypeOnly(false)
    return existing.getAliasNode()?.getText() ?? existing.getName()
  }

  const localName = getAvailableIdentifier(sourceFile, importName)
  const declaration =
    preferredDeclaration ??
    sourceFile
      .getImportDeclarations()
      .find(
        (item) =>
          item.getModuleSpecifierValue() === moduleSpecifier &&
          !item.isTypeOnly()
      )

  if (declaration) {
    declaration.addNamedImport(
      localName === importName
        ? importName
        : { name: importName, alias: localName }
    )
  } else {
    const importSpecifier =
      localName === importName ? importName : `${importName} as ${localName}`
    const statements = sourceFile.getStatements()
    const insertIndex = statements.reduce(
      (index, statement, statementIndex) =>
        statement.getKind() === SyntaxKind.ImportDeclaration
          ? statementIndex + 1
          : index,
      0
    )
    sourceFile.insertStatements(
      insertIndex,
      `import { ${importSpecifier} } from "${moduleSpecifier}"`
    )
  }

  return localName
}

function getAvailableIdentifier(sourceFile: SourceFile, preferred: string) {
  const identifiers = new Set(
    sourceFile
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((identifier) => identifier.getText())
  )

  if (!identifiers.has(preferred)) {
    return preferred
  }

  const fallback = `shadcn${preferred[0].toUpperCase()}${preferred.slice(1)}`
  if (!identifiers.has(fallback)) {
    return fallback
  }

  let index = 2
  while (identifiers.has(`${fallback}${index}`)) {
    index++
  }
  return `${fallback}${index}`
}

function getAvailableComponentIdentifier(
  sourceFile: SourceFile,
  preferred: string
) {
  const identifiers = new Set(
    sourceFile
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((identifier) => identifier.getText())
  )

  if (!identifiers.has(preferred)) {
    return preferred
  }

  let index = 2
  while (identifiers.has(`${preferred}${index}`)) {
    index++
  }
  return `${preferred}${index}`
}

function requiresButtonLinkHelper(
  parentAttributes: JsxAttributeLike[],
  childAttributes: JsxAttributeLike[]
) {
  if (
    [...parentAttributes, ...childAttributes].some(Node.isJsxSpreadAttribute)
  ) {
    return true
  }

  const childAttributeNames = new Set(
    childAttributes
      .filter(Node.isJsxAttribute)
      .map((attribute) => attribute.getNameNode().getText())
  )

  return parentAttributes.filter(Node.isJsxAttribute).some((attribute) => {
    const name = attribute.getNameNode().getText()
    return (
      BUTTON_BEHAVIOR_PROPS.includes(name) ||
      (childAttributeNames.has(name) &&
        (name === "ref" || name === "style" || /^on[A-Z]/.test(name)))
    )
  })
}

function buildLinkAttributes(
  parentAttributes: JsxAttributeLike[],
  childAttributes: JsxAttributeLike[],
  buttonVariants: string
) {
  const parentClassName = getAttributeValue(parentAttributes, "className")
  const childClassName = getAttributeValue(childAttributes, "className")
  const variant = getAttributeValue(parentAttributes, "variant")
  const size = getAttributeValue(parentAttributes, "size")
  const childAttributeNames = new Set(
    childAttributes
      .filter(Node.isJsxAttribute)
      .map((attribute) => attribute.getNameNode().getText())
  )
  const attributes = parentAttributes
    .filter((attribute) => {
      if (!Node.isJsxAttribute(attribute)) {
        return true
      }

      const name = attribute.getNameNode().getText()
      return (
        !["asChild", "className", "nativeButton", "size", "variant"].includes(
          name
        ) && !childAttributeNames.has(name)
      )
    })
    .map((attribute) => attribute.getText())

  if (!childAttributeNames.has("data-slot")) {
    const hasParentSlot = parentAttributes.some(
      (attribute) =>
        Node.isJsxAttribute(attribute) &&
        attribute.getNameNode().getText() === "data-slot"
    )
    if (!hasParentSlot) {
      attributes.unshift('data-slot="button"')
    }
  }

  attributes.push(
    ...childAttributes
      .filter(
        (attribute) =>
          !Node.isJsxAttribute(attribute) ||
          attribute.getNameNode().getText() !== "className"
      )
      .map((attribute) => attribute.getText())
  )

  const options = [
    variant && `variant: ${variant}`,
    size && `size: ${size}`,
    (parentClassName || childClassName) &&
      `className: [${[parentClassName, childClassName]
        .filter(Boolean)
        .join(", ")}]`,
  ].filter(Boolean)
  const call = options.length
    ? `${buttonVariants}({ ${options.join(", ")} })`
    : `${buttonVariants}()`
  attributes.push(`className={${call}}`)

  return attributes.join(" ")
}

function getAttributeValue(attributes: JsxAttributeLike[], name: string) {
  const attribute = attributes.find(
    (candidate): candidate is JsxAttribute =>
      Node.isJsxAttribute(candidate) &&
      candidate.getNameNode().getText() === name
  )
  const initializer = attribute?.getInitializer()

  if (!initializer) {
    return undefined
  }

  if (Node.isStringLiteral(initializer)) {
    return initializer.getText()
  }

  if (Node.isJsxExpression(initializer)) {
    return initializer.getExpression()?.getText()
  }

  return initializer.getText()
}

function insertButtonLinkHelper(
  sourceFile: SourceFile,
  helper: ButtonLinkHelper
) {
  const useRender = ensureValueImport(
    sourceFile,
    "@base-ui/react/use-render",
    "useRender"
  )
  const statements = sourceFile.getStatements()
  const insertIndex = statements.reduce(
    (index, statement, statementIndex) =>
      statement.getKind() === SyntaxKind.ImportDeclaration
        ? statementIndex + 1
        : index,
    0
  )

  sourceFile.insertStatements(
    insertIndex,
    `type ${helper.propsName} = Omit<${useRender}.ComponentProps<"button">, "size"> &
  NonNullable<Parameters<typeof ${helper.buttonVariants}>[0]> &
  Partial<Record<${BUTTON_ONLY_PROPS.map((prop) => `"${prop}"`).join(" | ")}, unknown>>

function ${helper.helperName}({
  className,
  variant,
  size,
  render,
  ...props
}: ${helper.propsName}) {
  const linkProps = { ...props }
  for (const prop of ${JSON.stringify(BUTTON_ONLY_PROPS)}) {
    Reflect.deleteProperty(linkProps, prop)
  }

  return ${useRender}({
    defaultTagName: "a",
    render,
    props: {
      ...linkProps,
      className: ${helper.buttonVariants}({ variant, size, className }),
    },
    state: { slot: "button" },
  })
}`
  )
}

function removeUnusedButtonImport(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  localName: string
) {
  const declaration = sourceFile.getImportDeclarations().find(
    (item) =>
      item.getModuleSpecifierValue() === moduleSpecifier &&
      item.getNamedImports().some((specifier) => {
        const name = specifier.getAliasNode()?.getText() ?? specifier.getName()
        return specifier.getName() === "Button" && name === localName
      })
  )
  const buttonImport = declaration?.getNamedImports().find((specifier) => {
    const name = specifier.getAliasNode()?.getText() ?? specifier.getName()
    return specifier.getName() === "Button" && name === localName
  })

  if (!declaration || !buttonImport) {
    return
  }

  const isUsed = sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .some(
      (identifier) =>
        identifier.getText() === localName &&
        !identifier.getFirstAncestorByKind(SyntaxKind.ImportSpecifier)
    )

  if (isUsed) {
    return
  }

  buttonImport.remove()
  if (
    declaration.getNamedImports().length === 0 &&
    !declaration.getDefaultImport() &&
    !declaration.getNamespaceImport()
  ) {
    declaration.remove()
  }
}
