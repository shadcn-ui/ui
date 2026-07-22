import type {
  AnyClientTool,
  UIMessage as ClientUIMessage,
  ConnectConnectionAdapter,
  MessagePart,
  RunAgentInputContext,
} from "@tanstack/ai-client"
import type { ModelMessage, StreamChunk, UIMessage } from "@tanstack/ai/client"

import { assertNever } from "../core"
import type {
  ChatFormat,
  ChunkEncoder,
  DataTypes,
  JsonRecord,
  MessageRole,
  ToolSet,
  TransportContext,
  TurnStreamOptions,
} from "../core"
import { eventsFromParts, getMessageText, materializeParts } from "./parts"
import type {
  TanStackEventData,
  TanStackMessageMetadata,
  TanStackToolSet,
} from "./types"

/** Ids stamped onto every AG-UI event of one run. Taken from `runContext` when the client connects. */
export type TanStackRunIds = {
  threadId: string
  runId: string
  messageId: string
}

// AG-UI event discriminants are typed as @ag-ui/core enum members
// (nominal), so plain string literals are not assignable even though the
// runtime values are identical. This is the single cast point.
function asStreamChunk(chunk: JsonRecord): StreamChunk {
  return chunk as unknown as StreamChunk
}

/**
 * Creates a `NeutralChunk` → AG-UI event encoder scoped to one run. Chunks
 * with no AG-UI equivalent (`abort`, files, sources, `start-step`,
 * `tool-output-denied`) encode to `null`; data and custom parts become
 * `CUSTOM` events.
 */
export function createRunEncoder<
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
>(
  runIds: TanStackRunIds
): ChunkEncoder<StreamChunk, TanStackMessageMetadata, DATA, TOOLS> {
  const { threadId, runId, messageId } = runIds

  return (chunk) => {
    switch (chunk.type) {
      case "start":
        return asStreamChunk({
          type: "RUN_STARTED",
          threadId,
          runId,
        })
      case "finish":
        return asStreamChunk({
          type: "RUN_FINISHED",
          threadId,
          runId,
          finishReason: "stop",
        })
      case "error":
        return asStreamChunk({
          type: "RUN_ERROR",
          message: chunk.errorText,
        })
      case "text-start":
        return asStreamChunk({
          type: "TEXT_MESSAGE_START",
          messageId,
          role: "assistant",
        })
      case "text-delta":
        return asStreamChunk({
          type: "TEXT_MESSAGE_CONTENT",
          messageId,
          delta: chunk.delta,
        })
      case "text-end":
        return asStreamChunk({
          type: "TEXT_MESSAGE_END",
          messageId,
        })
      case "reasoning-start":
        return asStreamChunk({
          type: "REASONING_MESSAGE_START",
          messageId,
          role: "reasoning",
        })
      case "reasoning-delta":
        return asStreamChunk({
          type: "REASONING_MESSAGE_CONTENT",
          messageId,
          delta: chunk.delta,
        })
      case "reasoning-end":
        return asStreamChunk({
          type: "REASONING_MESSAGE_END",
          messageId,
        })
      case "tool-input-available":
        return [
          asStreamChunk({
            type: "TOOL_CALL_START",
            toolCallId: chunk.toolCallId,
            toolCallName: chunk.toolName,
            toolName: chunk.toolName,
            parentMessageId: messageId,
          }),
          asStreamChunk({
            type: "TOOL_CALL_ARGS",
            toolCallId: chunk.toolCallId,
            delta: JSON.stringify(chunk.input ?? {}),
          }),
          asStreamChunk({
            type: "TOOL_CALL_END",
            toolCallId: chunk.toolCallId,
            toolCallName: chunk.toolName,
            input: chunk.input,
          }),
        ]
      case "tool-output-available":
        return asStreamChunk({
          type: "TOOL_CALL_RESULT",
          messageId: `${chunk.toolCallId}-result`,
          toolCallId: chunk.toolCallId,
          content: JSON.stringify(chunk.output ?? {}),
          role: "tool",
        })
      case "tool-output-error":
        return asStreamChunk({
          type: "TOOL_CALL_RESULT",
          messageId: `${chunk.toolCallId}-result`,
          toolCallId: chunk.toolCallId,
          content: chunk.errorText,
          role: "tool",
          state: "output-error",
        })
      case "data":
        return asStreamChunk({
          type: "CUSTOM",
          name: `data-${chunk.name}`,
          value: {
            id: chunk.id,
            data: chunk.data,
            transient: chunk.transient,
          },
        })
      case "custom":
        return asStreamChunk({
          type: "CUSTOM",
          name: chunk.part.kind,
          value: chunk.part,
        })
      case "abort":
      case "tool-output-denied":
      case "start-step":
      case "file":
      case "reasoning-file":
      case "source-url":
      case "source-document":
        // These chunks have no AG-UI streaming equivalent.
        return null
      default:
        return assertNever(chunk)
    }
  }
}

