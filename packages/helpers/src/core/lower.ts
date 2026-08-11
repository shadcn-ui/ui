import type {
  ChatEvent,
  DataTypes,
  NeutralChunk,
  StreamStep,
  ToolSet,
} from "./types"
import { assertNever, splitTextDeltas } from "./utils"

/**
 * Options for {@link lowerEvents}. An `undefined` `delayMs` disables
 * delta delays entirely; `messageId` rides on the `start` chunk and
 * `messageMetadata` on the `finish` chunk.
 */
export type LowerEventsOptions<METADATA> = {
  delayMs?: number
  messageId?: string
  messageMetadata?: METADATA
}

function lowerTextEvent<
  METADATA,
  DATA extends DataTypes,
  TOOLS extends ToolSet,
>(
  steps: StreamStep<METADATA, DATA, TOOLS>[],
  event: Extract<ChatEvent<DATA, TOOLS>, { kind: "text" | "reasoning" }>,
  options: LowerEventsOptions<METADATA>
) {
  const startType = event.kind === "text" ? "text-start" : "reasoning-start"
  const deltaType = event.kind === "text" ? "text-delta" : "reasoning-delta"
  const endType = event.kind === "text" ? "text-end" : "reasoning-end"

  steps.push({
    kind: "chunk",
    chunk: {
      type: startType,
      id: event.id,
    } as NeutralChunk<METADATA, DATA, TOOLS>,
  })

  const deltas =
    event.options?.mode === "instant"
      ? [event.text]
      : splitTextDeltas(event.text)
  const delayMs = event.options?.delayMs ?? options.delayMs

  for (const delta of deltas) {
    if (delayMs) {
      steps.push({
        kind: "sleep",
        delayMs,
      })
    }

    steps.push({
      kind: "chunk",
      chunk: {
        type: deltaType,
        id: event.id,
        delta,
      } as NeutralChunk<METADATA, DATA, TOOLS>,
    })
  }

  steps.push({
    kind: "chunk",
    chunk: {
      type: endType,
      id: event.id,
    } as NeutralChunk<METADATA, DATA, TOOLS>,
  })
}

/**
 * Lowers a turn's event log into playback steps: leading `before-start`
 * sleeps precede the `start` chunk, text/reasoning split into
 * start/delta/end with per-delta sleeps, an `error` event ends the stream
 * without a `finish` chunk, and everything else maps to one chunk.
 */
export function lowerEvents<
  METADATA,
  DATA extends DataTypes,
  TOOLS extends ToolSet,
>(
  events: ChatEvent<DATA, TOOLS>[],
  options: LowerEventsOptions<METADATA>
): StreamStep<METADATA, DATA, TOOLS>[] {
  const steps: StreamStep<METADATA, DATA, TOOLS>[] = []
  let eventIndex = 0

  while (true) {
    const event = events[eventIndex]

    if (event?.kind !== "sleep" || event.phase !== "before-start") {
      break
    }

    steps.push({
      kind: "sleep",
      delayMs: event.delayMs,
    })
    eventIndex += 1
  }

  steps.push({
    kind: "chunk",
    chunk: {
      type: "start",
      messageId: options.messageId,
    },
  })

  for (const event of events.slice(eventIndex)) {
    switch (event.kind) {
      case "sleep": {
        steps.push({
          kind: "sleep",
          delayMs: event.delayMs,
        })
        break
      }
      case "text":
      case "reasoning": {
        lowerTextEvent(steps, event, options)
        break
      }
      case "data": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "data",
            name: event.name,
            id: event.id,
            data: event.data,
            transient: event.transient,
          },
        })
        break
      }
      case "tool-input": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "tool-input-available",
            toolCallId: event.toolCallId,
            toolName: event.name,
            input: event.input,
            providerExecuted: event.providerExecuted,
            toolMetadata: event.toolMetadata,
            dynamic: event.dynamic,
            title: event.title,
          },
        })
        break
      }
      case "tool-output": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "tool-output-available",
            toolCallId: event.toolCallId,
            output: event.output,
            providerExecuted: event.providerExecuted,
            toolMetadata: event.toolMetadata,
            dynamic: event.dynamic,
          },
        })
        break
      }
      case "tool-error": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "tool-output-error",
            toolCallId: event.toolCallId,
            errorText: event.errorText,
            providerExecuted: event.providerExecuted,
            toolMetadata: event.toolMetadata,
            dynamic: event.dynamic,
          },
        })
        break
      }
      case "tool-denied": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "tool-output-denied",
            toolCallId: event.toolCallId,
          },
        })
        break
      }
      case "error": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "error",
            errorText: event.errorText,
          },
        })
        steps.push({
          kind: "close",
        })

        return steps
      }
      case "source-url": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "source-url",
            part: event.part,
          },
        })
        break
      }
      case "source-document": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "source-document",
            part: event.part,
          },
        })
        break
      }
      case "file": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "file",
            part: event.part,
          },
        })
        break
      }
      case "reasoning-file": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "reasoning-file",
            part: event.part,
          },
        })
        break
      }
      case "custom": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "custom",
            part: event.part,
          },
        })
        break
      }
      case "step-start": {
        steps.push({
          kind: "chunk",
          chunk: {
            type: "start-step",
          },
        })
        break
      }
      default:
        return assertNever(event)
    }
  }

  steps.push({
    kind: "chunk",
    chunk: {
      type: "finish",
      finishReason: "stop",
      messageMetadata: options.messageMetadata,
    },
  })
  steps.push({
    kind: "close",
  })

  return steps
}
