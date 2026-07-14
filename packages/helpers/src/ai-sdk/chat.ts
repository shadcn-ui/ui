import type {
  ChatTransport,
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
} from "ai"

import { createChatRuntime, wait } from "../core"
import type { Chat, ChatOptions } from "../core"
import { createAiSdkFormat } from "./format"

/** Options for creating an AI SDK chat, optionally hydrated from existing messages. */
export type CreateChatOptions<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> = ChatOptions & {
  messages?: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>
}

export type YieldMessagePartsOptions = {
  /** Also yield an initial snapshot with zero parts. */
  includeEmpty?: boolean
}

export type StreamMessagePartsOptions = YieldMessagePartsOptions & {
  /** Delay before each snapshot. */
  delayMs?: number
}

/** The chat type returned by the AI SDK adapter's `createChat`. */
export type AiSdkChat<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> = Chat<
  UIMessage<METADATA, DATA_PARTS, TOOLS>,
  UIMessagePart<DATA_PARTS, TOOLS>,
  ChatTransport<UIMessage<METADATA, DATA_PARTS, TOOLS>>,
  METADATA,
  DATA_PARTS,
  TOOLS
>

/**
 * Yields progressive copies of a message — one more part per snapshot — for
 * rendering "message assembling itself" states without a transport.
 */
export function* yieldMessageParts<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(
  message: UIMessage<METADATA, DATA_PARTS, TOOLS>,
  options: YieldMessagePartsOptions = {}
) {
  if (options.includeEmpty) {
    yield {
      ...message,
      parts: [],
    }
  }

  for (let index = 0; index < message.parts.length; index++) {
    yield {
      ...message,
      parts: message.parts.slice(0, index + 1),
    }
  }
}

/** Async variant of {@link yieldMessageParts} that waits `delayMs` before each snapshot. */
export async function* streamMessageParts<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(
  message: UIMessage<METADATA, DATA_PARTS, TOOLS>,
  options: StreamMessagePartsOptions = {}
) {
  const snapshots = yieldMessageParts(message, options)

  while (true) {
    const snapshot = snapshots.next()

    if (snapshot.done) {
      break
    }

    if (options.delayMs) {
      await wait(options.delayMs)
    }

    yield snapshot.value
  }
}

/** Creates an AI SDK chat, optionally hydrated from existing messages. */
export function createChat<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(options: CreateChatOptions<METADATA, DATA_PARTS, TOOLS> = {}) {
  const { messages, ...chatOptions } = options

  return createChatRuntime(createAiSdkFormat<METADATA, DATA_PARTS, TOOLS>(), {
    ...chatOptions,
    messages,
  })
}
