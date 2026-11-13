"use client"

import { TerminalIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { useHighlightedCode } from "@/registry/bases/aria/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/aria-nova/ui-rtl/code-block"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      description: "Install the packages, then start the dev server.",
      title: "Terminal",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      description: "ثبّت الحزم، ثم شغّل خادم التطوير.",
      title: "الطرفية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      description: "התקן את החבילות, ואז הפעל את שרת הפיתוח.",
      title: "מסוף",
    },
  },
}

const code = `pnpm add ai @ai-sdk/react zod
pnpm dev`

export function CodeBlockRtl() {
  const { dir, t } = useTranslation(translations, "ar")
  const lines = useHighlightedCode(code, "bash")

  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-sm" dir={dir}>
      <p>{t.description}</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            {t.title}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
