"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  ListChecksIcon,
} from "lucide-react"

import { createChat } from "@/lib/ai"
import { Button } from "@/styles/radix-rhea/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

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
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            <ListChecksIcon />
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
        const streaming = busy && message === messages.at(-1)
        const plan = message.parts.find((part) => part.type === "data-plan")
        const text = message.parts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("")

        return (
          <div key={message.id} className="flex flex-col gap-4">
            {plan && (
              <Trace>
                <PlanRow plan={plan.data} streaming={streaming} />
              </Trace>
            )}
            {text && (
              <p
                className={message.role === "user" ? "font-medium" : undefined}
              >
                {text}
              </p>
            )}
          </div>
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        disabled={busy}
        onClick={() => {
          setMessages([])
          sendMessage(question)
        }}
      >
        Replay
      </Button>
    </div>
  )
}
