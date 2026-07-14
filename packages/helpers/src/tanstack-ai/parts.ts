import type { AnyClientTool, MessagePart, UIMessage } from "@tanstack/ai-client"

import { assertNever } from "../core"
import type { ChatEvent, FilePayload } from "../core"
import type { TanStackEventData, TanStackToolSet } from "./types"

type TextPart = Extract<MessagePart, { type: "text" }>
type ToolCallPart<TOOLS extends ReadonlyArray<AnyClientTool>> = Extract<
  MessagePart<TOOLS>,
  { type: "tool-call" }
>
type ToolResultPart = Extract<MessagePart, { type: "tool-result" }>

/** Options for a static TanStack `tool-result` part. */
export type ToolResultPartOptions = {
  output?: unknown
  errorText?: string
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

/** Concatenates the `content` of every `text` part in a message. */
export function getMessageText<
  TOOLS extends ReadonlyArray<AnyClientTool>,
  DATA,
>(message: Pick<UIMessage<TOOLS, DATA>, "parts">) {
  return message.parts
    .filter((part): part is TextPart => part.type === "text")
    .map((part) => part.content)
    .join("")
}

/** Converts a neutral file payload into a TanStack media part (`image`/`audio`/`video`/`document` by media type). */
export function mediaPartFromFile(file: FilePayload): MessagePart {
  const source = {
    type: "url" as const,
    value: file.url,
    mimeType: file.mediaType,
  }

  if (file.mediaType.startsWith("image/")) {
    return {
      type: "image",
      source,
    }
  }

  if (file.mediaType.startsWith("audio/")) {
    return {
      type: "audio",
      source,
    }
  }

  if (file.mediaType.startsWith("video/")) {
    return {
      type: "video",
      source,
    }
  }

  return {
    type: "document",
    source,
  }
}

function fileFromMediaPart(part: MessagePart): FilePayload | null {
  if (
    part.type !== "image" &&
    part.type !== "audio" &&
    part.type !== "video" &&
    part.type !== "document"
  ) {
    return null
  }

  if (part.source.type !== "url") {
    return null
  }

  const fallbackMediaType =
    part.type === "image"
      ? "image/png"
      : part.type === "audio"
        ? "audio/mpeg"
        : part.type === "video"
          ? "video/mp4"
          : "application/octet-stream"

  return {
    mediaType: part.source.mimeType ?? fallbackMediaType,
    url: part.source.value,
  }
}

export function createToolResultPart(
  toolCallId: string,
  options: ToolResultPartOptions = {}
): ToolResultPart {
  if (options.errorText !== undefined) {
    return {
      type: "tool-result",
      toolCallId,
      content: options.errorText,
      state: "error",
      error: options.errorText,
    }
  }

  return {
    type: "tool-result",
    toolCallId,
    content: JSON.stringify(options.output ?? {}),
    state: "complete",
  }
}

/**
 * Materializes an event log into final TanStack message parts, mirroring the
 * end state the real StreamProcessor produces (tool outputs update the
 * `tool-call` part and add a sibling `tool-result`). Data, source, custom,
 * and step events have no TanStack part and are skipped.
 */
export function materializeParts<
  TOOLS extends ReadonlyArray<AnyClientTool>,
  DATA,
>(
  events: ChatEvent<TanStackEventData, TanStackToolSet<TOOLS>>[]
): Array<MessagePart<TOOLS, DATA>> {
  const parts: Array<MessagePart<TOOLS, DATA>> = []

  function findToolCallPart(toolCallId: string) {
    const index = parts.findIndex(
      (part) => part.type === "tool-call" && part.id === toolCallId
    )

    return index === -1 ? null : (parts[index] as ToolCallPart<TOOLS>)
  }

  for (const event of events) {
    switch (event.kind) {
      case "text": {
        parts.push({
          type: "text",
          content: event.text,
        })
        break
      }
      case "reasoning": {
        parts.push({
          type: "thinking",
          content: event.text,
        })
        break
      }
      case "tool-input": {
        parts.push({
          type: "tool-call",
          id: event.toolCallId,
          name: event.name,
          arguments: JSON.stringify(event.input ?? {}),
          input: event.input ?? {},
          state: "input-complete",
        } as MessagePart<TOOLS, DATA>)
        break
      }
      case "tool-output": {
        const toolCallPart = findToolCallPart(event.toolCallId)

        if (toolCallPart) {
          toolCallPart.state = "complete"
          toolCallPart.output = event.output
        }

        parts.push(
          createToolResultPart(event.toolCallId, {
            output: event.output,
          }) as MessagePart<TOOLS, DATA>
        )
        break
      }
      case "tool-error": {
        const toolCallPart = findToolCallPart(event.toolCallId)

        if (toolCallPart) {
          toolCallPart.state = "error"
        }

        parts.push(
          createToolResultPart(event.toolCallId, {
            errorText: event.errorText,
          }) as MessagePart<TOOLS, DATA>
        )
        break
      }
      case "tool-denied": {
        const toolCallPart = findToolCallPart(event.toolCallId)

        if (toolCallPart) {
          toolCallPart.approval = {
            id: `${event.toolCallId}-approval`,
            needsApproval: true,
            approved: false,
          }
        }
        break
      }
      case "file": {
        parts.push(mediaPartFromFile(event.part) as MessagePart<TOOLS, DATA>)
        break
      }
      case "sleep":
      case "data":
      case "error":
      case "source-url":
      case "source-document":
      case "reasoning-file":
      case "custom":
      case "step-start":
        // These events have no TanStack message part.
        break
      default:
        assertNever(event)
    }
  }

  return parts
}

/** Parses TanStack message parts back into an event log so static parts can stream. */
export function eventsFromParts<
  TOOLS extends ReadonlyArray<AnyClientTool>,
  DATA,
>(
  parts: Array<MessagePart<TOOLS, DATA>>
): ChatEvent<TanStackEventData, TanStackToolSet<TOOLS>>[] {
  const events: ChatEvent<TanStackEventData, TanStackToolSet<TOOLS>>[] = []
  const resolvedToolCallIds = new Set<string>()

  for (const part of parts) {
    // Framework-owned part unions are open, so parsing is non-exhaustive.
    if (part.type === "text") {
      events.push({
        kind: "text",
        id: `text-${events.length + 1}`,
        text: part.content,
        options: {
          mode: "instant",
        },
      })
    }

    if (part.type === "thinking") {
      events.push({
        kind: "reasoning",
        id: `reasoning-${events.length + 1}`,
        text: part.content,
        options: {
          mode: "instant",
        },
      })
    }

    if (part.type === "tool-call") {
      const input =
        part.input !== undefined ? part.input : parseJson(part.arguments)

      events.push({
        kind: "tool-input",
        name: part.name as keyof TanStackToolSet<TOOLS> & string,
        toolCallId: part.id,
        input,
      })

      if (part.state === "error") {
        resolvedToolCallIds.add(part.id)
        events.push({
          kind: "tool-error",
          toolCallId: part.id,
          errorText: "Tool call failed.",
        })
      } else if (part.state === "complete" || part.output !== undefined) {
        resolvedToolCallIds.add(part.id)
        events.push({
          kind: "tool-output",
          toolCallId: part.id,
          output: part.output,
        })
      }
    }

    if (part.type === "tool-result") {
      if (resolvedToolCallIds.has(part.toolCallId)) {
        continue
      }

      resolvedToolCallIds.add(part.toolCallId)

      if (part.state === "error") {
        events.push({
          kind: "tool-error",
          toolCallId: part.toolCallId,
          errorText:
            part.error ??
            (typeof part.content === "string"
              ? part.content
              : "Tool call failed."),
        })
      } else {
        events.push({
          kind: "tool-output",
          toolCallId: part.toolCallId,
          output:
            typeof part.content === "string"
              ? parseJson(part.content)
              : part.content,
        })
      }
    }

    if (
      part.type === "image" ||
      part.type === "audio" ||
      part.type === "video" ||
      part.type === "document"
    ) {
      const file = fileFromMediaPart(part)

      if (file) {
        events.push({
          kind: "file",
          part: file,
        })
      }
    }
  }

  return events
}
