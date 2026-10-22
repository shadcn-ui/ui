"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  isToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIDataTypes,
  type UIMessage,
} from "ai"

import { createChat } from "@/lib/ai"
import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Badge } from "@/registry/bases/base/ui/badge"
import { Bubble, BubbleContent } from "@/registry/bases/base/ui/bubble"
import { Button } from "@/registry/bases/base/ui/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/bases/base/ui/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Message, MessageContent } from "@/registry/bases/base/ui/message"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/bases/base/ui/sheet"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/base/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const REASONING = `The user wants to know why the checkout deploy is slow, so I should start from the build log instead of guessing.

The install and compile steps finish in under a minute. Image optimization takes almost four, and it runs on every deploy because the cache key includes the commit hash.

Keying the cache on the lockfile and the image directory should let most deploys skip that step entirely.`

export default function TraceExample() {
  return (
    <ExampleWrapper>
      <TraceChat />
      <TraceRows />
      <TraceToolCalls />
      <TraceReasoning />
      <TraceChainOfThought />
      <TraceTask />
      <TraceSources />
      <TraceTurn />
    </ExampleWrapper>
  )
}

type ChatbotMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    getWeather: {
      input: { city: string }
      output: { location: string; temperature: number; condition: string }
    }
    searchWikipedia: {
      input: { query: string }
      output: { results: { title: string; url: string }[] }
    }
    fetchPage: {
      input: { url: string }
      output: { status: number; title: string; excerpt: string }
    }
    readFile: {
      input: { path: string }
      output: { path: string; content: string }
    }
    runCommand: {
      input: { command: string }
      output: { stdout: string }
    }
  }
>

type ChatbotPart = ChatbotMessage["parts"][number]

type ReasoningPart = Extract<ChatbotPart, { type: "reasoning" }>

type ToolPart = Extract<ChatbotPart, { toolCallId: string }>

type ApprovalResponse = { id: string; approved: boolean }

const README = `# Acme Chat

A chat app built with Next.js and the AI SDK.

## Getting started

pnpm install
pnpm dev

## Chat route

app/api/chat/route.ts streams responses through the AI Gateway.
Set AI_GATEWAY_API_KEY in .env.local.`

const chatbot = createChat<ChatbotMessage>()
  .user("What's the weather in Lisbon and Tokyo?")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning(
      "The user wants the weather in two cities. I'll look both up at once, then compare them in a sentence."
    )
    writer
      .tool("getWeather", { input: { city: "Lisbon" } })
      .sleep(1200)
      .output({
        location: "Lisbon, Portugal",
        temperature: 18,
        condition: "Mainly clear",
      })
    writer
      .tool("getWeather", { input: { city: "Tokyo" } })
      .sleep(600)
      .output({
        location: "Tokyo, Japan",
        temperature: 26,
        condition: "Clear sky",
      })
    writer.text(
      "Lisbon is 18°C and mainly clear. Tokyo is warmer at 26°C under a clear sky."
    )
  })
  .user("Search Wikipedia for the Voyager probes and summarise with sources.")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning(
      "Start with a Wikipedia search. The Voyager 1 article should say where the probe is now."
    )
    writer
      .tool("searchWikipedia", { input: { query: "Voyager probes" } })
      .sleep(1000)
      .output({
        results: [
          {
            title: "Voyager program",
            url: "https://en.wikipedia.org/wiki/Voyager_program",
          },
          {
            title: "Voyager 1",
            url: "https://en.wikipedia.org/wiki/Voyager_1",
          },
          {
            title: "Voyager 2",
            url: "https://en.wikipedia.org/wiki/Voyager_2",
          },
        ],
      })
    writer
      .tool("fetchPage", {
        input: { url: "https://en.wikipedia.org/wiki/Voyager_1" },
      })
      .sleep(900)
      .output({
        status: 200,
        title: "Voyager 1 - Wikipedia",
        excerpt:
          "Voyager 1 is a space probe launched by NASA on September 5, 1977. It is the most distant human-made object from Earth.",
      })
    writer.text(
      "NASA launched both Voyager probes in 1977 to study the outer planets. Both have since reached interstellar space, and Voyager 1 is the most distant human-made object from Earth."
    )
    writer.sourceUrl({
      url: "https://en.wikipedia.org/wiki/Voyager_program",
      title: "Voyager program",
    })
    writer.sourceUrl({
      url: "https://en.wikipedia.org/wiki/Voyager_1",
      title: "Voyager 1",
    })
  })
  .user("Read the README and the changelog, then check the Node version.")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning(
      "Read both files first. Running a command needs the user's approval."
    )
    writer
      .tool("readFile", { input: { path: "README.md" } })
      .sleep(700)
      .output({ path: "README.md", content: README })
    writer
      .tool("readFile", { input: { path: "CHANGELOG.md" } })
      .sleep(500)
      .error("ENOENT: no such file or directory, open 'CHANGELOG.md'")
    writer.tool("runCommand", {
      input: { command: "node --version" },
      needsApproval: true,
      output: { stdout: "v24.18.0" },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(
      toolCall?.approved
        ? "The README covers setup and the chat route. There is no changelog. The project runs on Node v24.18.0."
        : "The README covers setup and the chat route. There is no changelog. I didn't run the command."
    )
  })

