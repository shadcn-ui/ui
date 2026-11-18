"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  ListChecksIcon,
  ListTodoIcon,
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
  UIDataTypes,
  {
    writeTodos: {
      input: {
        todos: {
          content: string
          status: "pending" | "in_progress" | "completed"
        }[]
      }
      output: string
    }
  }
>

type Todo = Extract<
  ChatMessage["parts"][number],
  { type: "tool-writeTodos"; state: "input-available" }
>["input"]["todos"][number]

const TODOS = [
  "Add a dark variant to the theme tokens",
  "Read the theme from a cookie",
  "Add a toggle to the settings page",
  "Check contrast on the charts",
]

function todosAt(current: number) {
  return TODOS.map(
    (content, index) =>
      ({
        content,
        status:
          index < current
            ? "completed"
            : index === current
              ? "in_progress"
              : "pending",
      }) satisfies Todo
  )
}

const chat = createChat<ChatMessage>()
  .user("Add dark mode to the settings page.")
  .assistant(({ writer }) => {
    TODOS.forEach((_, index) => {
      writer
        .tool("writeTodos", { input: { todos: todosAt(index) } })
        .output("Updated the todo list.")
      writer.sleep(1400)
    })
    writer
      .tool("writeTodos", { input: { todos: todosAt(TODOS.length) } })
      .output("Updated the todo list.")
    writer.text("Dark mode is in. The toggle is under Settings, Appearance.")
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function TodoLine({ todo, streaming }: { todo: Todo; streaming: boolean }) {
  return (
    <TraceLine
      status={
        streaming && todo.status === "in_progress" ? "running" : undefined
      }
    >
      <TraceIcon>
        {todo.status === "completed" ? (
          <CircleCheckIcon />
        ) : todo.status === "in_progress" ? (
          <CircleDotIcon />
        ) : (
          <CircleIcon />
        )}
      </TraceIcon>
      <TraceTitle>{todo.content}</TraceTitle>
    </TraceLine>
  )
}

function TodoQueue({
  todos,
  streaming,
}: {
  todos: Todo[]
  streaming: boolean
}) {
  const pending = todos.filter((todo) => todo.status !== "completed")
  const completed = todos.filter((todo) => todo.status === "completed")

  return (
    <Trace>
      {pending.length > 0 && (
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <ListTodoIcon />
              </TraceIcon>
              <TraceTitle>{pending.length} to do</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {pending.map((todo) => (
                <TodoLine
                  key={todo.content}
                  todo={todo}
                  streaming={streaming}
                />
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      )}
      {completed.length > 0 && (
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <ListChecksIcon />
              </TraceIcon>
              <TraceTitle>{completed.length} completed</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {completed.map((todo) => (
                <TodoLine
                  key={todo.content}
                  todo={todo}
                  streaming={streaming}
                />
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      )}
    </Trace>
  )
}

export function QueueDemo() {
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
        const todos = message.parts
          .filter((part) => part.type === "tool-writeTodos")
          .filter((part) => part.state !== "input-streaming")
          .at(-1)?.input?.todos
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {todos && <TodoQueue todos={todos} streaming={streaming} />}
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
