"use client"

import * as React from "react"
import {
  Streamdown,
  useIsCodeFenceIncomplete,
  type ExtraProps,
} from "streamdown"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { useHighlightedCode } from "@/registry/bases/radix/hooks/use-highlighted-code"
import { Bubble, BubbleContent } from "@/registry/bases/radix/ui/bubble"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/registry/bases/radix/ui/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/radix/ui/dialog"
import { Message, MessageContent } from "@/registry/bases/radix/ui/message"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/radix/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const build = `$ pnpm build
> next build

   ▲ Next.js 16.0.0
   Creating an optimized production build ...
 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)

Route (app)                Size  First Load JS
┌ ○ /                    1.9 kB         112 kB
├ ○ /_not-found           993 B         103 kB
└ ƒ /api/chat             141 B         102 kB`

const install = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
dependencies:
+ @ai-sdk/react 3.0.12
+ ai 6.0.12
+ zod 4.1.12
Done in 2.8s using pnpm v10.18.0`

const error = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)
    at mountIndeterminateComponent (react-dom.development.js:20069:13)`

const source = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

const chat = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything" />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`

const diff = [
  { variant: "default", text: "export function Greeting({ name }: Props) {" },
  { variant: "removed", text: "  return <p>Hello, {name}</p>" },
  {
    variant: "added",
    text: '  return <p className="text-sm">Hello, {name}!</p>',
  },
  { variant: "default", text: "}" },
] as const

const log = Array.from(
  { length: 40 },
  (_, index) =>
    `[${String(index + 1).padStart(2, "0")}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`
).join("\n")

export default function CodeBlockExample() {
  return (
    <ExampleWrapper className="md:grid-cols-1">
      <CodeBlockPlain />
      <CodeBlockWrap />
      <CodeBlockLineNumbers />
      <CodeBlockWithHeader />
      <CodeBlockWithActions />
      <CodeBlockDestructive />
      <CodeBlockDiff />
      <CodeBlockHighlightedLines />
      <CodeBlockHeight />
      <CodeBlockShowMore />
      <CodeBlockShowMoreScroll />
      <CodeBlockHighlighted />
      <CodeBlockEmpty />
      <CodeBlockSmall />
      <CodeBlockSmallDestructive />
      <CodeBlockTrace />
      <CodeBlockTypeset />
      <CodeBlockWrapLineNumbers />
      <CodeBlockStartLine />
      <CodeBlockDiffWrap />
      <CodeBlockHeaderEdges />
      <CodeBlockSmallest />
      <CodeBlockSmallCombinations />
      <CodeBlockStreamed />
      <CodeBlockMarkdown />
      <CodeBlockLanguages />
      <CodeBlockInCard />
      <CodeBlockInMessage />
      <CodeBlockTabs />
      <CodeBlockRtl />
    </ExampleWrapper>
  )
}