/**
 * Wraps a `ReadableStream` as an `AsyncIterable` via `getReader()` (Safari
 * lacks native stream iteration). Returned synchronously, as TanStack's
 * connection contract requires; early `for await` exits cancel the reader.
 */
export function streamToAsyncIterable<T>(
  stream: ReadableStream<T>
): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const reader = stream.getReader()

      return {
        async next(): Promise<IteratorResult<T>> {
          const { done, value } = await reader.read()

          if (done) {
            return { done: true, value: undefined }
          }

          return { done: false, value }
        },

        async return(): Promise<IteratorResult<T>> {
          await reader.cancel()

          return { done: true, value: undefined }
        },
      }
    },
  }
}

/**
 * The TanStack AI `ChatFormat` plugin. Its transport is a
 * `ConnectConnectionAdapter` for `useChat({ connection })` and throws
 * `"No assistant response found for this transcript."` when no assistant
 * response remains.
 */
export function createTanStackFormat<
  TOOLS extends ReadonlyArray<AnyClientTool> = AnyClientTool[],
  DATA = unknown,
>(): ChatFormat<
  ClientUIMessage<TOOLS, DATA>,
  MessagePart<TOOLS, DATA>,
  StreamChunk,
  ConnectConnectionAdapter,
  TanStackMessageMetadata,
  TanStackEventData,
  TanStackToolSet<TOOLS>
> {
  return {
    materializeParts(events) {
      return materializeParts<TOOLS, DATA>(events)
    },

    eventsFromParts(parts) {
      return eventsFromParts<TOOLS, DATA>(parts)
    },

    createMessage(input) {
      const message: ClientUIMessage<TOOLS, DATA> = {
        id: input.id,
        role: input.role,
        parts: input.parts,
      }
      const createdAt = input.metadata.createdAt

      if (typeof createdAt === "string" || createdAt instanceof Date) {
        message.createdAt = new Date(createdAt)
      }

      return message
    },

    getMessageId(message) {
      return message.id
    },

    getMessageRole(message) {
      return message.role as MessageRole
    },

    getMessageText(message) {
      return getMessageText(message)
    },

    getMessageParts(message) {
      return message.parts
    },

    getMessageMetadata(message) {
      return {
        createdAt: message.createdAt,
      }
    },

    createTransport(context, options = {}) {
      return createConnectionAdapter<TOOLS, DATA>(context, options)
    },
  }
}

function createConnectionAdapter<
  TOOLS extends ReadonlyArray<AnyClientTool>,
  DATA,
>(
  context: TransportContext<
    ClientUIMessage<TOOLS, DATA>,
    StreamChunk,
    TanStackMessageMetadata,
    TanStackEventData,
    TanStackToolSet<TOOLS>
  >,
  options: TurnStreamOptions
): ConnectConnectionAdapter {
  return {
    connect(
      messages: UIMessage[] | ModelMessage[],
      _data?: Record<string, unknown>,
      abortSignal?: AbortSignal,
      runContext?: RunAgentInputContext
    ) {
      // The chat client hands custom adapters the full UIMessage history.
      const turn = context.resolveTurn(
        messages as ClientUIMessage<TOOLS, DATA>[]
      )

      if (!turn) {
        throw new Error("No assistant response found for this transcript.")
      }

      const encode = createRunEncoder<
        TanStackEventData,
        TanStackToolSet<TOOLS>
      >({
        threadId: runContext?.threadId ?? "thread-chat",
        runId: runContext?.runId ?? "run-chat",
        messageId: turn.message.id,
      })
      return streamToAsyncIterable(
        context.streamTurn(turn, encode, options, abortSignal)
      )
    },
  }
}
