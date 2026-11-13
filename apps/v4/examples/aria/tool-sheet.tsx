"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import { ChevronRightIcon, FileTextIcon } from "lucide-react"
import { Button as ButtonPrimitive } from "react-aria-components"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/styles/aria-rhea/ui/bubble"
import { Button } from "@/styles/aria-rhea/ui/button"
import { CodeBlock, CodeBlockContent } from "@/styles/aria-rhea/ui/code-block"
import { Message, MessageContent } from "@/styles/aria-rhea/ui/message"
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/styles/aria-rhea/ui/sheet"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    readFile: {
      input: { path: string }
      output: { path: string; content: string }
    }
  }
>

const PACKAGE_JSON = `{
  "name": "acme-chat",
  "private": true,
  "dependencies": {
    "@ai-sdk/react": "^4.0.0",
    "ai": "^7.0.0",
    "next": "^16.3.0"
  }
}`

const chat = createChat<ChatMessage>()
  .user("Which AI SDK version does this app use?")
  .assistant(({ writer }) => {
    writer
      .tool("readFile", { input: { path: "package.json" } })
      .sleep(900)
      .output({ path: "package.json", content: PACKAGE_JSON })
    writer.text("It uses ai 7 with @ai-sdk/react 4.")
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

export function ToolSheet() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <Message key={message.id} align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{getMessageText(message)}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )
        }

        const streaming = busy && message === messages.at(-1)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return <p key={index}>{part.text}</p>
                }

                if (part.type !== "tool-readFile") {
                  return null
                }

                if (part.state !== "output-available") {
                  const running =
                    streaming &&
                    (part.state === "input-streaming" ||
                      part.state === "input-available")

                  return (
                    <Trace key={part.toolCallId}>
                      <TraceLine status={running ? "running" : "error"}>
                        <TraceIcon>
                          <FileTextIcon />
                        </TraceIcon>
                        <TraceTitle>
                          {running ? "Reading" : "Failed to read"}{" "}
                          {part.input?.path}
                        </TraceTitle>
                      </TraceLine>
                    </Trace>
                  )
                }

                return (
                  <Trace key={part.toolCallId}>
                    <SheetTrigger>
                      <ButtonPrimitive>
                        <TraceLine>
                          <TraceIcon>
                            <FileTextIcon />
                          </TraceIcon>
                          <TraceTitle>Read {part.output.path}</TraceTitle>
                          <TraceIcon>
                            <ChevronRightIcon />
                          </TraceIcon>
                        </TraceLine>
                      </ButtonPrimitive>
                      <Sheet>
                        <SheetHeader>
                          <SheetTitle className="font-mono">
                            {part.output.path}
                          </SheetTitle>
                          <SheetDescription>
                            {part.output.content.split("\n").length} lines
                          </SheetDescription>
                        </SheetHeader>
                        <CodeBlock className="mx-6 mb-6 w-auto">
                          <CodeBlockContent lineNumbers>
                            {part.output.content}
                          </CodeBlockContent>
                        </CodeBlock>
                      </Sheet>
                    </SheetTrigger>
                  </Trace>
                )
              })}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onPress={() =>
            nextMessage
              ? sendMessage(nextMessage)
              : setMessages(initialMessages)
          }
        >
          {nextMessage ? "Send message" : "Reset"}
        </Button>
      )}
    </div>
  )
}
