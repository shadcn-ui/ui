"use client"

import { useHighlightedCode } from "@/registry/bases/base/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/base-rhea/ui/code-block"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/base-rhea/ui/tabs"

const files = [
  {
    id: "route",
    title: "app/api/chat/route.ts",
    language: "ts",
    code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    id: "chat",
    title: "components/chat.tsx",
    language: "tsx",
    code: `"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}`,
  },
  {
    id: "env",
    title: ".env.local",
    language: "bash",
    code: "AI_GATEWAY_API_KEY=your-api-key",
  },
]

function FileCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export function CodeBlockTabs() {
  return (
    <Tabs defaultValue="route" className="w-full max-w-md">
      <TabsList>
        {files.map((file) => (
          <TabsTrigger key={file.id} value={file.id}>
            {file.title.split("/").at(-1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent key={file.id} value={file.id}>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.title}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={file.code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <FileCode code={file.code} language={file.language} />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  )
}
