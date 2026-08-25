import type {
  CustomContentUIPart,
  DynamicToolUIPart,
  FileUIPart,
  ReasoningFileUIPart,
  ReasoningUIPart,
  SourceDocumentUIPart,
  SourceUrlUIPart,
  StepStartUIPart,
  TextUIPart,
  ToolUIPart,
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
} from "ai"

import { assertNever } from "../core"
import type { ChatEvent } from "../core"

/** Concatenates the text of every `text` part in a message. */
export function getMessageText(message: Pick<UIMessage, "parts">) {
  return message.parts
    .filter((part): part is TextUIPart => part.type === "text")
    .map((part) => part.text)
    .join("")
}

/** Replaces the part with the same `type` + `id` in place, or appends. */
export function replaceOrPushPart<
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>,
  part: UIMessagePart<DATA_PARTS, TOOLS>
) {
  if ("id" in part && part.id) {
    const index = parts.findIndex(
      (currentPart) =>
        currentPart.type === part.type &&
        "id" in currentPart &&
        currentPart.id === part.id
    )

    if (index !== -1) {
      parts[index] = part
      return
    }
  }

  parts.push(part)
}

function findToolPartIndex<
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>, toolCallId: string) {
  return parts.findIndex(
    (part) =>
      (part.type === "dynamic-tool" || part.type.startsWith("tool-")) &&
      "toolCallId" in part &&
      part.toolCallId === toolCallId
  )
}

