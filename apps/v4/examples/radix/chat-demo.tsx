"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  ArrowUpIcon,
  CircleCheckIcon,
  GlobeIcon,
  LoaderCircleIcon,
  MessageCircleDashedIcon,
  PaperclipIcon,
  PlusIcon,
  RotateCwIcon,
  TelescopeIcon,
  TerminalIcon,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { createChat, getMessageText } from "@/lib/ai"
import { MESSAGE_ANIMATIONS } from "@/lib/message-animations"
import { Markdown } from "@/components/markdown"
import { Bubble, BubbleContent } from "@/styles/radix-rhea/ui/bubble"
import { Button } from "@/styles/radix-rhea/ui/button"
import { CodeBlock, CodeBlockContent } from "@/styles/radix-rhea/ui/code-block"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/radix-rhea/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/styles/radix-rhea/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/styles/radix-rhea/ui/input-group"
import { Message, MessageContent } from "@/styles/radix-rhea/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/styles/radix-rhea/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/radix-rhea/ui/tooltip"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string }
      output: { stdout: string }
    }
  }
>

type ChatPart = ChatMessage["parts"][number]

type ToolPart = Extract<ChatPart, { type: "tool-runCommand" }>

const chat = createChat<ChatMessage>()
  .user("Add a dark mode toggle to the settings page.")
  .sleep(600)
  .assistant(({ writer }) => {
    writer.reasoning(
      "I need to know how themes are set up before I add a toggle. If next-themes is already in the layout, the toggle only has to call setTheme."
    )
    writer.sleep(400)
    writer
      .tool("runCommand", { input: { command: "rg -l ThemeProvider app" } })
      .sleep(800)
      .output({ stdout: "app/layout.tsx" })
    writer.sleep(500)
    writer.text(`next-themes is already set up in \`app/layout.tsx\`, so the toggle only has to call \`setTheme\`.

**Changes**

- Added \`components/mode-toggle.tsx\` with a Light and Dark option.
- Put \`<ModeToggle />\` next to the Appearance heading in \`app/settings/page.tsx\`.

\`\`\`tsx
const { setTheme } = useTheme()
\`\`\`
`)
  })
  .user("Make it follow the system setting by default.")
  .sleep(600)
  .assistant(({ writer }) => {
    writer.reasoning(
      "The default theme lives on the ThemeProvider. I should check what it is set to now."
    )
    writer.sleep(400)
    writer
      .tool("runCommand", {
        input: { command: "rg -n defaultTheme app/layout.tsx" },
      })
      .sleep(800)
      .output({
        stdout: '12:  <ThemeProvider attribute="class" defaultTheme="light">',
      })
    writer.sleep(500)
    writer.text(`It was set to \`light\`. I updated the \`ThemeProvider\` in \`app/layout.tsx\`:

\`\`\`tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
\`\`\`

New visitors now get the theme from their OS. The toggle also has a **System** option, so anyone who picked Light or Dark can switch back.
`)
  })
  .user("Run the build before I ship it.")
  .sleep(600)
  .assistant(({ writer }) => {
    writer
      .tool("runCommand", { input: { command: "pnpm build" } })
      .sleep(1600)
      .output({
        stdout:
          "▲ Next.js 16.0.0\n\n✓ Compiled successfully in 4.2s\n✓ Linting and checking validity of types\n✓ Generating static pages (12/12)",
      })
    writer.sleep(500)
    writer.text(`The build passes, so it is ready to ship.

- Compiled in **4.2s**.
- No lint or type errors.
- Generated all **12** static pages.
`)
  })

const initialMessages = chat.get(0)
const transport = chat.transport({
  delayMs: 16,
  fallback:
    "This demo only knows the scripted turns. Press reset to start over.",
})

const MotionMessageScrollerItem = motion.create(MessageScrollerItem)

