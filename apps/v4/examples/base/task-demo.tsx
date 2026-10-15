"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/styles/base-rhea/ui/bubble"
import { Button } from "@/styles/base-rhea/ui/button"
import { Message, MessageContent } from "@/styles/base-rhea/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/base-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  {
    task: {
      title: string
      steps: { title: string; status: "done" | "running" | "error" }[]
    }
  }
>

type TaskPart = Extract<ChatMessage["parts"][number], { type: "data-task" }>

type Status = "running" | "error" | undefined

const TASKS = [
  {
    id: "find",
    title: ["Finding the project files", "Found the project files"],
    steps: [
      ["Searching for generateMetadata", "Searched for generateMetadata"],
      ["Reading app/layout.tsx", "Read app/layout.tsx"],
      ["Reading app/page.tsx", "Read app/page.tsx"],
    ],
  },
  {
    id: "update",
    title: ["Updating the page metadata", "Updated the page metadata"],
    steps: [
      ["Editing app/layout.tsx", "Edited app/layout.tsx"],
      ["Editing app/page.tsx", "Edited app/page.tsx"],
    ],
  },
]

function taskAt(task: (typeof TASKS)[number], done: number) {
  return {
    title: task.title[done < task.steps.length ? 0 : 1],
    steps: task.steps.slice(0, done + 1).map(([running, finished], index) => ({
      title: index < done ? finished : running,
      status: index < done ? "done" : "running",
    })),
  } satisfies TaskPart["data"]
}

const chat = createChat<ChatMessage>()
  .user("Add Open Graph metadata to the home page.")
  .assistant(({ writer }) => {
    TASKS.forEach((task) => {
      for (let done = 0; done <= task.steps.length; done++) {
        writer
          .data({ type: "data-task", id: task.id, data: taskAt(task, done) })
          .sleep(900)
      }
    })
    writer.text(
      "Added Open Graph defaults to app/layout.tsx and a title, description and image for the home page in app/page.tsx."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function getStepStatus(
  status: TaskPart["data"]["steps"][number]["status"],
  streaming: boolean
): Status {
  if (status === "done") {
    return undefined
  }

  return status === "running" && streaming ? "running" : "error"
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "running") {
    return <LoaderCircleIcon className="animate-spin" />
  }

  return status === "error" ? <CircleAlertIcon /> : <CircleCheckIcon />
}

function TaskRow({
  task,
  streaming,
}: {
  task: TaskPart["data"]
  streaming: boolean
}) {
  const [open, setOpen] = React.useState<boolean>()
  const steps = task.steps.map((step) => ({
    title: step.title,
    status: getStepStatus(step.status, streaming),
  }))
  const status = steps.some((step) => step.status === "error")
    ? "error"
    : steps.some((step) => step.status === "running")
      ? "running"
      : undefined

  return (
    <TraceCollapsible
      open={open ?? status === "running"}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={status}>
          <TraceIcon>
            <StatusIcon status={status} />
          </TraceIcon>
          <TraceTitle>{task.title}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          {steps.map((step) => (
            <TraceLine key={step.title} status={step.status}>
              <TraceTitle>{step.title}</TraceTitle>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function TaskDemo() {
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
        const tasks = message.parts.filter((part) => part.type === "data-task")
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tasks.length > 0 && (
                <Trace>
                  {tasks.map((part) => (
                    <TaskRow
                      key={part.id}
                      task={part.data}
                      streaming={streaming}
                    />
                  ))}
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
          onClick={() => {
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
