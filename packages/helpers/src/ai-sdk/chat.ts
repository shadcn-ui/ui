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

// Local equivalents of the AI SDK's InferUIMessage* utilities; not all of
// them are exported from the pinned ai version.
type MessageMetadata<UI_MESSAGE extends UIMessage> =
  UI_MESSAGE extends UIMessage<infer METADATA> ? METADATA : unknown

type MessageData<UI_MESSAGE extends UIMessage> =
  UI_MESSAGE extends UIMessage<unknown, infer DATA_PARTS>
    ? DATA_PARTS
    : UIDataTypes

type MessageTools<UI_MESSAGE extends UIMessage> =
  UI_MESSAGE extends UIMessage<unknown, UIDataTypes, infer TOOLS>
    ? TOOLS
    : UITools

/** Options for creating an AI SDK chat, optionally hydrated from existing messages. */
export type CreateChatOptions<UI_MESSAGE extends UIMessage = UIMessage> =
  ChatOptions & {
    messages?: Array<
      UIMessage<
        MessageMetadata<UI_MESSAGE>,
        MessageData<UI_MESSAGE>,
        MessageTools<UI_MESSAGE>
      >
    >
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
export type AiSdkChat<UI_MESSAGE extends UIMessage = UIMessage> = Chat<
  UIMessage<
    MessageMetadata<UI_MESSAGE>,
    MessageData<UI_MESSAGE>,
    MessageTools<UI_MESSAGE>
  >,
  UIMessagePart<MessageData<UI_MESSAGE>, MessageTools<UI_MESSAGE>>,
  ChatTransport<
    UIMessage<
      MessageMetadata<UI_MESSAGE>,
      MessageData<UI_MESSAGE>,
      MessageTools<UI_MESSAGE>
    >
  >,
  MessageMetadata<UI_MESSAGE>,
  MessageData<UI_MESSAGE>,
  MessageTools<UI_MESSAGE>
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

/**
 * Creates an AI SDK chat, optionally hydrated from existing messages. Generic
 * over the UI message type, mirroring `useChat`.
 */
export function createChat<UI_MESSAGE extends UIMessage = UIMessage>(
  options: CreateChatOptions<UI_MESSAGE> = {}
) {
  const { messages, ...chatOptions } = options

  return createChatRuntime(
    createAiSdkFormat<
      MessageMetadata<UI_MESSAGE>,
      MessageData<UI_MESSAGE>,
      MessageTools<UI_MESSAGE>
    >(),
    {
      ...chatOptions,
      messages,
    }
  )
}
