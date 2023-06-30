import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"
import { splitClassName } from "./transform-css-vars"

export const transformTwPrefixes: Transformer = async ({
    sourceFile,
    config,
}) => {
    if (!config.tailwind || !config.tailwind.prefix) {
        return sourceFile
    }
    sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((child) => {
        const value = child.getText()
        //this is a hack to prevent the removal of single space classes. If new single space classes are added to tailwind, they need to be added here
        const KNOWN_SINGLE_SPACE_CLASSES = [
            "border-b",
            "flex",
            "invisible",
            "space-y-4",
            "sr-only",
            "[&_tr:last-child]:border-0",
            "[&_tr]:border-b"
        ]
        function checkIfKnownSingleSpaceClass(value: string) {
            return KNOWN_SINGLE_SPACE_CLASSES.some((knownClass) =>
                value.includes(knownClass)
            )
        }
        if (value) {
            TODO://this is very hacky way find tailwind classes but for current components it works. Need to find a better way
            if (value.split(" ").length > 1 && value.includes("-") || checkIfKnownSingleSpaceClass(value)) {
                const valueWithColorMapping = applyTwPrefixes(
                    value.replace(/"/g, ""),
                    config.tailwind.prefix || ""
                )
                child.replaceWithText(`"${valueWithColorMapping.trim()}"`)
            }
            return
        }
    })
    return sourceFile
}


export const applyTwPrefixes = (input: string, twPrefix: string) => {
    const classNames = input.split(" ")
    const prefixed: string[] = []
    for (let className of classNames) {
        const [variant, value, modifier] = splitClassName(className)
        if (variant) {
            modifier ? prefixed.push(`${variant}:${twPrefix}${value}/${modifier}`) :
                prefixed.push(`${variant}:${twPrefix}${value}`)
        } else {
            modifier ? prefixed.push(`${twPrefix}${value}/${modifier}`) :
                prefixed.push(`${twPrefix}${value}`)
        }
    }
    return prefixed.join(" ")
}


export const applyTwPrefixesCss = (css: string, twPrefix: string) => {
    const lines = css.split("\n")
    for (let line of lines) {
        if (line.includes("@apply")) {
            const originalTWCls = line.replace("@apply", "").trim()
            const prefixedTwCls = applyTwPrefixes(originalTWCls, twPrefix)
            css = css.replace(originalTWCls, prefixedTwCls)
        }
    }
    return css
}