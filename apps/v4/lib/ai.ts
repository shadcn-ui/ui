import type {
  ChatTransport,
  CustomContentUIPart,
  DataUIPart,
  DynamicToolUIPart,
  FileUIPart,
  InferUIMessageChunk,
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

type JsonRecord = Record<string, unknown>

type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied"

type ToolPartOptions = {
  toolCallId?: string
  title?: string
  toolMetadata?: JsonRecord
  providerExecuted?: boolean
  state?: ToolState
  input?: unknown
  output?: unknown
  errorText?: string
  approval?: {
    id: string
    approved?: boolean
    reason?: string
    isAutomatic?: boolean
  }
}

type FilePartInput = Omit<FileUIPart, "type"> & {
  type?: FileUIPart["type"]
}

type ChatUserOptions<METADATA> = {
  id?: string
  metadata?: METADATA
  files?: FilePartInput[]
}

type ChatAssistantOptions<METADATA> = {
  id?: string
  metadata?: METADATA
}

type ChatGetOptions = {
  count?: number
}

type ChatDataGetOptions = {
  count?: number
}

type ChatNextOptions<
  METADATA,
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
> = {
  after?: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>
}

type ChatTransportOptions = {
  chunkDelayMs?: number
}

type StreamTextOptions = {
  id?: string
  delayMs?: number
  mode?: "stream" | "instant"
}

type StreamDataPart<DATA_PARTS extends UIDataTypes> = DataUIPart<DATA_PARTS> & {
  transient?: boolean
}

type ChatDataPart<DATA_PARTS extends UIDataTypes> =
  StreamDataPart<DATA_PARTS> & {
    order: number
    delayMs: number
  }

type DataPartOptions = {
  id?: string
}

type ToolWriterOptions = ToolPartOptions & {
  dynamic?: boolean
}

type ChatWriterEvent<DATA_PARTS extends UIDataTypes, TOOLS extends UITools> =
  | {
      kind: "sleep"
      delayMs: number
      phase: "before-start" | "after-start"
    }
  | {
      kind: "text"
      id: string
      text: string
      options?: StreamTextOptions
    }
  | {
      kind: "reasoning"
      id: string
      text: string
      options?: StreamTextOptions
    }
  | {
      kind: "data"
      name: keyof DATA_PARTS & string
      id?: string
      data: DATA_PARTS[keyof DATA_PARTS & string]
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
  | {
      kind: "tool-denied"
      toolCallId: string
    }
  | {
      kind: "error"
      errorText: string
    }
  | {
      kind: "source-url"
      part: SourceUrlUIPart
    }
  | {
      kind: "source-document"
      part: SourceDocumentUIPart
    }
  | {
      kind: "file"
      part: FileUIPart
    }
  | {
      kind: "reasoning-file"
      part: ReasoningFileUIPart
    }
  | {
      kind: "custom"
      part: CustomContentUIPart
    }
  | {
      kind: "step-start"
    }

type ChatTurn<
  METADATA,
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
> = {
  role: UIMessage<METADATA, DATA_PARTS, TOOLS>["role"]
  message: UIMessage<METADATA, DATA_PARTS, TOOLS>
  events: ChatWriterEvent<DATA_PARTS, TOOLS>[]
}

type YieldMessagePartsOptions = {
  includeEmpty?: boolean
}

type StreamMessagePartsOptions = YieldMessagePartsOptions & {
  delayMs?: number
}

type AiMessageFakerOptions = {
  messageIdPrefix?: string
  toolCallIdPrefix?: string
  sourceIdPrefix?: string
  now?: Date | string
}

const TEXT_PARTS = [
  "Summarize the uploaded receipt.",
  "I found three relevant details.",
  "The file is ready to review.",
  "Here is a compact answer with the important tradeoffs.",
]

const REASONING_PARTS = [
  "I need to inspect the available context before answering.",
  "The user is asking for a structured result, so I should produce a concise plan.",
  "There are multiple possible renderers, but the message part type decides the composition.",
]

const DEFAULT_TEXT_PART = TEXT_PARTS[0] ?? ""
const DEFAULT_REASONING_PART = REASONING_PARTS[0] ?? ""
const DEFAULT_CHUNK_DELAY_MS = 50

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

function splitTextDeltas(text: string) {
  return text.match(/\S+\s*/g) ?? [text]
}

export function getMessageText(message: Pick<UIMessage, "parts">) {
  return message.parts
    .filter((part): part is TextUIPart => part.type === "text")
    .map((part) => part.text)
    .join("")
}

function normalizeFilePart(file: FilePartInput): FileUIPart {
  return {
    ...file,
    type: "file",
  }
}

function getDataPartName(type: `data-${string}`) {
  return type.slice("data-".length)
}

function cloneMessage<
  METADATA,
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(message: UIMessage<METADATA, DATA_PARTS, TOOLS>) {
  return {
    ...message,
    parts: message.parts.map((part) => ({ ...part })),
  } as UIMessage<METADATA, DATA_PARTS, TOOLS>
}

function createToolPart(
  name: string,
  toolCallId: string,
  options: ToolPartOptions = {}
) {
  const state =
    options.state ??
    (options.errorText
      ? "output-error"
      : options.output !== undefined
        ? "output-available"
        : "input-available")

  const part: JsonRecord = {
    type: `tool-${name}`,
    toolCallId: options.toolCallId ?? toolCallId,
    state,
  }

  if (options.title !== undefined) {
    part.title = options.title
  }

  if (options.toolMetadata !== undefined) {
    part.toolMetadata = options.toolMetadata
  }

  if (options.providerExecuted !== undefined) {
    part.providerExecuted = options.providerExecuted
  }

  if (options.input !== undefined || state !== "input-streaming") {
    part.input = options.input ?? {}
  }

  if (state === "output-available") {
    part.output = options.output ?? {}
  }

  if (state === "output-error") {
    part.errorText = options.errorText ?? "Tool call failed."
  }

  if (options.approval !== undefined) {
    part.approval = options.approval
  }

  return part
}

function replaceOrPushPart<
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

function materializeEvents<
  DATA_PARTS extends UIDataTypes,
  TOOLS extends UITools,
>(
  events: ChatWriterEvent<DATA_PARTS, TOOLS>[]
): Array<UIMessagePart<DATA_PARTS, TOOLS>> {
  const parts: Array<UIMessagePart<DATA_PARTS, TOOLS>> = []

  for (const event of events) {
    if (event.kind === "text") {
      parts.push({
        type: "text",
        text: event.text,
        state: "done",
      } as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "reasoning") {
      parts.push({
        type: "reasoning",
        text: event.text,
        state: "done",
      } as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "data") {
      if (event.transient) {
        continue
      }

      replaceOrPushPart(parts, {
        type: `data-${event.name}`,
        id: event.id,
        data: event.data,
      } as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "tool-input") {
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
    }

    if (event.kind === "tool-output") {
      const index = parts.findIndex(
        (part) =>
          (part.type === "dynamic-tool" || part.type.startsWith("tool-")) &&
          "toolCallId" in part &&
          part.toolCallId === event.toolCallId
      )

      if (index !== -1) {
        parts[index] = {
          ...parts[index],
          state: "output-available",
          output: event.output,
          providerExecuted: event.providerExecuted,
          toolMetadata: event.toolMetadata,
        } as UIMessagePart<DATA_PARTS, TOOLS>
      }
    }

    if (event.kind === "tool-error") {
      const index = parts.findIndex(
        (part) =>
          (part.type === "dynamic-tool" || part.type.startsWith("tool-")) &&
          "toolCallId" in part &&
          part.toolCallId === event.toolCallId
      )

      if (index !== -1) {
        parts[index] = {
          ...parts[index],
          state: "output-error",
          errorText: event.errorText,
          providerExecuted: event.providerExecuted,
          toolMetadata: event.toolMetadata,
        } as UIMessagePart<DATA_PARTS, TOOLS>
      }
    }

    if (event.kind === "tool-denied") {
      const index = parts.findIndex(
        (part) =>
          (part.type === "dynamic-tool" || part.type.startsWith("tool-")) &&
          "toolCallId" in part &&
          part.toolCallId === event.toolCallId
      )

      if (index !== -1) {
        parts[index] = {
          ...parts[index],
          state: "output-denied",
        } as UIMessagePart<DATA_PARTS, TOOLS>
      }
    }

    if (event.kind === "source-url") {
      parts.push(event.part as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "source-document") {
      parts.push(event.part as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "file") {
      parts.push(event.part as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "reasoning-file") {
      parts.push(event.part as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "custom") {
      parts.push(event.part as UIMessagePart<DATA_PARTS, TOOLS>)
    }

    if (event.kind === "step-start") {
      parts.push({
        type: "step-start",
      } as UIMessagePart<DATA_PARTS, TOOLS>)
    }
  }

  return parts
}

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

export async function* streamMessageParts<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(
  message: UIMessage<METADATA, DATA_PARTS, TOOLS>,
  options: StreamMessagePartsOptions = {}
) {
  for (const snapshot of yieldMessageParts(message, options)) {
    if (options.delayMs) {
      await wait(options.delayMs)
    }

    yield snapshot
  }
}

export function createAiMessageFaker<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(options: AiMessageFakerOptions = {}) {
  const messageIdPrefix = options.messageIdPrefix ?? "msg"
  const toolCallIdPrefix = options.toolCallIdPrefix ?? "call"
  const sourceIdPrefix = options.sourceIdPrefix ?? "source"
  const now =
    options.now instanceof Date
      ? options.now
      : new Date(options.now ?? "2026-01-01T00:00:00.000Z")

  let messageIndex = 0
  let toolCallIndex = 0
  let sourceIndex = 0

  function nextMessageId() {
    messageIndex += 1

    return `${messageIdPrefix}-${messageIndex}`
  }

  function nextToolCallId() {
    toolCallIndex += 1

    return `${toolCallIdPrefix}-${toolCallIndex}`
  }

  function nextSourceId() {
    sourceIndex += 1

    return `${sourceIdPrefix}-${sourceIndex}`
  }

  const parts = {
    text(
      text = DEFAULT_TEXT_PART,
      options: Pick<TextUIPart, "state" | "providerMetadata"> = {}
    ): TextUIPart {
      return {
        type: "text",
        text,
        ...options,
      }
    },

    reasoning(
      text = DEFAULT_REASONING_PART,
      options: Pick<ReasoningUIPart, "state" | "providerMetadata"> = {}
    ): ReasoningUIPart {
      return {
        type: "reasoning",
        text,
        ...options,
      }
    },

    custom(
      kind: CustomContentUIPart["kind"] = "test.output",
      options: Pick<CustomContentUIPart, "providerMetadata"> = {}
    ): CustomContentUIPart {
      return {
        type: "custom",
        kind,
        ...options,
      }
    },

    file(options: Partial<FileUIPart> = {}): FileUIPart {
      return {
        type: "file",
        mediaType: "image/png",
        filename: "receipt.png",
        url: "https://example.com/receipt.png",
        ...options,
      }
    },

    reasoningFile(
      options: Partial<ReasoningFileUIPart> = {}
    ): ReasoningFileUIPart {
      return {
        type: "reasoning-file",
        mediaType: "text/plain",
        url: "data:text/plain;base64,cmVhc29uaW5n",
        ...options,
      }
    },

    sourceUrl(options: Partial<SourceUrlUIPart> = {}): SourceUrlUIPart {
      const url = options.url ?? "https://ai-sdk.dev/docs"

      return {
        type: "source-url",
        sourceId: options.sourceId ?? nextSourceId(),
        url,
        title: options.title ?? "AI SDK Docs",
        providerMetadata: options.providerMetadata,
      }
    },

    sourceDocument(
      options: Partial<SourceDocumentUIPart> = {}
    ): SourceDocumentUIPart {
      return {
        type: "source-document",
        sourceId: options.sourceId ?? nextSourceId(),
        mediaType: options.mediaType ?? "text/markdown",
        title: options.title ?? "Retrieved document",
        filename: options.filename,
        providerMetadata: options.providerMetadata,
      }
    },

    stepStart(): StepStartUIPart {
      return {
        type: "step-start",
      }
    },

    data(part: DataUIPart<DATA_PARTS>): DataUIPart<DATA_PARTS> {
      return part
    },

    dataUpdates<NAME extends keyof DATA_PARTS & string>(
      name: NAME,
      updates: Array<DATA_PARTS[NAME]>,
      options: Required<DataPartOptions>
    ): Array<DataUIPart<DATA_PARTS>> {
      return updates.map((data) =>
        parts.data({
          type: `data-${name}`,
          id: options.id,
          data,
        } as DataUIPart<DATA_PARTS>)
      )
    },

    tool<NAME extends keyof TOOLS & string>(
      name: NAME,
      options: ToolPartOptions = {}
    ): ToolUIPart<TOOLS> {
      return createToolPart(
        name,
        options.toolCallId ?? nextToolCallId(),
        options
      ) as ToolUIPart<TOOLS>
    },

    dynamicTool(
      toolName: string,
      options: ToolPartOptions = {}
    ): DynamicToolUIPart {
      return {
        ...createToolPart(
          toolName,
          options.toolCallId ?? nextToolCallId(),
          options
        ),
        type: "dynamic-tool",
        toolName,
      } as DynamicToolUIPart
    },
  }

  function metadata(overrides: Partial<METADATA> = {}) {
    return {
      createdAt: now.toISOString(),
      ...overrides,
    } as METADATA
  }

  function message(
    role: UIMessage<METADATA, DATA_PARTS, TOOLS>["role"],
    messageParts: Array<UIMessagePart<DATA_PARTS, TOOLS>>,
    overrides: Partial<UIMessage<METADATA, DATA_PARTS, TOOLS>> = {}
  ): UIMessage<METADATA, DATA_PARTS, TOOLS> {
    return {
      id: overrides.id ?? nextMessageId(),
      role,
      metadata: overrides.metadata ?? metadata(),
      parts: messageParts,
    } as UIMessage<METADATA, DATA_PARTS, TOOLS>
  }

  function user(
    text = DEFAULT_TEXT_PART,
    overrides: Partial<UIMessage<METADATA, DATA_PARTS, TOOLS>> = {}
  ) {
    return message(
      "user",
      [parts.text(text)] as Array<UIMessagePart<DATA_PARTS, TOOLS>>,
      overrides
    )
  }

  function assistant(
    messageParts: Array<UIMessagePart<DATA_PARTS, TOOLS>> = [
      parts.text(),
    ] as Array<UIMessagePart<DATA_PARTS, TOOLS>>,
    overrides: Partial<UIMessage<METADATA, DATA_PARTS, TOOLS>> = {}
  ) {
    return message("assistant", messageParts, overrides)
  }

  function system(
    text = "Use concise, direct answers.",
    overrides: Partial<UIMessage<METADATA, DATA_PARTS, TOOLS>> = {}
  ) {
    return message(
      "system",
      [parts.text(text)] as Array<UIMessagePart<DATA_PARTS, TOOLS>>,
      overrides
    )
  }

  function builder(
    role: UIMessage<METADATA, DATA_PARTS, TOOLS>["role"] = "assistant",
    overrides: Partial<UIMessage<METADATA, DATA_PARTS, TOOLS>> = {}
  ) {
    const messageParts: Array<UIMessagePart<DATA_PARTS, TOOLS>> = []

    const api = {
      text(text?: string, options?: Pick<TextUIPart, "state">) {
        messageParts.push(parts.text(text, options))

        return api
      },

      reasoning(text?: string, options?: Pick<ReasoningUIPart, "state">) {
        messageParts.push(parts.reasoning(text, options))

        return api
      },

      custom(kind?: CustomContentUIPart["kind"]) {
        messageParts.push(parts.custom(kind))

        return api
      },

      file(options?: Partial<FileUIPart>) {
        messageParts.push(parts.file(options))

        return api
      },

      sourceUrl(options?: Partial<SourceUrlUIPart>) {
        messageParts.push(parts.sourceUrl(options))

        return api
      },

      sourceDocument(options?: Partial<SourceDocumentUIPart>) {
        messageParts.push(parts.sourceDocument(options))

        return api
      },

      stepStart() {
        messageParts.push(parts.stepStart())

        return api
      },

      data(part: DataUIPart<DATA_PARTS>) {
        messageParts.push(parts.data(part))

        return api
      },

      tool<NAME extends keyof TOOLS & string>(
        name: NAME,
        options?: ToolPartOptions
      ) {
        messageParts.push(parts.tool(name, options))

        return api
      },

      dynamicTool(toolName: string, options?: ToolPartOptions) {
        messageParts.push(parts.dynamicTool(toolName, options))

        return api
      },

      build(buildOverrides = {}) {
        return message(role, messageParts, {
          ...overrides,
          ...buildOverrides,
        })
      },

      snapshots(options?: YieldMessagePartsOptions) {
        return yieldMessageParts(api.build(), options)
      },

      stream(options?: StreamMessagePartsOptions) {
        return streamMessageParts(api.build(), options)
      },
    }

    return api
  }

  function createWriter(events: ChatWriterEvent<DATA_PARTS, TOOLS>[]) {
    function nextPartId(kind: string) {
      return `${kind}-${events.length + 1}`
    }

    const writer = {
      text(text = DEFAULT_TEXT_PART, options: StreamTextOptions = {}) {
        events.push({
          kind: "text",
          id: options.id ?? nextPartId("text"),
          text,
          options,
        })

        return writer
      },

      reasoning(
        text = DEFAULT_REASONING_PART,
        options: StreamTextOptions = {}
      ) {
        events.push({
          kind: "reasoning",
          id: options.id ?? nextPartId("reasoning"),
          text,
          options,
        })

        return writer
      },

      sleep(delayMs: number) {
        events.push({
          kind: "sleep",
          delayMs,
          phase: "after-start",
        })

        return writer
      },

      data(part: StreamDataPart<DATA_PARTS>) {
        const name = getDataPartName(part.type) as keyof DATA_PARTS & string

        events.push({
          kind: "data",
          name,
          id: part.id,
          data: part.data,
          transient: part.transient,
        })

        return writer
      },

      error(errorText = "An error occurred.") {
        events.push({
          kind: "error",
          errorText,
        })

        return writer
      },

      tool<NAME extends keyof TOOLS & string>(
        name: NAME,
        options: ToolWriterOptions = {}
      ) {
        const toolCallId = options.toolCallId ?? nextToolCallId()

        events.push({
          kind: "tool-input",
          name,
          toolCallId,
          title: options.title,
          toolMetadata: options.toolMetadata,
          providerExecuted: options.providerExecuted,
          dynamic: options.dynamic,
          input: options.input ?? {},
        })

        const handle = {
          sleep(delayMs: number) {
            events.push({
              kind: "sleep",
              delayMs,
              phase: "after-start",
            })

            return handle
          },

          output(output: TOOLS[NAME]["output"]) {
            events.push({
              kind: "tool-output",
              toolCallId,
              output,
              providerExecuted: options.providerExecuted,
              toolMetadata: options.toolMetadata,
              dynamic: options.dynamic,
            })

            return handle
          },

          error(errorText = "Tool call failed.") {
            events.push({
              kind: "tool-error",
              toolCallId,
              errorText,
              providerExecuted: options.providerExecuted,
              toolMetadata: options.toolMetadata,
              dynamic: options.dynamic,
            })

            return handle
          },

          denied() {
            events.push({
              kind: "tool-denied",
              toolCallId,
            })

            return handle
          },
        }

        if (options.output !== undefined) {
          handle.output(options.output as TOOLS[NAME]["output"])
        }

        if (options.errorText !== undefined) {
          handle.error(options.errorText)
        }

        return handle
      },

      sourceUrl(options: Partial<SourceUrlUIPart> = {}) {
        events.push({
          kind: "source-url",
          part: parts.sourceUrl(options),
        })

        return writer
      },

      sourceDocument(options: Partial<SourceDocumentUIPart> = {}) {
        events.push({
          kind: "source-document",
          part: parts.sourceDocument(options),
        })

        return writer
      },

      file(options: Partial<FileUIPart> = {}) {
        events.push({
          kind: "file",
          part: parts.file(options),
        })

        return writer
      },

      reasoningFile(options: Partial<ReasoningFileUIPart> = {}) {
        events.push({
          kind: "reasoning-file",
          part: parts.reasoningFile(options),
        })

        return writer
      },

      custom(kind?: CustomContentUIPart["kind"]) {
        events.push({
          kind: "custom",
          part: parts.custom(kind),
        })

        return writer
      },

      stepStart() {
        events.push({
          kind: "step-start",
        })

        return writer
      },
    }

    return writer
  }

  function eventsFromParts(
    messageParts: Array<UIMessagePart<DATA_PARTS, TOOLS>>
  ) {
    const events: ChatWriterEvent<DATA_PARTS, TOOLS>[] = []

    for (const part of messageParts) {
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
        } as ChatWriterEvent<DATA_PARTS, TOOLS>)
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
          })
        }

        if (toolPart.state === "output-error") {
          events.push({
            kind: "tool-error",
            toolCallId: toolPart.toolCallId,
            errorText: toolPart.errorText,
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
            dynamic: true,
          })
        }

        if (dynamicToolPart.state === "output-error") {
          events.push({
            kind: "tool-error",
            toolCallId: dynamicToolPart.toolCallId,
            errorText: dynamicToolPart.errorText,
            dynamic: true,
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

  async function enqueueTextEvent(
    controller: ReadableStreamDefaultController<
      InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>
    >,
    event: Extract<ChatWriterEvent<DATA_PARTS, TOOLS>, { kind: "text" }>,
    options: Required<ChatTransportOptions>
  ) {
    controller.enqueue({
      type: "text-start",
      id: event.id,
    } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)

    const deltas =
      event.options?.mode === "instant"
        ? [event.text]
        : splitTextDeltas(event.text)
    const delayMs = event.options?.delayMs ?? options.chunkDelayMs

    for (const delta of deltas) {
      if (delayMs) {
        await wait(delayMs)
      }

      controller.enqueue({
        type: "text-delta",
        id: event.id,
        delta,
      } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
    }

    controller.enqueue({
      type: "text-end",
      id: event.id,
    } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
  }

  async function enqueueReasoningEvent(
    controller: ReadableStreamDefaultController<
      InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>
    >,
    event: Extract<ChatWriterEvent<DATA_PARTS, TOOLS>, { kind: "reasoning" }>,
    options: Required<ChatTransportOptions>
  ) {
    controller.enqueue({
      type: "reasoning-start",
      id: event.id,
    } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)

    const deltas =
      event.options?.mode === "instant"
        ? [event.text]
        : splitTextDeltas(event.text)
    const delayMs = event.options?.delayMs ?? options.chunkDelayMs

    for (const delta of deltas) {
      if (delayMs) {
        await wait(delayMs)
      }

      controller.enqueue({
        type: "reasoning-delta",
        id: event.id,
        delta,
      } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
    }

    controller.enqueue({
      type: "reasoning-end",
      id: event.id,
    } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
  }

  function createResponseStream(
    turn: ChatTurn<METADATA, DATA_PARTS, TOOLS>,
    transportOptions: ChatTransportOptions = {},
    abortSignal?: AbortSignal
  ) {
    const options = {
      chunkDelayMs: DEFAULT_CHUNK_DELAY_MS,
      ...transportOptions,
    }

    return new ReadableStream<
      InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>
    >({
      async start(controller) {
        let aborted = false
        const abort = () => {
          aborted = true
        }

        abortSignal?.addEventListener("abort", abort)

        try {
          if (aborted) {
            controller.close()
            return
          }

          let eventIndex = 0

          while (true) {
            const event = turn.events[eventIndex]

            if (event?.kind !== "sleep" || event.phase !== "before-start") {
              break
            }

            await wait(event.delayMs)
            eventIndex += 1

            if (aborted) {
              controller.close()
              return
            }
          }

          controller.enqueue({
            type: "start",
          } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)

          for (const event of turn.events.slice(eventIndex)) {
            if (aborted) {
              controller.enqueue({
                type: "abort",
                reason: "aborted",
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
              controller.close()
              return
            }

            if (event.kind === "sleep") {
              await wait(event.delayMs)
            }

            if (event.kind === "text") {
              await enqueueTextEvent(controller, event, options)
            }

            if (event.kind === "reasoning") {
              await enqueueReasoningEvent(controller, event, options)
            }

            if (event.kind === "data") {
              controller.enqueue({
                type: `data-${event.name}`,
                id: event.id,
                data: event.data,
                transient: event.transient,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "tool-input") {
              controller.enqueue({
                type: "tool-input-available",
                toolCallId: event.toolCallId,
                toolName: event.name,
                input: event.input,
                providerExecuted: event.providerExecuted,
                toolMetadata: event.toolMetadata,
                dynamic: event.dynamic,
                title: event.title,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "tool-output") {
              controller.enqueue({
                type: "tool-output-available",
                toolCallId: event.toolCallId,
                output: event.output,
                providerExecuted: event.providerExecuted,
                toolMetadata: event.toolMetadata,
                dynamic: event.dynamic,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "tool-error") {
              controller.enqueue({
                type: "tool-output-error",
                toolCallId: event.toolCallId,
                errorText: event.errorText,
                providerExecuted: event.providerExecuted,
                toolMetadata: event.toolMetadata,
                dynamic: event.dynamic,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "tool-denied") {
              controller.enqueue({
                type: "tool-output-denied",
                toolCallId: event.toolCallId,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "error") {
              controller.enqueue({
                type: "error",
                errorText: event.errorText,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
              controller.close()
              return
            }

            if (event.kind === "source-url") {
              controller.enqueue(
                event.part as InferUIMessageChunk<
                  UIMessage<METADATA, DATA_PARTS, TOOLS>
                >
              )
            }

            if (event.kind === "source-document") {
              controller.enqueue(
                event.part as InferUIMessageChunk<
                  UIMessage<METADATA, DATA_PARTS, TOOLS>
                >
              )
            }

            if (event.kind === "file") {
              controller.enqueue({
                type: "file",
                filename: event.part.filename,
                mediaType: event.part.mediaType,
                url: event.part.url,
                providerMetadata: event.part.providerMetadata,
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }

            if (event.kind === "reasoning-file") {
              controller.enqueue(
                event.part as InferUIMessageChunk<
                  UIMessage<METADATA, DATA_PARTS, TOOLS>
                >
              )
            }

            if (event.kind === "custom") {
              controller.enqueue(
                event.part as InferUIMessageChunk<
                  UIMessage<METADATA, DATA_PARTS, TOOLS>
                >
              )
            }

            if (event.kind === "step-start") {
              controller.enqueue({
                type: "start-step",
              } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
            }
          }

          controller.enqueue({
            type: "finish",
            finishReason: "stop",
            messageMetadata: turn.message.metadata,
          } as InferUIMessageChunk<UIMessage<METADATA, DATA_PARTS, TOOLS>>)
          controller.close()
        } finally {
          abortSignal?.removeEventListener("abort", abort)
        }
      },
    })
  }

  function chat() {
    const turns: Array<ChatTurn<METADATA, DATA_PARTS, TOOLS>> = []
    const dataParts: Array<ChatDataPart<DATA_PARTS>> = []
    const pendingEvents: ChatWriterEvent<DATA_PARTS, TOOLS>[] = []
    let cursor = 0
    let dataDelayMs = 0

    function takePendingEvents() {
      return pendingEvents.splice(0, pendingEvents.length)
    }

    function pushTurn(turn: ChatTurn<METADATA, DATA_PARTS, TOOLS>) {
      turns.push(turn)
      dataDelayMs = 0
      return api
    }

    function findNextAssistantTurn(
      messages: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>,
      messageId?: string
    ) {
      if (messageId) {
        const index = turns.findIndex((turn) => turn.message.id === messageId)
        const turn = turns[index]

        if (turn?.role === "assistant") {
          return turn
        }

        return turns
          .slice(index + 1)
          .find((nextTurn) => nextTurn.role === "assistant")
      }

      const latestScriptedIndex = findLatestScriptedIndex(messages)

      return turns
        .slice(latestScriptedIndex + 1)
        .find((turn) => turn.role === "assistant")
    }

    function findLatestScriptedIndex(
      messages: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>
    ) {
      const messageIds = new Set(messages.map((message) => message.id))
      let latestScriptedIndex = -1

      for (let index = 0; index < turns.length; index++) {
        if (messageIds.has(turns[index].message.id)) {
          latestScriptedIndex = index
        }
      }

      if (latestScriptedIndex === -1) {
        const lastMessage = messages[messages.length - 1]
        latestScriptedIndex = turns.findIndex(
          (turn) =>
            turn.message.role === lastMessage?.role &&
            getMessageText(turn.message) === getMessageText(lastMessage)
        )
      }

      return latestScriptedIndex
    }

    function findNextUserTurn(
      messages: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>
    ) {
      const latestScriptedIndex = findLatestScriptedIndex(messages)

      return turns
        .slice(latestScriptedIndex + 1)
        .find((turn) => turn.role === "user")
    }

    const api = {
      user(text = DEFAULT_TEXT_PART, options: ChatUserOptions<METADATA> = {}) {
        const events = takePendingEvents()
        const messageParts = [
          parts.text(text),
          ...(options.files ?? []).map(normalizeFilePart),
        ] as Array<UIMessagePart<DATA_PARTS, TOOLS>>
        const userMessage = message("user", messageParts, {
          id: options.id,
          metadata: options.metadata,
        })
        events.push(...eventsFromParts(messageParts))

        return pushTurn({
          role: "user",
          message: userMessage,
          events,
        })
      },

      assistant(
        input:
          | string
          | Array<UIMessagePart<DATA_PARTS, TOOLS>>
          | ((context: {
              writer: ReturnType<typeof createWriter>
            }) => void) = DEFAULT_TEXT_PART,
        options: ChatAssistantOptions<METADATA> = {}
      ) {
        const events = takePendingEvents()
        let messageParts: Array<UIMessagePart<DATA_PARTS, TOOLS>>

        if (typeof input === "string") {
          const writer = createWriter(events)

          writer.text(input)
          messageParts = materializeEvents(events)
        } else if (typeof input === "function") {
          const writer = createWriter(events)

          input({ writer })
          messageParts = materializeEvents(events)
        } else {
          messageParts = input
          events.push(...eventsFromParts(input))
        }

        const assistantMessage = message("assistant", messageParts, {
          id: options.id,
          metadata: options.metadata,
        })

        return pushTurn({
          role: "assistant",
          message: assistantMessage,
          events,
        })
      },

      error(errorText = "An error occurred.") {
        const events = takePendingEvents()
        events.push({
          kind: "error",
          errorText,
        })

        return pushTurn({
          role: "assistant",
          message: message("assistant", []),
          events,
        })
      },

      sleep(delayMs: number) {
        dataDelayMs += delayMs
        pendingEvents.push({
          kind: "sleep",
          delayMs,
          phase: "before-start",
        })

        return api
      },

      data(part: StreamDataPart<DATA_PARTS>) {
        const name = getDataPartName(part.type) as keyof DATA_PARTS & string

        dataParts.push({
          ...part,
          order: turns.length - 0.5,
          delayMs: dataDelayMs,
        })
        pendingEvents.push({
          kind: "data",
          name,
          id: part.id,
          data: part.data,
          transient: part.transient,
        })

        return api
      },

      get(options: ChatGetOptions = {}) {
        const count = options.count ?? turns.length

        cursor = Math.max(cursor, count)

        return turns.slice(0, count).map((turn) => cloneMessage(turn.message))
      },

      getData(options: ChatDataGetOptions = {}) {
        const count = options.count ?? turns.length

        return dataParts
          .filter((part) => part.order < count)
          .map((part) => ({ ...part }))
      },

      next(options: ChatNextOptions<METADATA, DATA_PARTS, TOOLS> = {}) {
        if (options.after) {
          const turn = findNextUserTurn(options.after)

          return turn ? cloneMessage(turn.message) : null
        }

        const index = turns.findIndex(
          (turn, index) => index >= cursor && turn.role === "user"
        )

        if (index === -1) {
          return null
        }

        cursor = index + 1

        return cloneMessage(turns[index].message)
      },

      transport(options: ChatTransportOptions = {}) {
        return {
          async sendMessages({ messages, messageId, abortSignal }) {
            const turn = findNextAssistantTurn(messages, messageId)

            if (!turn) {
              throw new Error("No scripted assistant message found.")
            }

            return createResponseStream(turn, options, abortSignal)
          },

          async reconnectToStream() {
            return null
          },
        } satisfies ChatTransport<UIMessage<METADATA, DATA_PARTS, TOOLS>>
      },
    }

    return api
  }

  return {
    parts,
    metadata,
    message,
    user,
    assistant,
    system,
    builder,
    messageBuilder: builder,
    chat,
    thread(...messages: Array<UIMessage<METADATA, DATA_PARTS, TOOLS>>) {
      return messages
    },
  }
}

export function createChat<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(options: AiMessageFakerOptions = {}) {
  return createAiMessageFaker<METADATA, DATA_PARTS, TOOLS>(options).chat()
}