const chatbotTransport = chatbot.transport({ delayMs: 20 })

function TraceChat() {
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    addToolApprovalResponse,
  } = useChat<ChatbotMessage>({
    messages: chatbot.get(0),
    transport: chatbotTransport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  })
  const nextMessage = chatbot.next(messages)
  const isBusy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)

  function handleClick() {
    if (nextMessage) {
      void sendMessage(nextMessage)
      return
    }

    setMessages(chatbot.get(0))
  }

  return (
    <Example title="Chat" containerClassName="md:col-span-2">
      <div className="flex min-h-96 w-full max-w-xl flex-col gap-6 text-sm">
        {messages.map((message) => (
          <ChatbotMessageItem
            key={message.id}
            message={message}
            isStreaming={isBusy && message.id === lastMessage?.id}
            onApprovalResponse={(response) =>
              void addToolApprovalResponse(response)
            }
          />
        ))}
        {status === "submitted" && (
          <Trace>
            <ActivityRow
              status="running"
              icon={<BrainGlyph />}
              title="Thinking"
            />
          </Trace>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          disabled={isBusy}
          onClick={handleClick}
        >
          {nextMessage ? "Send message" : "Reset"}
        </Button>
      </div>
    </Example>
  )
}

function ChatbotMessageItem({
  message,
  isStreaming,
  onApprovalResponse,
}: {
  message: ChatbotMessage
  isStreaming: boolean
  onApprovalResponse: (response: ApprovalResponse) => void
}) {
  if (message.role === "user") {
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              {message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  const { runs, sources } = groupParts(message.parts)

  return (
    <Message align="start">
      <MessageContent className="gap-3">
        {runs.map((run) => {
          if (run.type === "text") {
            return (
              <p key={run.key} className="leading-relaxed">
                {run.text}
              </p>
            )
          }

          if (run.type === "approval") {
            return (
              <ToolApproval
                key={run.key}
                part={run.part}
                onApprovalResponse={onApprovalResponse}
              />
            )
          }

          return (
            <Trace key={run.key}>
              {run.parts.map((part, index) =>
                part.type === "reasoning" ? (
                  <ReasoningActivity
                    key={`reasoning-${index}`}
                    part={part}
                    isStreaming={isStreaming}
                  />
                ) : (
                  <ToolActivity
                    key={part.toolCallId}
                    part={part}
                    isStreaming={isStreaming}
                  />
                )
              )}
            </Trace>
          )
        })}
        {!isStreaming && sources.length > 0 && (
          <Trace>
            <ActivityRow
              icon={<LinkGlyph />}
              title={`Used ${sources.length} sources`}
            >
              <Trace>
                {sources.map((source) => (
                  <LinkActivity
                    key={source.url}
                    href={source.url}
                    title={source.title ?? source.url}
                  />
                ))}
              </Trace>
            </ActivityRow>
          </Trace>
        )}
      </MessageContent>
    </Message>
  )
}

// Each run of reasoning and tool parts becomes one group. A text part or a
// pending approval ends the run. Sources are shown once at the end.
function groupParts(parts: ChatbotPart[]) {
  const runs: (
    | { type: "text"; key: string; text: string }
    | { type: "approval"; key: string; part: ToolPart }
    | { type: "activity"; key: string; parts: (ReasoningPart | ToolPart)[] }
  )[] = []
  const sources: Extract<ChatbotPart, { type: "source-url" }>[] = []

  parts.forEach((part, index) => {
    const last = runs.at(-1)

    if (part.type === "source-url") {
      if (!sources.some((source) => source.url === part.url)) {
        sources.push(part)
      }
      return
    }

    if (part.type === "text") {
      if (last?.type === "text") {
        last.text += part.text
      } else if (part.text.trim()) {
        runs.push({ type: "text", key: `text-${index}`, text: part.text })
      }
      return
    }

    if (isToolUIPart(part) && part.state === "approval-requested") {
      runs.push({ type: "approval", key: part.toolCallId, part })
      return
    }

    if (part.type === "reasoning" || isToolUIPart(part)) {
      if (last?.type === "activity") {
        last.parts.push(part)
      } else {
        runs.push({ type: "activity", key: `activity-${index}`, parts: [part] })
      }
    }
  })

  return { runs, sources }
}

function ReasoningActivity({
  part,
  isStreaming,
}: {
  part: ReasoningPart
  isStreaming: boolean
}) {
  const running = isStreaming && part.state === "streaming"
  const text = part.text.trim()
  const [open, setOpen] = React.useState<boolean>()

  if (!text) {
    return (
      <ActivityRow
        status={running ? "running" : undefined}
        icon={<BrainGlyph />}
        title={running ? "Thinking" : "Thought"}
      />
    )
  }

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            <BrainGlyph />
          </TraceIcon>
          <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function ToolActivity({
  part,
  isStreaming,
}: {
  part: ToolPart
  isStreaming: boolean
}) {
  const props = { part, isStreaming }

  switch (part.type) {
    case "tool-getWeather": {
      const city = part.input?.city

      return (
        <ToolRow
          {...props}
          icon={<SunGlyph />}
          title={{
            running: `Getting weather for ${city}`,
            done: `Got weather for ${city}`,
            failed: `Couldn't get weather for ${city}`,
          }}
        >
          {part.state === "output-available" && (
            <ToolInputOutput
              input={part.input}
              output={`${part.output.location}\n${part.output.temperature}°C, ${part.output.condition}`}
            />
          )}
        </ToolRow>
      )
    }

    case "tool-searchWikipedia": {
      const query = part.input?.query

      return (
        <ToolRow
          {...props}
          icon={<BookGlyph />}
          title={{
            running: `Searching Wikipedia for “${query}”`,
            done: `Searched Wikipedia for “${query}”`,
            failed: `Couldn't search Wikipedia for “${query}”`,
          }}
        >
          {part.state === "output-available" && (
            <Trace>
              {part.output.results.map((result) => (
                <LinkActivity
                  key={result.url}
                  href={result.url}
                  title={result.title}
                />
              ))}
            </Trace>
          )}
        </ToolRow>
      )
    }

    case "tool-fetchPage": {
      const url = part.input?.url?.replace(/^https?:\/\//, "")

      return (
        <ToolRow
          {...props}
          icon={<GlobeGlyph />}
          title={{
            running: `Fetching ${url}`,
            done: `Fetched ${url}`,
            failed: `Couldn't fetch ${url}`,
          }}
        >
          {part.state === "output-available" && (
            <ToolInputOutput
              input={part.input}
              output={`HTTP ${part.output.status} · ${part.output.title}\n\n${part.output.excerpt}`}
            />
          )}
        </ToolRow>
      )
    }

    case "tool-readFile": {
      if (part.state === "output-available") {
        return (
          <FileActivity path={part.output.path} content={part.output.content} />
        )
      }

      const path = part.input?.path

      return (
        <ToolRow
          {...props}
          icon={<FileGlyph />}
          title={{
            running: `Reading ${path}`,
            done: `Read ${path}`,
            failed: `Couldn't read ${path}`,
          }}
        />
      )
    }

    case "tool-runCommand": {
      const command = part.input?.command

      return (
        <ToolRow
          {...props}
          icon={<TerminalGlyph />}
          title={{
            running: `Running ${command}`,
            done: `Ran ${command}`,
            failed: `Couldn't run ${command}`,
            denied: `Denied ${command}`,
          }}
        >
          {part.state === "output-available" && (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.stdout}
              </CodeBlockContent>
            </CodeBlock>
          )}
        </ToolRow>
      )
    }

    default:
      return null
  }
}

// Maps a tool part's state to a row. `children` is what the finished row
// expands to show.
function ToolRow({
  part,
  isStreaming,
  icon,
  title,
  children,
}: {
  part: ToolPart
  isStreaming: boolean
  icon: React.ReactNode
  title: {
    running: string
    done: string
    failed: string
    denied?: string
  }
  children?: React.ReactNode
}) {
  const running = isStreaming ? "running" : undefined
  const denied = title.denied ?? `Denied: ${title.running}`

  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return <ActivityRow status={running} icon={icon} title={title.running} />
    case "approval-requested":
      // A pending approval renders outside Trace, as ToolApproval.
      return null
    case "approval-responded":
      return part.approval.approved ? (
        <ActivityRow status={running} icon={icon} title={title.running} />
      ) : (
        <ActivityRow icon={icon} title={denied} />
      )
    case "output-denied":
      return <ActivityRow icon={icon} title={denied} />
    case "output-error":
      return (
        <ActivityRow status="error" icon={icon} title={title.failed}>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap className="max-h-64">
              {part.errorText}
            </CodeBlockContent>
          </CodeBlock>
        </ActivityRow>
      )
    case "output-available":
      return (
        <ActivityRow icon={icon} title={title.done}>
          {children}
        </ActivityRow>
      )
  }
}

// Static when there is nothing to show, expandable otherwise.
function ActivityRow({
  status,
  icon,
  title,
  children,
}: {
  status?: "running" | "error"
  icon: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
}) {
  if (!children) {
    return (
      <TraceLine status={status}>
        <TraceIcon>{icon}</TraceIcon>
        <TraceTitle>{title}</TraceTitle>
      </TraceLine>
    )
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status={status}>
          <TraceIcon>{icon}</TraceIcon>
          <TraceTitle>{title}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{children}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

// A pending approval is a prompt, not activity, so it is an Item. Once
// answered, the tool part renders as a Trace row again.
function ToolApproval({
  part,
  onApprovalResponse,
}: {
  part: ToolPart
  onApprovalResponse: (response: ApprovalResponse) => void
}) {
  if (part.state !== "approval-requested" || part.type !== "tool-runCommand") {
    return null
  }

  const id = part.approval.id

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <TerminalGlyph />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Run {part.input.command}?</ItemTitle>
        <ItemDescription>The command runs in this project.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onApprovalResponse({ id, approved: false })}
        >
          Deny
        </Button>
        <Button
          size="sm"
          onClick={() => onApprovalResponse({ id, approved: true })}
        >
          Approve
        </Button>
      </ItemActions>
    </Item>
  )
}

function LinkActivity({ href, title }: { href: string; title: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <TraceLine>
        <TraceIcon>
          <GlobeGlyph />
        </TraceIcon>
        <TraceTitle>
          {title}
          <span className="sr-only"> (opens in a new tab)</span>
        </TraceTitle>
        <TraceIcon>
          <ArrowUpRightGlyph />
        </TraceIcon>
      </TraceLine>
    </a>
  )
}

function FileActivity({ path, content }: { path: string; content: string }) {
  return (
    <Sheet>
      <SheetTrigger>
        <TraceLine>
          <TraceIcon>
            <FileGlyph />
          </TraceIcon>
          <TraceTitle>Read {path}</TraceTitle>
          <TraceIcon>
            <ChevronRightGlyph />
          </TraceIcon>
        </TraceLine>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-mono">{path}</SheetTitle>
          <SheetDescription>
            {content.split("\n").length} lines
          </SheetDescription>
        </SheetHeader>
        <CodeBlock className="mx-4 mb-4 min-h-0 w-auto flex-1">
          <CodeBlockContent wrap>{content}</CodeBlockContent>
        </CodeBlock>
      </SheetContent>
    </Sheet>
  )
}

function ToolInputOutput({
  input,
  output,
}: {
  input: unknown
  output: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>Input</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent wrap className="max-h-64">
          {JSON.stringify(input)}
        </CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>Output</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent wrap className="max-h-64">
          {output}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

function TraceRows() {
  return (
    <Example title="Rows">
      <Trace className="max-w-md">
        <TraceLine status="running">
          <TraceIcon>
            <FileSearchGlyph />
          </TraceIcon>
          <TraceTitle>Scanning 52 files</TraceTitle>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <TerminalGlyph />
              </TraceIcon>
              <TraceTitle>Ran node --version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                v24.18.0
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <a href="#rows">
          <TraceLine>
            <TraceIcon>
              <FileGlyph />
            </TraceIcon>
            <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
            <TraceIcon>
              <ChevronRightGlyph />
            </TraceIcon>
          </TraceLine>
        </a>
        <Sheet>
          <SheetTrigger>
            <TraceLine>
              <TraceIcon>
                <FileSearchGlyph />
              </TraceIcon>
              <TraceTitle>Explored 4 files</TraceTitle>
              <TraceIcon>
                <ChevronRightGlyph />
              </TraceIcon>
            </TraceLine>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Explored 4 files</SheetTitle>
              <SheetDescription>
                Files read while preparing the response.
              </SheetDescription>
            </SheetHeader>
            <ul className="flex flex-col gap-2 px-4 font-mono text-xs">
              <li>apps/v4/lib/docs.ts</li>
              <li>apps/v4/lib/components.ts</li>
              <li>apps/v4/next.config.mjs</li>
              <li>apps/v4/package.json</li>
            </ul>
          </SheetContent>
        </Sheet>
        <Dialog>
          <DialogTrigger>
            <TraceLine>
              <TraceIcon>
                <GlobeGlyph />
              </TraceIcon>
              <TraceTitle>Searched the web for cache keys</TraceTitle>
              <TraceIcon>
                <ChevronRightGlyph />
              </TraceIcon>
            </TraceLine>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Searched the web for cache keys</DialogTitle>
              <DialogDescription>
                Three results were used in the response.
              </DialogDescription>
            </DialogHeader>
            <ul className="flex flex-col gap-2 text-sm">
              <li>Caching build outputs</li>
              <li>Image optimization reference</li>
              <li>Deploy hooks and cache keys</li>
            </ul>
          </DialogContent>
        </Dialog>
      </Trace>
    </Example>
  )
}

function TraceToolCalls() {
  return (
    <Example title="Tool Calls">
      <Trace className="max-w-md">
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="running">
              <TraceIcon>
                <TerminalGlyph />
              </TraceIcon>
              <TraceTitle>Running npm --version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                $ npm --version
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <GlobeGlyph />
              </TraceIcon>
              <TraceTitle>
                Searched the web for app getting started installation
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">example.com/docs/install</Badge>
            <Badge variant="secondary">example.com/blog/getting-started</Badge>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <SearchGlyph />
          </TraceIcon>
          <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <TerminalGlyph />
              </TraceIcon>
              <TraceTitle>Ran node --version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent
                wrap
              >{`$ node --version\nv24.18.0`}</CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <TerminalGlyph />
              </TraceIcon>
              <TraceTitle>Failed to run pnpm --version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                command not found: pnpm
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </Example>
  )
}

const chat = createChat()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer.reasoning(REASONING, { delayMs: 60 })
    writer.sleep(400)
    writer.text(
      "Image optimization is the bottleneck. It reruns on every deploy because the cache key includes the commit hash. Key it on the lockfile and the image directory instead."
    )
  })

const initialMessages = chat.get(0)
const transport = chat.transport({
  delayMs: 20,
})

function ThinkingTrace({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  return (
    <TraceCollapsible
      open={open ?? (running && text.length > 0)}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function TraceReasoning() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
  const isBusy = status === "submitted" || status === "streaming"

  function handleClick() {
    if (nextMessage) {
      void sendMessage(nextMessage)
      return
    }

    setMessages(initialMessages)
  }

  return (
    <Example title="Reasoning">
      <div className="flex w-full max-w-md flex-col gap-8">
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle>Thought for 12 seconds</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent className="whitespace-pre-wrap">
            {REASONING}
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <div className="flex min-h-80 flex-col gap-4 border-t pt-8">
          {messages.map((message) => {
            const live = status === "streaming" && message === messages.at(-1)
            const runs: { trace: boolean; parts: typeof message.parts }[] = []

            for (const part of message.parts) {
              const trace = part.type === "reasoning"

              if (!trace && part.type !== "text") {
                continue
              }

              const last = runs.at(-1)

              if (last?.trace === trace) {
                last.parts.push(part)
              } else {
                runs.push({ trace, parts: [part] })
              }
            }

            return (
              <React.Fragment key={message.id}>
                {runs.map((run, runIndex) =>
                  run.trace ? (
                    <Trace key={runIndex}>
                      {run.parts.map((part, index) =>
                        part.type === "reasoning" ? (
                          <ThinkingTrace
                            key={index}
                            text={part.text}
                            running={live && part.state === "streaming"}
                          />
                        ) : null
                      )}
                    </Trace>
                  ) : (
                    run.parts.map((part, index) =>
                      part.type === "text" ? (
                        <p
                          key={`${runIndex}-${index}`}
                          className={
                            message.role === "user"
                              ? "text-sm font-medium"
                              : "text-sm leading-relaxed"
                          }
                        >
                          {part.text}
                        </p>
                      ) : null
                    )
                  )
                )}
              </React.Fragment>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            className="mt-auto self-start"
            disabled={isBusy}
            onClick={handleClick}
          >
            {nextMessage ? "Send message" : "Reset"}
          </Button>
        </div>
      </div>
    </Example>
  )
}

function TraceChainOfThought() {
  return (
    <Example title="Chain of Thought">
      <TraceCollapsible className="max-w-md" defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceTitle>Looking into the slow deploy</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <SearchGlyph />
                  </TraceIcon>
                  <TraceTitle>Searched for the checkout build log</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">vercel.com</Badge>
                <Badge variant="secondary">github.com</Badge>
                <Badge variant="secondary">nextjs.org</Badge>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <FileGlyph />
                  </TraceIcon>
                  <TraceTitle>Read the last twelve deploys</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                Image optimization takes almost four minutes on every deploy.
                The other steps finish in under a minute.
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine status="running">
                  <TraceIcon>
                    <SearchGlyph />
                  </TraceIcon>
                  <TraceTitle>Searching for the cache key</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    cache key image optimization
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Example>
  )
}

function TraceTask() {
  return (
    <Example title="Task">
      <TraceCollapsible className="max-w-md" defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceTitle>Found the project files</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <SearchGlyph />
              </TraceIcon>
              <TraceTitle>Searched for app/page.tsx</TraceTitle>
            </TraceLine>
            <a href="#task">
              <TraceLine>
                <TraceIcon>
                  <FileGlyph />
                </TraceIcon>
                <TraceTitle>Read app/page.tsx</TraceTitle>
                <TraceIcon>
                  <ChevronRightGlyph />
                </TraceIcon>
              </TraceLine>
            </a>
            <TraceLine>
              <TraceIcon>
                <FileSearchGlyph />
              </TraceIcon>
              <TraceTitle>Scanned 52 files</TraceTitle>
            </TraceLine>
            <a href="#task">
              <TraceLine>
                <TraceIcon>
                  <FileGlyph />
                </TraceIcon>
                <TraceTitle>Read app/layout.tsx</TraceTitle>
                <TraceIcon>
                  <ChevronRightGlyph />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Example>
  )
}

const SOURCES = [
  {
    title: "Caching build outputs | example.com",
    href: "https://example.com/docs/caching",
  },
  {
    title: "Image optimization reference | example.com",
    href: "https://example.com/docs/images",
  },
  {
    title: "Deploy hooks and cache keys | example.com",
    href: "https://example.com/docs/deploy-hooks",
  },
]

function TraceSources() {
  return (
    <Example title="Sources">
      <TraceCollapsible className="max-w-md" defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceTitle>Used {SOURCES.length} sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {SOURCES.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceIcon>
                    <GlobeGlyph />
                  </TraceIcon>
                  <TraceTitle>
                    {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightGlyph />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Example>
  )
}

function TraceTurn() {
  return (
    <Example title="Whole Turn" containerClassName="md:col-span-2">
      <TraceCollapsible className="max-w-md" defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-2">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <BrainGlyph />
                  </TraceIcon>
                  <TraceTitle>Thought for 12 seconds</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="whitespace-pre-wrap">
                {REASONING}
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <TerminalGlyph />
                  </TraceIcon>
                  <TraceTitle>Ran 3 commands, 1 failed</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent keepMounted>
                <Trace>
                  <TraceCollapsible>
                    <TraceCollapsibleTrigger>
                      <TraceLine>
                        <TraceIcon>
                          <TerminalGlyph />
                        </TraceIcon>
                        <TraceTitle>Ran node --version</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm">
                        <CodeBlockContent wrap className="max-h-64">
                          v24.18.0
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                  <TraceLine>
                    <TraceIcon>
                      <TerminalGlyph />
                    </TraceIcon>
                    <TraceTitle>Ran mkdir -p dist</TraceTitle>
                  </TraceLine>
                  <TraceCollapsible>
                    <TraceCollapsibleTrigger>
                      <TraceLine status="error">
                        <TraceIcon>
                          <TerminalGlyph />
                        </TraceIcon>
                        <TraceTitle>Failed to run pnpm --version</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm" variant="destructive">
                        <CodeBlockContent wrap className="max-h-64">
                          command not found: pnpm
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>Node is installed and pnpm is not. Reading the docs config.</p>
          <Trace>
            <a href="#whole-turn">
              <TraceLine>
                <TraceIcon>
                  <FileGlyph />
                </TraceIcon>
                <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
                <TraceIcon>
                  <ChevronRightGlyph />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Example>
  )
}

function ChevronRightGlyph() {
  return (
    <IconPlaceholder
      lucide="ChevronRightIcon"
      tabler="IconChevronRight"
      hugeicons="ArrowRight01Icon"
      phosphor="CaretRightIcon"
      remixicon="RiArrowRightSLine"
    />
  )
}

function ArrowUpRightGlyph() {
  return (
    <IconPlaceholder
      lucide="ArrowUpRightIcon"
      tabler="IconArrowUpRight"
      hugeicons="ArrowUpRight01Icon"
      phosphor="ArrowUpRightIcon"
      remixicon="RiArrowRightUpLine"
    />
  )
}

function BrainGlyph() {
  return (
    <IconPlaceholder
      lucide="BrainIcon"
      tabler="IconBrain"
      hugeicons="AiBrainIcon"
      phosphor="BrainIcon"
      remixicon="RiBrainLine"
    />
  )
}

function SearchGlyph() {
  return (
    <IconPlaceholder
      lucide="SearchIcon"
      tabler="IconSearch"
      hugeicons="Search01Icon"
      phosphor="MagnifyingGlassIcon"
      remixicon="RiSearchLine"
    />
  )
}

function FileGlyph() {
  return (
    <IconPlaceholder
      lucide="FileTextIcon"
      tabler="IconFileText"
      hugeicons="File02Icon"
      phosphor="FileTextIcon"
      remixicon="RiFileTextLine"
    />
  )
}

function FileSearchGlyph() {
  return (
    <IconPlaceholder
      lucide="FileSearchIcon"
      tabler="IconFileSearch"
      hugeicons="FileSearchIcon"
      phosphor="FileSearchIcon"
      remixicon="RiFileSearchLine"
    />
  )
}

function TerminalGlyph() {
  return (
    <IconPlaceholder
      lucide="TerminalIcon"
      tabler="IconTerminal"
      hugeicons="ComputerTerminal01Icon"
      phosphor="TerminalIcon"
      remixicon="RiTerminalBoxLine"
    />
  )
}

function SunGlyph() {
  return (
    <IconPlaceholder
      lucide="SunIcon"
      tabler="IconSun"
      hugeicons="Sun03Icon"
      phosphor="SunIcon"
      remixicon="RiSunLine"
    />
  )
}

function BookGlyph() {
  return (
    <IconPlaceholder
      lucide="BookOpenIcon"
      tabler="IconBook"
      hugeicons="BookOpen02Icon"
      phosphor="BookOpenIcon"
      remixicon="RiBookOpenLine"
    />
  )
}

function LinkGlyph() {
  return (
    <IconPlaceholder
      lucide="LinkIcon"
      tabler="IconLink"
      hugeicons="LinkIcon"
      phosphor="LinkIcon"
      remixicon="RiLinksLine"
    />
  )
}

function GlobeGlyph() {
  return (
    <IconPlaceholder
      lucide="GlobeIcon"
      tabler="IconGlobe"
      hugeicons="Globe02Icon"
      phosphor="GlobeIcon"
      remixicon="RiGlobeLine"
    />
  )
}
