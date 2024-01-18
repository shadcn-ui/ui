import React from "react"
import { useTheme } from "next-themes"
import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from "react-syntax-highlighter"
import * as languages from "react-syntax-highlighter/dist/esm/languages/hljs"
import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs"

import { languageTypes } from "@/types/code-block"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CopyButton } from "@/components/copy-button"

const SyntaxHighlighterWithType =
  SyntaxHighlighter as any as React.FC<SyntaxHighlighterProps>
interface CodeBlockProps {
  code: string
  className?: string
  overwriteTheme?: boolean
  language: languageTypes
  theme?: keyof typeof themes
  hljsProps?: Omit<SyntaxHighlighterProps, "children">
}

interface IThemeMatcher {
  [key: string]: any
}
export default function CodeBlock({
  code,
  className,
  language,
  theme,
  hljsProps,
}: CodeBlockProps) {
  const { theme: nextTheme } = useTheme()

  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const themeMatcher: IThemeMatcher = {
    dark: themes.dark,
    light: themes.docco,
    system: isDarkMode ? themes.dark : themes.docco,
  }
  const themeName = theme
    ? themes[theme]
    : themeMatcher[nextTheme !== undefined ? nextTheme : "system"]
  return (
    <div className={cn("relative ", className)}>
      <SyntaxHighlighterWithType
        className={className}
        language={languages[language]}
        style={themeName}
        {...hljsProps}
      >
        {code}
      </SyntaxHighlighterWithType>
      <CopyButton className="absolute right-0.5 top-0.5" value={code} />
    </div>
  )
}
