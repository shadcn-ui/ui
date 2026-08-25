import type {
  ChatTransport,
  InferUIMessageChunk,
  TextUIPart,
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
} from "ai"

import { assertNever } from "../core"
import type { ChatFormat, ChunkEncoder } from "../core"
import { eventsFromParts, getMessageText, materializeParts } from "./parts"

/**
 * The AI SDK `ChatFormat` plugin. Pass to `createChatRuntime` for advanced
 * composition; `createChat` wires it up for you. Its transport `satisfies
 * ChatTransport` and throws `"No assistant response found for this transcript."`
 * when no assistant response remains.
 */
export function createAiSdkFormat<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(): ChatFormat<
  UIMessage<METADATA, DATA_PARTS, TOOLS>,
  UIMessagePart<DATA_PARTS, TOOLS>,
  InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>,
  ChatTransport<UIMessage<METADATA, DATA_PARTS, TOOLS>>,
  METADATA,
  DATA_PARTS,
  TOOLS
> {
  type Message = UIMessage<METADATA, DATA_PARTS, TOOLS>
  type Chunk = InferUIMessageChunk<Message>

  const format: ChatFormat<
    Message,
    UIMessagePart<DATA_PARTS, TOOLS>,
    Chunk,
    ChatTransport<Message>,
    METADATA,
    DATA_PARTS,
    TOOLS
  > & {
    encodeChunk: ChunkEncoder<Chunk, METADATA, DATA_PARTS, TOOLS>
  } = {
    materializeParts,
    eventsFromParts,

    createMessage(input) {
      // User turns never stream, so their text parts carry no `state` —
      // matching messages hand-built from `parts.text()`.
      const parts =
        input.role === "user"
          ? input.parts.map((part) => {
              if (part.type !== "text") {
                return part
              }

              const { state: _state, ...textPart } = part as TextUIPart

              return textPart as UIMessagePart<DATA_PARTS, TOOLS>
            })
          : input.parts

      return {
        id: input.id,
        role: input.role,
        metadata: input.metadata,
        parts,
      } as Message
    },

    getMessageId(message) {
      return message.id
    },

    getMessageRole(message) {
      return message.role
    },

    getMessageText(message) {
      return getMessageText(message)
    },

    getMessageParts(message) {
      return message.parts
    },

    getMessageMetadata(message) {
      return message.metadata
    },

    encodeChunk(chunk) {
      switch (chunk.type) {
        case "start":
          // The client adopts this id for the streamed assistant message, so
          // live transcripts keep the configured ids that turn matching,
          // fallback, and regeneration rely on.
          return {
            type: "start",
            messageId: chunk.messageId,
          } as Chunk
        case "start-step":
          return {
            type: "start-step",
          } as Chunk
        case "finish":
          return {
            type: "finish",
            finishReason: chunk.finishReason,
            messageMetadata: chunk.messageMetadata,
          } as Chunk
        case "abort":
          return {
            type: "abort",
            reason: chunk.reason,
          } as Chunk
        case "error":
          return {
            type: "error",
            errorText: chunk.errorText,
          } as Chunk
        case "text-start":
          return {
            type: "text-start",
            id: chunk.id,
          } as Chunk
        case "text-delta":
          return {
            type: "text-delta",
            id: chunk.id,
            delta: chunk.delta,
          } as Chunk
        case "text-end":
          return {
            type: "text-end",
            id: chunk.id,
          } as Chunk
        case "reasoning-start":
          return {
            type: "reasoning-start",
            id: chunk.id,
          } as Chunk
        case "reasoning-delta":
          return {
            type: "reasoning-delta",
            id: chunk.id,
            delta: chunk.delta,
          } as Chunk
        case "reasoning-end":
          return {
            type: "reasoning-end",
            id: chunk.id,
          } as Chunk
        case "data":
          return {
            type: `data-${chunk.name}`,
            id: chunk.id,
            data: chunk.data,
            transient: chunk.transient,
          } as Chunk
        case "tool-input-available":
          return {
            type: "tool-input-available",
            toolCallId: chunk.toolCallId,
            toolName: chunk.toolName,
            input: chunk.input,
            providerExecuted: chunk.providerExecuted,
            toolMetadata: chunk.toolMetadata,
            dynamic: chunk.dynamic,
            title: chunk.title,
          } as Chunk
        case "tool-output-available":
          return {
            type: "tool-output-available",
            toolCallId: chunk.toolCallId,
            output: chunk.output,
            providerExecuted: chunk.providerExecuted,
            toolMetadata: chunk.toolMetadata,
            dynamic: chunk.dynamic,
          } as Chunk
        case "tool-output-error":
          return {
            type: "tool-output-error",
            toolCallId: chunk.toolCallId,
            errorText: chunk.errorText,
            providerExecuted: chunk.providerExecuted,
            toolMetadata: chunk.toolMetadata,
            dynamic: chunk.dynamic,
          } as Chunk
        case "tool-output-denied":
          return {
            type: "tool-output-denied",
            toolCallId: chunk.toolCallId,
          } as Chunk
        case "file":
          return {
            type: "file",
            filename: chunk.part.filename,
            mediaType: chunk.part.mediaType,
            url: chunk.part.url,
            providerMetadata: chunk.part.providerMetadata,
          } as Chunk
        case "reasoning-file":
          return {
            ...chunk.part,
            type: "reasoning-file",
          } as Chunk
        case "source-url":
          return {
            ...chunk.part,
            type: "source-url",
          } as Chunk
        case "source-document":
          return {
            ...chunk.part,
            type: "source-document",
          } as Chunk
        case "custom":
          return {
            ...chunk.part,
            type: "custom",
          } as Chunk
        default:
          return assertNever(chunk)
      }
    },

    createTransport(transportContext, options = {}) {
      return {
        async sendMessages({ messages, messageId, abortSignal }) {
          const turn = transportContext.resolveTurn(messages, messageId)

          if (!turn) {
            throw new Error("No assistant response found for this transcript.")
          }

          return transportContext.streamTurn(
            turn,
            format.encodeChunk,
            options,
            abortSignal
          )
        },

        async reconnectToStream() {
          return null
        },
      } satisfies ChatTransport<Message>
    },
  }

  return format
}
