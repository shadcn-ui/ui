import type {
  AnyClientTool,
  UIMessage as ClientUIMessage,
  ConnectConnectionAdapter,
  MessagePart,
} from "@tanstack/ai-client"
import type { StreamChunk } from "@tanstack/ai/client"

import { createChatRuntime } from "../core"
import type { Chat, ChatOptions } from "../core"
import { createTanStackFormat } from "./format"
import type {
  TanStackEventData,
  TanStackMessageMetadata,
  TanStackToolSet,
  TanStackWriter,
} from "./types"

/** Options for creating a TanStack AI chat, optionally hydrated from existing messages. */
export type CreateChatOptions<
  TOOLS extends ReadonlyArray<AnyClientTool> = AnyClientTool[],
  DATA = unknown,
> = Omit<ChatOptions, "sourceIdPrefix"> & {
  messages?: Array<ClientUIMessage<TOOLS, DATA>>
}

/** The chat type returned by the TanStack AI adapter's `createChat`. */
export type TanStackChat<
  TOOLS extends ReadonlyArray<AnyClientTool> = AnyClientTool[],
  DATA = unknown,
> = Chat<
  ClientUIMessage<TOOLS, DATA>,
  MessagePart<TOOLS, DATA>,
  ConnectConnectionAdapter,
  TanStackMessageMetadata,
  TanStackEventData,
  TanStackToolSet<TOOLS>,
  TanStackWriter<TOOLS>
>

/** Creates a TanStack AI chat, optionally hydrated from existing messages. */
export function createChat<
  TOOLS extends ReadonlyArray<AnyClientTool> = AnyClientTool[],
  DATA = unknown,
>(options: CreateChatOptions<TOOLS, DATA> = {}) {
  const { messages, ...chatOptions } = options

  return createChatRuntime<
    ClientUIMessage<TOOLS, DATA>,
    MessagePart<TOOLS, DATA>,
    StreamChunk,
    ConnectConnectionAdapter,
    TanStackMessageMetadata,
    TanStackEventData,
    TanStackToolSet<TOOLS>,
    TanStackWriter<TOOLS>
  >(createTanStackFormat<TOOLS, DATA>(), {
    ...chatOptions,
    messages,
  })
}
