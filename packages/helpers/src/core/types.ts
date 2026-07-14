/** A JSON-like object used for framework provider metadata. */
export type JsonRecord = Record<string, unknown>

/** Message roles supported by the framework-neutral chat model. */
export type MessageRole = "system" | "user" | "assistant"

/** Map of data part names to their payload shapes, e.g. `{ weather: { temp: number } }`. */
export type DataTypes = Record<string, unknown>

/** The input and output shapes associated with one scripted tool. */
export type ToolDefinition = {
  input: unknown
  output: unknown
}

/** Map of tool names to their `input`/`output` shapes. Structurally compatible with the AI SDK's `UITools`. */
export type ToolSet = Record<string, ToolDefinition>

/** Options for scripting a typed or dynamic tool call. */
export type ToolWriterOptions<
  TOOLS extends ToolSet,
  NAME extends keyof TOOLS,
> = {
  toolCallId?: string
  title?: string
  toolMetadata?: JsonRecord
  providerExecuted?: boolean
  input?: TOOLS[NAME]["input"]
  output?: TOOLS[NAME]["output"]
  errorText?: string
  /** Script the call as a `dynamic-tool` part instead of a typed `tool-<name>` part. */
  dynamic?: boolean
}

/**
 * Per-part streaming controls. `delayMs` overrides the transport delay for
 * this part; `mode: "instant"` emits the whole text as a single delta instead
 * of word-by-word.
 */
export type StreamTextOptions = {
  id?: string
  delayMs?: number
  mode?: "stream" | "instant"
}

/** Framework-neutral file attachment payload. */
export type FilePayload = {
  mediaType: string
  filename?: string
  url: string
  providerMetadata?: JsonRecord
}

/** Framework-neutral file attached to a reasoning part. */
export type ReasoningFilePayload = {
  mediaType: string
  filename?: string
  url: string
  providerMetadata?: JsonRecord
}

/** Framework-neutral URL source citation. */
export type SourceUrlPayload = {
  sourceId: string
  url: string
  title?: string
  providerMetadata?: JsonRecord
}

/** Framework-neutral document source citation. */
export type SourceDocumentPayload = {
  sourceId: string
  mediaType: string
  title: string
  filename?: string
  providerMetadata?: JsonRecord
}

/** Framework-neutral custom part payload. */
export type CustomPayload = {
  kind: string
  providerMetadata?: JsonRecord
}

/**
 * A typed `data-<name>` part input. Repeating an `id` updates the previous
 * part in place (reconciliation); `transient` parts stream but never
 * materialize into message parts.
 */
export type DataEventInput<DATA extends DataTypes> = {
  [NAME in keyof DATA & string]: {
    type: `data-${NAME}`
    id?: string
    data: DATA[NAME]
    transient?: boolean
  }
}[keyof DATA & string]

/**
 * One entry in a turn's event log — the framework-neutral source of truth a
 * turn is scripted as. Adapters materialize events into message parts and
 * the stream driver lowers them into chunks.
 */
export type ChatEvent<
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> =
  | { kind: "sleep"; delayMs: number; phase: "before-start" | "after-start" }
  | { kind: "text"; id: string; text: string; options?: StreamTextOptions }
  | { kind: "reasoning"; id: string; text: string; options?: StreamTextOptions }
  | {
      kind: "data"
      name: keyof DATA & string
      id?: string
      data: DATA[keyof DATA & string]
      transient?: boolean
    }
  | {
      kind: "tool-input"
      name: keyof TOOLS & string
      toolCallId: string
      title?: string
      toolMetadata?: JsonRecord
      providerExecuted?: boolean
      dynamic?: boolean
      input: unknown
    }
  | {
      kind: "tool-output"
      toolCallId: string
      output: unknown
      providerExecuted?: boolean
      toolMetadata?: JsonRecord
      dynamic?: boolean
    }
  | {
      kind: "tool-error"
      toolCallId: string
      errorText: string
      providerExecuted?: boolean
      toolMetadata?: JsonRecord
      dynamic?: boolean
    }
  | { kind: "tool-denied"; toolCallId: string }
  | { kind: "error"; errorText: string }
  | { kind: "source-url"; part: SourceUrlPayload }
  | { kind: "source-document"; part: SourceDocumentPayload }
  | { kind: "file"; part: FilePayload }
  | { kind: "reasoning-file"; part: ReasoningFilePayload }
  | { kind: "custom"; part: CustomPayload }
  | { kind: "step-start" }

/**
 * The framework-neutral stream chunk vocabulary. An adapter's
 * {@link ChunkEncoder} maps each chunk to its framework's wire format —
 * return `null` to skip a chunk the framework has no equivalent for.
 */
