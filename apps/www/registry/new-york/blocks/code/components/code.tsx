"use client"

import { useLayoutEffect, useState } from "react"
import { useTheme } from "next-themes"
import { BundledLanguage, BundledTheme, TokensResult } from "shiki"

import { getTokens } from "../util/highlight-code"
import { BlockCopyCodeButton } from "./copy-to-clipboard"

type CodeProps = {
  code: string
  language?: BundledLanguage
  theme?: BundledTheme
  lineNumbers?: boolean
  copyToClipboardTheme?: "light" | "dark" | undefined
}

export function Code({
  code,
  language = "bash",
  theme,
  lineNumbers = false,
  copyToClipboardTheme = undefined,
}: CodeProps) {
  const [highlightedTokens, setHighlightedTokens] = useState<
    TokensResult | undefined
  >(undefined)
  const { theme: appTheme } = useTheme()

  useLayoutEffect(() => {
    void getTokens(code, language, appTheme, theme).then(setHighlightedTokens)
  }, [appTheme])

  return (
    highlightedTokens && (
      <div className="relative w-full">
        <div className="absolute right-4 top-4 z-10">
          <BlockCopyCodeButton
            content={code}
            forceTheme={copyToClipboardTheme}
          />
        </div>
        <div
          data-rehype-pretty-code-fragment
          className="relative flex-1 overflow-hidden rounded-lg after:absolute after:inset-y-0 after:left-0 after:bg-foreground [&_.line:after]:w-10 [&_.line:before]:sticky [&_.line:before]:left-2 [&_.line:before]:z-10 [&_.line:before]:translate-y-[-1px] [&_.line:before]:pr-1 [&_pre]:h-[--height] [&_pre]:overflow-auto [&_pre]:py-4 [&_pre]:font-mono dark:[&_pre]:bg-zinc-900 [&_pre]:bg-zinc-100 [&_pre]:text-sm [&_pre]:leading-relaxed"
        >
          <pre
            style={{
              backgroundColor: theme ? highlightedTokens.bg : undefined,
            }}
          >
            <code {...(lineNumbers ? { "data-line-numbers": true } : {})}>
              {highlightedTokens.tokens.map((lines, index) => (
                <span className="line" key={index}>
                  {lines.map((token, tokenIndex) => (
                    <span key={tokenIndex} style={{ color: token.color }}>
                      {token.content}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    )
  )
}

export default Code
