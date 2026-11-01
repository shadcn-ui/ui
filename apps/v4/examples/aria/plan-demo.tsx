"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  RouteIcon,
} from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/styles/aria-rhea/ui/bubble"
import { Button } from "@/styles/aria-rhea/ui/button"
import { Message, MessageContent } from "@/styles/aria-rhea/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  {
    plan: {
      title: string
      steps: { title: string; status: "done" | "running" | "pending" }[]
    }
  }
>

type PlanPart = Extract<ChatMessage["parts"][number], { type: "data-plan" }>

const STEPS = [
  "Install @base-ui/react",
  "Replace the Radix imports",
  "Rename asChild to render",
  "Run the type checker",
]

function planAt(current: number) {
  return {
    title: "Plan: migrate to Base UI",
    steps: STEPS.map((title, index) => ({
      title,
      status:
        index < current ? "done" : index === current ? "running" : "pending",
    })),
  } satisfies PlanPart["data"]
}

const chat = createChat<ChatMessage>()
  .user("Migrate the dialog components to Base UI.")
  .assistant(({ writer }) => {
    STEPS.forEach((_, index) => {
      writer
        .data({ type: "data-plan", id: "plan", data: planAt(index) })
        .sleep(1200)
    })
    writer.data({ type: "data-plan", id: "plan", data: planAt(STEPS.length) })
    writer.text("Migrated Dialog and AlertDialog. The type checker passes.")
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function PlanRow({
  plan,
  streaming,
}: {
  plan: PlanPart["data"]
  streaming: boolean
}) {
  const done = plan.steps.filter((step) => step.status === "done").length
  const running = streaming && done < plan.steps.length

  return (
    <TraceCollapsible defaultExpanded>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            <RouteIcon />
          </TraceIcon>
          <TraceTitle>{plan.title}</TraceTitle>
          <TraceDescription>
            {done} of {plan.steps.length} done
          </TraceDescription>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {plan.steps.map((step) => (
            <TraceLine
              key={step.title}
              status={
                step.status === "pending"
                  ? "pending"
                  : streaming && step.status === "running"
                    ? "running"
                    : undefined
              }
            >
              <TraceIcon>
                {step.status === "done" ? (
                  <CircleCheckIcon />
                ) : step.status === "running" ? (
                  <CircleDotIcon />
                ) : (
                  <CircleIcon />
                )}
              </TraceIcon>
              <TraceTitle>{step.title}</TraceTitle>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function PlanDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
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
        const plan = message.parts.find((part) => part.type === "data-plan")
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {plan && (
                <Trace>
                  <PlanRow plan={plan.data} streaming={streaming} />
                </Trace>
              )}
              {text && <p>{text}</p>}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onPress={() => {
            setMessages([])
            sendMessage(question)
          }}
        >
          Replay
        </Button>
      )}
    </div>
  )
}