export type NeutralChunk<
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> =
  | { type: "start"; messageId?: string }
  | { type: "start-step" }
  | { type: "finish"; finishReason: "stop"; messageMetadata?: METADATA }
  | { type: "abort"; reason: string }
  | { type: "error"; errorText: string }
  | { type: "text-start"; id: string }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "reasoning-start"; id: string }
  | { type: "reasoning-delta"; id: string; delta: string }
  | { type: "reasoning-end"; id: string }
  | {
      type: "data"
      name: keyof DATA & string
      id?: string
      data: DATA[keyof DATA & string]
      transient?: boolean
    }
  | {
      type: "tool-input-available"
      toolCallId: string
      toolName: keyof TOOLS & string
      input: unknown
      providerExecuted?: boolean
      toolMetadata?: JsonRecord
      dynamic?: boolean
      title?: string
    }
  | {
      type: "tool-output-available"
      toolCallId: string
      output: unknown
      providerExecuted?: boolean
      toolMetadata?: JsonRecord
      dynamic?: boolean
    }
  | {
      type: "tool-output-error"
      toolCallId: string
      errorText: string
      providerExecuted?: boolean
      toolMetadata?: JsonRecord
      dynamic?: boolean
    }
  | { type: "tool-output-denied"; toolCallId: string }
  | { type: "file"; part: FilePayload }
  | { type: "reasoning-file"; part: ReasoningFilePayload }
  | { type: "source-url"; part: SourceUrlPayload }
  | { type: "source-document"; part: SourceDocumentPayload }
  | { type: "custom"; part: CustomPayload }

/** One playback instruction produced by `lowerEvents`: emit a chunk, sleep, or close the stream. */
export type StreamStep<
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> =
  | { kind: "sleep"; delayMs: number }
  | { kind: "chunk"; chunk: NeutralChunk<METADATA, DATA, TOOLS> }
  | { kind: "close" }

/** A scripted turn: the materialized message plus the event log it streams from. */
export type ChatTurn<
  MESSAGE,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> = {
  role: MessageRole
  message: MESSAGE
  events: ChatEvent<DATA, TOOLS>[]
}

/** Deterministic sequential id generators (`msg-1`, `call-1`, `source-1`, …). */
export type ChatIds = {
  nextMessageId(): string
  nextToolCallId(): string
  nextSourceId(): string
  reserveMessageId(id: string): void
  reserveToolCallId(id: string): void
  reserveSourceId(id: string): void
}

/** Prefixes used by the deterministic chat id generators. */
export type ChatIdsOptions = {
  messageIdPrefix?: string
  toolCallIdPrefix?: string
  sourceIdPrefix?: string
}

/** Chat-wide options: id prefixes plus the fixed clock used for default metadata. */
export type ChatOptions = ChatIdsOptions & {
  now?: Date | string
}

/** Transport options. `delayMs` is the delay between text/reasoning deltas; defaults to 50ms. */
export type TurnStreamOptions = {
  delayMs?: number
}

/**
 * Maps a {@link NeutralChunk} to a framework chunk. Return `null` to skip
 * the chunk or an array to fan one neutral chunk out into several.
 */
export type ChunkEncoder<
  CHUNK,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> = (chunk: NeutralChunk<METADATA, DATA, TOOLS>) => CHUNK | CHUNK[] | null

/**
 * What the core hands an adapter's `createTransport`: `resolveTurn` matches a
 * transcript to the next scripted assistant turn, `streamTurn` plays that
 * turn as a chunk stream.
 */
export type TransportContext<
  MESSAGE,
  CHUNK,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> = {
  resolveTurn(
    messages: MESSAGE[],
    messageId?: string
  ): ChatTurn<MESSAGE, DATA, TOOLS> | undefined
  streamTurn(
    turn: ChatTurn<MESSAGE, DATA, TOOLS>,
    encodeChunk: ChunkEncoder<CHUNK, METADATA, DATA, TOOLS>,
    options?: TurnStreamOptions,
    abortSignal?: AbortSignal
  ): ReadableStream<CHUNK>
}

/**
 * The adapter plugin interface. Implement one of these per framework and pass
 * it to `createChatRuntime` — the core never imports a framework itself.
 */
export type ChatFormat<
  MESSAGE,
  PART,
  CHUNK,
  TRANSPORT,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
> = {
  materializeParts(events: ChatEvent<DATA, TOOLS>[]): PART[]
  eventsFromParts(parts: PART[]): ChatEvent<DATA, TOOLS>[]
  createMessage(input: {
    id: string
    role: MessageRole
    metadata: METADATA
    parts: PART[]
  }): MESSAGE
  getMessageId(message: MESSAGE): string
  getMessageRole(message: MESSAGE): MessageRole
  getMessageText(message: MESSAGE): string
  getMessageParts(message: MESSAGE): PART[]
  /** Optional: extract a message's metadata when hydrating chats from existing messages. */
  getMessageMetadata?(message: MESSAGE): METADATA | undefined
  createTransport(
    context: TransportContext<MESSAGE, CHUNK, METADATA, DATA, TOOLS>,
    options?: TurnStreamOptions
  ): TRANSPORT
}

/** Options for one user turn. */
export type ChatUserOptions<METADATA> = {
  id?: string
  metadata?: METADATA
  files?: Array<FilePayload & { type?: "file" }>
}

/** Options for one assistant turn. */
export type ChatAssistantOptions<METADATA> = {
  id?: string
  metadata?: METADATA
}
