"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { useHighlightedCode } from "@/registry/bases/radix/hooks/use-highlighted-code"
import { Button } from "@/styles/radix-rhea/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/radix-rhea/ui/code-block"

const blocks: {
  title?: string
  language: string
  code: string
  lineNumbers?: boolean
  highlight?: number[]
  diff?: boolean
}[] = [
  {
    title: "hooks/use-debounce.ts",
    language: "ts",
    lineNumbers: true,
    code: `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}`,
  },
  {
    language: "bash",
    code: "pnpm dlx shadcn@latest add code-block",
  },
  {
    title: "components/search.tsx",
    language: "tsx",
    lineNumbers: true,
    diff: true,
    code: ` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }`,
  },
  {
    title: "app/api/chat/route.ts",
    language: "ts",
    lineNumbers: true,
    highlight: [5, 6, 7, 8],
    code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    title: ".env.local",
    language: "bash",
    code: "AI_GATEWAY_API_KEY=your-api-key",
  },
]

// Where each block starts in the stream.
const offsets = blocks.map((_, index) =>
  blocks.slice(0, index).reduce((total, block) => total + block.code.length, 0)
)
const total = blocks.reduce((sum, block) => sum + block.code.length, 0)

function StreamingBlock({
  block,
  code,
}: {
  block: (typeof blocks)[number]
  code: string
}) {
  const rows = code.split("\n")
  // A diff row starts with +, - or a space. The marker is not part of the code.
  const source = block.diff ? rows.map((row) => row.slice(1)).join("\n") : code
  const lines = useHighlightedCode(source, block.language)

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={source}
              disabled={code.length < block.code.length}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent lineNumbers={block.lineNumbers}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              block.diff
                ? rows[index]?.startsWith("+")
                  ? "added"
                  : rows[index]?.startsWith("-")
                    ? "removed"
                    : "default"
                : block.highlight?.includes(index)
                  ? "highlighted"
                  : "default"
            }
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

export function CodeBlockStreaming() {
  const [length, setLength] = React.useState(total)

  React.useEffect(() => {
    if (length >= total) {
      return
    }

    const timeout = setTimeout(() => setLength(length + 3), 16)
    return () => clearTimeout(timeout)
  }, [length])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {blocks.map(
        (block, index) =>
          length > offsets[index] && (
            <StreamingBlock
              key={block.code}
              block={block}
              code={block.code.slice(0, length - offsets[index])}
            />
          )
      )}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={length < total}
        onClick={() => setLength(0)}
      >
        <RotateCcwIcon />
        Replay
      </Button>
    </div>
  )
}