function CodeBlockPlain() {
  return (
    <Example title="Plain">
      <CodeBlock>
        <CodeBlockContent>{build}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockWrap() {
  return (
    <Example title="Wrap">
      <CodeBlock>
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockLineNumbers() {
  const lines = useHighlightedCode(source, "ts")

  return (
    <Example title="Line Numbers">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockWithHeader() {
  return (
    <Example title="Header">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <IconPlaceholder
              lucide="TerminalIcon"
              tabler="IconTerminal"
              hugeicons="ComputerTerminal01Icon"
              phosphor="TerminalIcon"
              remixicon="RiTerminalBoxLine"
            />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={install} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{install}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockDestructive() {
  return (
    <Example title="Destructive">
      <CodeBlock variant="destructive">
        <CodeBlockHeader>
          <CodeBlockTitle>Error</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={error} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockDiff() {
  const lines = useHighlightedCode(
    diff.map((line) => line.text).join("\n"),
    "tsx"
  )

  return (
    <Example title="Diff">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index} variant={diff[index]?.variant}>
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockHighlightedLines() {
  const lines = useHighlightedCode(source, "ts")

  return (
    <Example title="Highlighted Lines">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={index >= 5 && index <= 8 ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockHeight() {
  return (
    <Example title="Height">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Logs</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={log} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent className="max-h-48 scroll-fade-y">
          {log}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockHighlighted() {
  const lines = useHighlightedCode(source, "ts")

  return (
    <Example title="Syntax Highlighting">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <IconPlaceholder
              lucide="FileCodeIcon"
              tabler="IconFileCode"
              hugeicons="CodeIcon"
              phosphor="FileCodeIcon"
              remixicon="RiFileCodeLine"
            />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={source} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockEmpty() {
  return (
    <Example title="Empty">
      <CodeBlock>
        <CodeBlockContent>{""}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockSmall() {
  return (
    <Example title="Small">
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <IconPlaceholder
              lucide="TerminalIcon"
              tabler="IconTerminal"
              hugeicons="ComputerTerminal01Icon"
              phosphor="TerminalIcon"
              remixicon="RiTerminalBoxLine"
            />
            pnpm add ai @ai-sdk/react zod
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={install} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{install}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockSmallDestructive() {
  return (
    <Example title="Small Destructive">
      <CodeBlock size="sm" variant="destructive">
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockTrace() {
  return (
    <Example title="Trace">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalBoxLine"
                />
              </TraceIcon>
              <TraceTitle>Ran pnpm add ai @ai-sdk/react zod</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {install}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalBoxLine"
                />
              </TraceIcon>
              <TraceTitle>Failed to run pnpm dev</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                {error}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </Example>
  )
}

function CodeBlockTypeset() {
  const lines = useHighlightedCode(source, "ts")
  const command = useHighlightedCode("pnpm add ai @ai-sdk/react zod", "bash")

  return (
    <Example title="Typeset">
      <div className="typeset max-w-2xl">
        <h3>Stream a response</h3>
        <p>
          Create a route handler that calls <code>streamText</code> and returns
          the stream to the client. The <code>useChat</code> hook reads it on
          the other side.
        </p>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <IconPlaceholder
                lucide="FileCodeIcon"
                tabler="IconFileCode"
                hugeicons="CodeIcon"
                phosphor="FileCodeIcon"
                remixicon="RiFileCodeLine"
              />
              app/api/chat/route.ts
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {lines.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
        <p>Then install the packages the route uses.</p>
        <CodeBlock>
          <CodeBlockContent>
            {command.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
        <p>
          The model streams text parts as they arrive, so the answer renders
          while it is written.
        </p>
      </div>
    </Example>
  )
}

function CodeBlockWithActions() {
  const [wrap, setWrap] = React.useState(false)
  const lines = useHighlightedCode(source, "ts")

  return (
    <Example title="Actions">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Wrap lines"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <IconPlaceholder
                lucide="WrapTextIcon"
                tabler="IconTextWrap"
                hugeicons="TextWrapIcon"
                phosphor="ArrowUDownLeftIcon"
                remixicon="RiTextWrap"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Download"
              onClick={() => download(source, "route.ts")}
            >
              <IconPlaceholder
                lucide="DownloadIcon"
                tabler="IconDownload"
                hugeicons="Download01Icon"
                phosphor="DownloadSimpleIcon"
                remixicon="RiDownloadLine"
              />
            </Button>
            <CodeBlockCopyButton value={source} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap} lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function download(code: string, filename: string) {
  const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function CodeBlockShowMore() {
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(chat, "tsx")
  const id = React.useId()

  return (
    <Example title="Show More">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={chat} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded ? undefined : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="transition-transform in-aria-expanded:rotate-180 aria-expanded:rotate-180"
            />
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockShowMoreScroll() {
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(chat, "tsx")
  const id = React.useId()

  return (
    <Example title="Show More with Max Height">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={chat} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded
              ? "max-h-96 scroll-fade-y"
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="transition-transform in-aria-expanded:rotate-180 aria-expanded:rotate-180"
            />
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </Example>
  )
}

const middle = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`

const longDiff = [
  { variant: "default", text: "export async function GET(request: Request) {" },
  {
    variant: "removed",
    text: '  const { searchParams } = new URL(request.url, "http://localhost:3000/api/projects?include=owner,members")',
  },
  {
    variant: "added",
    text: '  const { searchParams } = new URL(request.url, process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? undefined)',
  },
  {
    variant: "added",
    text: '  const include = searchParams.get("include")?.split(",") ?? []',
  },
  {
    variant: "default",
    text: "  return Response.json(await getProjects({ include }))",
  },
  { variant: "default", text: "}" },
] as const

const samples = [
  {
    language: "json",
    title: "package.json",
    code: `{
  "name": "acme-chat",
  "scripts": { "dev": "next dev --turbopack" },
  "dependencies": { "ai": "^6.0.12", "zod": "^4.1.12" }
}`,
  },
  {
    language: "css",
    title: "app/globals.css",
    code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
  },
  {
    language: "python",
    title: "main.py",
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
  },
  {
    language: "text",
    title: "notes.txt",
    code: "An unknown language renders as plain lines.",
  },
]

const ansi = `$ pnpm test
\x1b[32m✓\x1b[39m src/format.test.ts \x1b[2m(4 tests)\x1b[22m
\x1b[31m✗\x1b[39m src/stream.test.ts \x1b[2m(3 tests | 1 failed)\x1b[22m

Tests  \x1b[31m1 failed\x1b[39m | \x1b[32m6 passed\x1b[39m (7)`

const answer = `Wrap the input in a \`useDebounce\` hook:

\`\`\`tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
\`\`\`

Then install it:

\`\`\`bash
pnpm dlx shadcn@latest add use-debounce
\`\`\``

const files = [
  { id: "route", title: "app/api/chat/route.ts", language: "ts", code: source },
  { id: "chat", title: "components/chat.tsx", language: "tsx", code: chat },
  {
    id: "env",
    title: ".env.local",
    language: "bash",
    code: "AI_GATEWAY_API_KEY=your-api-key",
  },
]

function Highlighted({
  code,
  language,
  ...props
}: React.ComponentProps<typeof CodeBlockContent> & {
  code: string
  language: string
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent {...props}>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

function CodeBlockWrapLineNumbers() {
  return (
    <Example title="Wrap and Line Numbers">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <Highlighted code={chat} language="tsx" wrap lineNumbers />
      </CodeBlock>
    </Example>
  )
}

function CodeBlockStartLine() {
  return (
    <Example title="Start Line">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <Highlighted code={middle} language="tsx" lineNumbers startLine={995} />
      </CodeBlock>
    </Example>
  )
}

function CodeBlockDiffWrap() {
  const lines = useHighlightedCode(
    longDiff.map((line) => line.text).join("\n"),
    "ts"
  )

  return (
    <Example title="Diff, Wrap and Highlighting">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/projects/route.ts</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent wrap lineNumbers startLine={12}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index} variant={longDiff[index]?.variant}>
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Example>
  )
}

function CodeBlockHeaderEdges() {
  return (
    <Example title="Header Edges">
      <div className="flex flex-col gap-4">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>Title only</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent>
            {'console.log("title, no actions")'}
          </CodeBlockContent>
        </CodeBlock>
        <CodeBlock>
          <CodeBlockActions>
            <CodeBlockCopyButton value={install} />
          </CodeBlockActions>
          <CodeBlockContent>{install}</CodeBlockContent>
        </CodeBlock>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <IconPlaceholder
                lucide="FileCodeIcon"
                tabler="IconFileCode"
                hugeicons="CodeIcon"
                phosphor="FileCodeIcon"
                remixicon="RiFileCodeLine"
              />
              apps/web/app/(dashboard)/settings/organizations/[organizationId]/members/invitations/page.tsx
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent>
            {"export default function Page() {}"}
          </CodeBlockContent>
        </CodeBlock>
      </div>
    </Example>
  )
}

function CodeBlockSmallest() {
  return (
    <Example title="Single Line and Empty">
      <div className="flex flex-col gap-4">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>Install</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value="pnpm dlx shadcn@latest add code-block" />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Highlighted
            code="pnpm dlx shadcn@latest add code-block"
            language="bash"
          />
        </CodeBlock>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>output.log</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent>{""}</CodeBlockContent>
        </CodeBlock>
        <CodeBlock>
          <Highlighted code="pnpm dev" language="bash" />
        </CodeBlock>
      </div>
    </Example>
  )
}

function CodeBlockSmallCombinations() {
  const lines = useHighlightedCode(
    diff.map((line) => line.text).join("\n"),
    "tsx"
  )

  return (
    <Example title="Small Combinations">
      <div className="flex flex-col gap-4">
        <CodeBlock size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {lines.map((line, index) => (
              <CodeBlockLine key={index} variant={diff[index]?.variant}>
                {line}
              </CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
        <CodeBlock size="sm">
          <Highlighted
            code={source}
            language="ts"
            lineNumbers
            startLine={995}
          />
        </CodeBlock>
      </div>
    </Example>
  )
}

const streamed: {
  title?: string
  language: string
  code: string
  lineNumbers?: boolean
  highlight?: number[]
  diff?: boolean
}[] = [
  {
    title: "app/api/chat/route.ts",
    language: "ts",
    lineNumbers: true,
    highlight: [5, 6, 7, 8],
    code: source,
  },
  { language: "bash", code: "pnpm dlx shadcn@latest add code-block" },
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
]

const offsets = streamed.map((_, index) =>
  streamed
    .slice(0, index)
    .reduce((total, block) => total + block.code.length, 0)
)
const streamedLength = streamed.reduce(
  (sum, block) => sum + block.code.length,
  0
)

function StreamedBlock({
  block,
  code,
}: {
  block: (typeof streamed)[number]
  code: string
}) {
  const rows = code.split("\n")
  const text = block.diff ? rows.map((row) => row.slice(1)).join("\n") : code
  const lines = useHighlightedCode(text, block.language)

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={text}
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

function useStream(length: number) {
  const [position, setPosition] = React.useState(length)

  React.useEffect(() => {
    if (position >= length) {
      return
    }

    const timeout = setTimeout(() => setPosition(position + 3), 16)
    return () => clearTimeout(timeout)
  }, [position, length])

  return [position, () => setPosition(0)] as const
}

function CodeBlockStreamed() {
  const [position, replay] = useStream(streamedLength)

  return (
    <Example title="Streaming">
      <div className="flex flex-col gap-4">
        {streamed.map(
          (block, index) =>
            position > offsets[index] && (
              <StreamedBlock
                key={block.code}
                block={block}
                code={block.code.slice(0, position - offsets[index])}
              />
            )
        )}
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          disabled={position < streamedLength}
          onClick={replay}
        >
          Replay
        </Button>
      </div>
    </Example>
  )
}

function MarkdownCode({
  node,
  className,
  children,
  ...props
}: React.ComponentProps<"code"> & ExtraProps) {
  const incomplete = useIsCodeFenceIncomplete()
  const block = "data-block" in props
  const code = typeof children === "string" ? children : ""
  const language = /language-(\S+)/.exec(className ?? "")?.[1] ?? ""
  const lines = useHighlightedCode(block ? code : "", language)

  if (!block) {
    return (
      <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    )
  }

  return (
    <CodeBlock className="my-3">
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} disabled={incomplete} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

const markdownComponents = { code: MarkdownCode }

function CodeBlockMarkdown() {
  const [position, replay] = useStream(answer.length)

  return (
    <Example title="Markdown">
      <div className="flex flex-col gap-4 text-sm">
        <Streamdown
          components={markdownComponents}
          controls={false}
          isAnimating={position < answer.length}
        >
          {answer.slice(0, position)}
        </Streamdown>
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          disabled={position < answer.length}
          onClick={replay}
        >
          Replay
        </Button>
      </div>
    </Example>
  )
}

function CodeBlockLanguages() {
  const lines = useHighlightedCode(ansi, "ansi")

  return (
    <Example title="Languages">
      <div className="flex flex-col gap-4">
        {samples.map((sample) => (
          <CodeBlock key={sample.language}>
            <CodeBlockHeader>
              <CodeBlockTitle>{sample.title}</CodeBlockTitle>
            </CodeBlockHeader>
            <Highlighted code={sample.code} language={sample.language} />
          </CodeBlock>
        ))}
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>ANSI</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent wrap>
            {lines.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
      </div>
    </Example>
  )
}

function CodeBlockInCard() {
  return (
    <Example title="Card and Dialog">
      <div className="flex flex-col items-start gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Install the AI SDK</CardTitle>
            <CardDescription>Add the packages to your project.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>
              <CodeBlockHeader>
                <CodeBlockTitle>Terminal</CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopyButton value="pnpm add ai @ai-sdk/react zod" />
                </CodeBlockActions>
              </CodeBlockHeader>
              <Highlighted
                code="pnpm add ai @ai-sdk/react zod"
                language="bash"
              />
            </CodeBlock>
          </CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View route</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>app/api/chat/route.ts</DialogTitle>
              <DialogDescription>
                The route that streams the answer.
              </DialogDescription>
            </DialogHeader>
            <CodeBlock>
              <Highlighted code={source} language="ts" lineNumbers />
            </CodeBlock>
          </DialogContent>
        </Dialog>
      </div>
    </Example>
  )
}

function CodeBlockInMessage() {
  return (
    <Example title="Chat Answer">
      <div className="flex flex-col gap-4 text-sm">
        <Message align="end">
          <MessageContent>
            <Bubble>
              <BubbleContent>How do I stream a response?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageContent className="gap-3">
            <p>Create a route handler that returns the stream:</p>
            <CodeBlock>
              <CodeBlockHeader>
                <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopyButton value={source} />
                </CodeBlockActions>
              </CodeBlockHeader>
              <Highlighted code={source} language="ts" />
            </CodeBlock>
            <p>The client reads it with useChat.</p>
          </MessageContent>
        </Message>
      </div>
    </Example>
  )
}

function CodeBlockTabs() {
  return (
    <Example title="Tabs">
      <Tabs defaultValue="route">
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
              <Highlighted
                code={file.code}
                language={file.language}
                lineNumbers
              />
            </CodeBlock>
          </TabsContent>
        ))}
      </Tabs>
    </Example>
  )
}

function CodeBlockRtl() {
  return (
    <Example title="RTL">
      <div dir="rtl" className="flex flex-col gap-3 text-sm">
        <p>أنشئ ملف المسار وأعد البث إلى العميل.</p>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={source} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Highlighted code={source} language="ts" lineNumbers />
        </CodeBlock>
      </div>
    </Example>
  )
}
