import { createChatRuntime } from "./chat"
import type {
  ChatEvent,
  ChatFormat,
  DataTypes,
  MessageRole,
  NeutralChunk,
  StreamStep,
  ToolSet,
  TransportContext,
  TurnStreamOptions,
} from "./types"

export type TestData = {
  weather: {
    city: string
    status: "loading" | "success"
  }
}

export type TestTools = {
  getWeather: {
    input: {
      city: string
    }
    output: {
      temperature: number
    }
  }
}

export type TestPart = {
  type: string
  [key: string]: unknown
}

export type TestMessage = {
  id: string
  role: MessageRole
  metadata?: unknown
  parts: TestPart[]
}

export type TestTransport<
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> = {
  context: TransportContext<
    TestMessage,
    NeutralChunk<unknown, DATA, TOOLS>,
    unknown,
    DATA,
    TOOLS
  >
  options?: TurnStreamOptions
}

export function createTestFormat<
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
>(): ChatFormat<
  TestMessage,
  TestPart,
  NeutralChunk<unknown, DATA, TOOLS>,
  TestTransport<DATA, TOOLS>,
  unknown,
  DATA,
  TOOLS
> {
  return {
    materializeParts(events) {
      const parts: TestPart[] = []

      for (const event of events) {
        if (event.kind === "text") {
          parts.push({ type: "text", text: event.text })
        }

        if (event.kind === "reasoning") {
          parts.push({ type: "reasoning", text: event.text })
        }

        if (event.kind === "data" && !event.transient) {
          parts.push({
            type: `data-${event.name}`,
            id: event.id,
            data: event.data,
          })
        }

        if (event.kind === "tool-input") {
          parts.push({
            type: `tool-${event.name}`,
            toolCallId: event.toolCallId,
            state: "input-available",
            input: event.input,
          })
        }

        if (event.kind === "tool-output") {
          const index = parts.findIndex(
            (part) => part.toolCallId === event.toolCallId
          )

          if (index !== -1) {
            parts[index] = {
              ...parts[index],
              state: "output-available",
              output: event.output,
            }
          }
        }

        if (event.kind === "file") {
          parts.push({ type: "file", ...event.part })
        }
      }

      return parts
    },

    eventsFromParts(parts) {
      const events: ChatEvent<DATA, TOOLS>[] = []

      for (const part of parts) {
        if (part.type === "text") {
          events.push({
            kind: "text",
            id: `text-${events.length + 1}`,
            text: part.text as string,
            options: {
              mode: "instant",
            },
          })
        }
      }

      return events
    },

    createMessage(input) {
      return { ...input }
    },

    getMessageId(message) {
      return message.id
    },

    getMessageRole(message) {
      return message.role
    },

    getMessageText(message) {
      return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
    },

    getMessageParts(message) {
      return message.parts
    },

    createTransport(context, options) {
      return { context, options }
    },
  }
}

export function createTestChat() {
  return createChatRuntime<
    TestMessage,
    TestPart,
    NeutralChunk<unknown, TestData, TestTools>,
    TestTransport<TestData, TestTools>,
    unknown,
    TestData,
    TestTools
  >(createTestFormat<TestData, TestTools>())
}

export async function readStream<T>(stream: ReadableStream<T>) {
  const chunks = []
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
  }

  return chunks
}

export function chunkSteps(steps: StreamStep[]) {
  return steps.map((step) =>
    step.kind === "chunk" ? step.chunk.type : step.kind
  )
}