/** Materializes an event log into final AI SDK message parts (transient data excluded). */
export function materializeParts<
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(
  events: ChatEvent<DATA_PARTS, TOOLS>[]
): Array<UIMessagePart<DATA_PARTS, TOOLS>> {
  const parts: Array<UIMessagePart<DATA_PARTS, TOOLS>> = []

  for (const event of events) {
    switch (event.kind) {
      case "text": {
        parts.push({
          type: "text",
          text: event.text,
          state: "done",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "reasoning": {
        parts.push({
          type: "reasoning",
          text: event.text,
          state: "done",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "data": {
        if (event.transient) {
          continue
        }

        replaceOrPushPart(parts, {
          type: `data-${event.name}`,
          id: event.id,
          data: event.data,
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "tool-input": {
        replaceOrPushPart(parts, {
          type: event.dynamic ? "dynamic-tool" : `tool-${event.name}`,
          ...(event.dynamic ? { toolName: event.name } : {}),
          toolCallId: event.toolCallId,
          title: event.title,
          toolMetadata: event.toolMetadata,
          providerExecuted: event.providerExecuted,
          state: "input-available",
          input: event.input,
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "tool-output": {
        const index = findToolPartIndex(parts, event.toolCallId)

        if (index !== -1) {
          parts[index] = {
            ...parts[index],
            state: "output-available",
            output: event.output,
            providerExecuted: event.providerExecuted,
            toolMetadata: event.toolMetadata,
          } as UIMessagePart<DATA_PARTS, TOOLS>
        }
        break
      }
      case "tool-error": {
        const index = findToolPartIndex(parts, event.toolCallId)

        if (index !== -1) {
          parts[index] = {
            ...parts[index],
            state: "output-error",
            errorText: event.errorText,
            providerExecuted: event.providerExecuted,
            toolMetadata: event.toolMetadata,
          } as UIMessagePart<DATA_PARTS, TOOLS>
        }
        break
      }
      case "tool-denied": {
        const index = findToolPartIndex(parts, event.toolCallId)

        if (index !== -1) {
          parts[index] = {
            ...parts[index],
            state: "output-denied",
          } as UIMessagePart<DATA_PARTS, TOOLS>
        }
        break
      }
      case "source-url": {
        parts.push({
          ...event.part,
          type: "source-url",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "source-document": {
        parts.push({
          ...event.part,
          type: "source-document",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "file": {
        parts.push({
          ...event.part,
          type: "file",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "reasoning-file": {
        parts.push({
          ...event.part,
          type: "reasoning-file",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "custom": {
        parts.push({
          ...event.part,
          type: "custom",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "step-start": {
        parts.push({
          type: "step-start",
        } as UIMessagePart<DATA_PARTS, TOOLS>)
        break
      }
      case "sleep":
      case "error":
        break
      default:
        assertNever(event)
    }
  }

  return parts
}

/** Parses AI SDK message parts back into an event log so static parts can stream. */
export function eventsFromParts<
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>
): ChatEvent<DATA_PARTS, TOOLS>[] {
  const events: ChatEvent<DATA_PARTS, TOOLS>[] = []

  for (const part of parts) {
    // Framework-owned part unions are open, so parsing is non-exhaustive.
    if (part.type === "text") {
      const textPart = part as TextUIPart

      events.push({
        kind: "text",
        id: `text-${events.length + 1}`,
        text: textPart.text,
        options: {
          mode: "instant",
        },
      })
    }

    if (part.type === "reasoning") {
      const reasoningPart = part as ReasoningUIPart

      events.push({
        kind: "reasoning",
        id: `reasoning-${events.length + 1}`,
        text: reasoningPart.text,
        options: {
          mode: "instant",
        },
      })
    }

    if (part.type.startsWith("data-")) {
      events.push({
        kind: "data",
        name: part.type.replace("data-", "") as keyof DATA_PARTS & string,
        id: "id" in part ? part.id : undefined,
        data: "data" in part ? part.data : undefined,
      } as ChatEvent<DATA_PARTS, TOOLS>)
    }

    if (part.type.startsWith("tool-") && "toolCallId" in part) {
      const toolPart = part as ToolUIPart<TOOLS>
      const name = part.type.replace("tool-", "") as keyof TOOLS & string

      events.push({
        kind: "tool-input",
        name,
        toolCallId: toolPart.toolCallId,
        title: toolPart.title,
        toolMetadata: toolPart.toolMetadata,
        providerExecuted: toolPart.providerExecuted,
        input: "input" in toolPart ? toolPart.input : {},
      })

      if (toolPart.state === "output-available") {
        events.push({
          kind: "tool-output",
          toolCallId: toolPart.toolCallId,
          output: toolPart.output,
          providerExecuted: toolPart.providerExecuted,
          toolMetadata: toolPart.toolMetadata,
        })
      }

      if (toolPart.state === "output-error") {
        events.push({
          kind: "tool-error",
          toolCallId: toolPart.toolCallId,
          errorText: toolPart.errorText,
          providerExecuted: toolPart.providerExecuted,
          toolMetadata: toolPart.toolMetadata,
        })
      }

      if (toolPart.state === "output-denied") {
        events.push({
          kind: "tool-denied",
          toolCallId: toolPart.toolCallId,
        })
      }
    }

    if (part.type === "dynamic-tool") {
      const dynamicToolPart = part as DynamicToolUIPart

      events.push({
        kind: "tool-input",
        name: dynamicToolPart.toolName as keyof TOOLS & string,
        toolCallId: dynamicToolPart.toolCallId,
        title: dynamicToolPart.title,
        toolMetadata: dynamicToolPart.toolMetadata,
        providerExecuted: dynamicToolPart.providerExecuted,
        dynamic: true,
        input: "input" in dynamicToolPart ? dynamicToolPart.input : {},
      })

      if (dynamicToolPart.state === "output-available") {
        events.push({
          kind: "tool-output",
          toolCallId: dynamicToolPart.toolCallId,
          output: dynamicToolPart.output,
          providerExecuted: dynamicToolPart.providerExecuted,
          toolMetadata: dynamicToolPart.toolMetadata,
          dynamic: true,
        })
      }

      if (dynamicToolPart.state === "output-error") {
        events.push({
          kind: "tool-error",
          toolCallId: dynamicToolPart.toolCallId,
          errorText: dynamicToolPart.errorText,
          providerExecuted: dynamicToolPart.providerExecuted,
          toolMetadata: dynamicToolPart.toolMetadata,
          dynamic: true,
        })
      }

      if (dynamicToolPart.state === "output-denied") {
        events.push({
          kind: "tool-denied",
          toolCallId: dynamicToolPart.toolCallId,
        })
      }
    }

    if (part.type === "source-url") {
      const sourceUrlPart = part as SourceUrlUIPart

      events.push({
        kind: "source-url",
        part: sourceUrlPart,
      })
    }

    if (part.type === "source-document") {
      const sourceDocumentPart = part as SourceDocumentUIPart

      events.push({
        kind: "source-document",
        part: sourceDocumentPart,
      })
    }

    if (part.type === "file") {
      const filePart = part as FileUIPart

      events.push({
        kind: "file",
        part: filePart,
      })
    }

    if (part.type === "reasoning-file") {
      const reasoningFilePart = part as ReasoningFileUIPart

      events.push({
        kind: "reasoning-file",
        part: reasoningFilePart,
      })
    }

    if (part.type === "custom") {
      const customPart = part as CustomContentUIPart

      events.push({
        kind: "custom",
        part: customPart,
      })
    }

    if (part.type === "step-start") {
      events.push({
        kind: "step-start",
      })
    }
  }

  return events
}