export function ChatDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const [draft, setDraft] = React.useState<string | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const nextMessage = chat.next(messages)
  const busy = status === "submitted" || status === "streaming"
  const text = draft ?? (nextMessage ? getMessageText(nextMessage) : "")
  const canSend = text.trim().length > 0 && !busy

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    if (draft === null && nextMessage) {
      void sendMessage(nextMessage)
    } else {
      void sendMessage({ text: text.trim() })
    }
    setDraft(null)
  }

  return (
    <MessageScrollerProvider>
      <div className="relative flex w-full flex-col gap-4 [[data-slot=preview]:has(&)]:bg-background [[data-slot=preview]:has(&)>div]:p-0!">
        <div className="flex h-200 w-full flex-col gap-4">
          <div className="flex items-start justify-between gap-4 p-8 pb-4">
            <div className="flex flex-col gap-1">
              <div className="font-medium">New Thread</div>
              <div className="text-sm text-muted-foreground">
                Ask the agent to change your code.
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Reset conversation"
                  onClick={() => {
                    setMessages(initialMessages)
                    setDraft(null)
                  }}
                  disabled={busy}
                >
                  <RotateCwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="min-h-0 flex-1">
            {messages.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircleDashedIcon />
                  </EmptyMedia>
                  <EmptyTitle>What should we build?</EmptyTitle>
                  <EmptyDescription>
                    The agent can read your code, run commands and make changes.
                    Press send to start.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={busy}
                    className="gap-6 px-8 py-0"
                  >
                    {messages.map((message) => {
                      if (message.role === "user") {
                        return (
                          <MotionMessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor
                            variants={MESSAGE_ANIMATIONS["slide-up"].variants}
                            initial={shouldReduceMotion ? false : "initial"}
                            animate="animate"
                          >
                            <Message align="end">
                              <MessageContent>
                                <Bubble align="end" variant="muted">
                                  <BubbleContent>
                                    {getMessageText(message)}
                                  </BubbleContent>
                                </Bubble>
                              </MessageContent>
                            </Message>
                          </MotionMessageScrollerItem>
                        )
                      }

                      const streaming = busy && message === messages.at(-1)
                      const steps = message.parts.filter(
                        (part) =>
                          part.type === "reasoning" ||
                          part.type === "tool-runCommand"
                      )
                      const reply = getMessageText(message)

                      return (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                        >
                          <Message>
                            <MessageContent className="gap-3">
                              {steps.length > 0 && (
                                <Trace>
                                  {steps.map((part, index) => (
                                    <StepRow
                                      key={index}
                                      part={part}
                                      streaming={streaming}
                                    />
                                  ))}
                                </Trace>
                              )}
                              {reply && <Markdown>{reply}</Markdown>}
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      )
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </div>
          <div className="p-8 pt-0">
            <form ref={formRef} onSubmit={onSubmit} className="w-full">
              <InputGroup>
                <InputGroupTextarea
                  value={text}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask the agent..."
                  aria-label="Message"
                  className="min-h-14"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      formRef.current?.requestSubmit()
                    }
                  }}
                />
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton
                        aria-label="Add context"
                        type="button"
                        size="icon-sm"
                        variant="outline"
                      >
                        <PlusIcon />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="top"
                      className="w-44"
                    >
                      <DropdownMenuItem>
                        <PaperclipIcon />
                        Add Photos & Files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <TelescopeIcon />
                        Deep Research
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <GlobeIcon />
                        Web Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={!canSend}
                    className="ml-auto"
                  >
                    <ArrowUpIcon />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function StepRow({ part, streaming }: { part: ChatPart; streaming: boolean }) {
  if (part.type === "reasoning") {
    return (
      <ReasoningRow text={part.text} running={part.state === "streaming"} />
    )
  }

  if (part.type === "tool-runCommand") {
    return <ToolRow part={part} streaming={streaming} />
  }

  return null
}

function ReasoningRow({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            {running ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CircleCheckIcon />
            )}
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

function ToolRow({ part, streaming }: { part: ToolPart; streaming: boolean }) {
  const command = part.input?.command

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? "error" : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              {failed ? "Failed to run" : "Ran"} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {failed ? part.errorText : part.output.stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}
