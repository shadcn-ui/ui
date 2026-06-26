import * as React from "react"

type MessagePartKind =
  | "text"
  | "reasoning"
  | "tool"
  | "file"
  | "source"
  | "data"
  | "custom"
  | "step-start"
  | "reasoning-file"
  | (string & {})

type MessagePartOf<TMessage> = TMessage extends {
  parts: ReadonlyArray<infer TPart>
}
  ? TPart
  : unknown

type MessagePartItem<TPart = unknown, TMessage = unknown> = {
  key: string
  part: TPart
  message: TMessage
  index: number
  kind: MessagePartKind
  name?: string
  toolCallId?: string
}

type MessageToolPartGroup<TPart = unknown, TMessage = unknown> = {
  key: string
  name?: string
  toolCallId?: string
  items: Array<MessagePartItem<TPart, TMessage>>
  call?: MessagePartItem<TPart, TMessage>
  result?: MessagePartItem<TPart, TMessage>
}

type MessagePartsResult<TPart = unknown, TMessage = unknown> = {
  role?: string
  all: Array<MessagePartItem<TPart, TMessage>>
  protocol: Array<MessagePartItem<TPart, TMessage>>
  byKind: Record<string, Array<MessagePartItem<TPart, TMessage>>>
  tools: Array<MessageToolPartGroup<TPart, TMessage>>
  toolParts: Array<MessagePartItem<TPart, TMessage>>
  text: Array<MessagePartItem<TPart, TMessage>>
  texts: Array<MessagePartItem<TPart, TMessage>>
  reasoning: Array<MessagePartItem<TPart, TMessage>>
  files: Array<MessagePartItem<TPart, TMessage>>
  sources: Array<MessagePartItem<TPart, TMessage>>
  data: Array<MessagePartItem<TPart, TMessage>>
  custom: Array<MessagePartItem<TPart, TMessage>>
  steps: Array<MessagePartItem<TPart, TMessage>>
  reasoningFiles: Array<MessagePartItem<TPart, TMessage>>
  get: (kind: MessagePartKind) => Array<MessagePartItem<TPart, TMessage>>
}

type MessagePartsAdapter<TMessage, TPart> = {
  getParts?: (message: TMessage) => ReadonlyArray<TPart>
  getRole?: (message: TMessage) => string | undefined
  getPartKey?: (part: TPart, index: number, message: TMessage) => string
  getPartKind?: (
    part: TPart,
    index: number,
    message: TMessage
  ) => MessagePartKind
  getPartName?: (
    part: TPart,
    index: number,
    message: TMessage
  ) => string | undefined
  getToolCallId?: (
    part: TPart,
    index: number,
    message: TMessage
  ) => string | undefined
  isToolCall?: (part: TPart, index: number, message: TMessage) => boolean
  isToolResult?: (part: TPart, index: number, message: TMessage) => boolean
}

type CreateMessagePartsOptions<TMessage, TPart> = {
  adapter?: MessagePartsAdapter<TMessage, TPart>
  order?:
    | "role"
    | "protocol"
    | MessagePartKind[]
    | ((
        items: Array<MessagePartItem<TPart, TMessage>>,
        message: TMessage
      ) => Array<MessagePartItem<TPart, TMessage>>)
  classifyPart?: (
    part: TPart,
    context: {
      message: TMessage
      index: number
      kind: MessagePartKind
      name?: string
      toolCallId?: string
    }
  ) =>
    | {
        kind?: MessagePartKind
        name?: string
        toolCallId?: string
      }
    | undefined
  getKey?: (part: TPart, index: number, message: TMessage) => string
}

type MessagePartRenderProps<TPart = unknown, TMessage = unknown> = {
  item: MessagePartItem<TPart, TMessage>
  part: TPart
  message: TMessage
  index: number
  kind: MessagePartKind
  name?: string
  toolCallId?: string
}

type MessagePartComponent<
  TPart = unknown,
  TMessage = unknown,
> = React.ComponentType<MessagePartRenderProps<TPart, TMessage>>

type MessagePartComponents<TPart = unknown, TMessage = unknown> = {
  text?: MessagePartComponent<TPart, TMessage>
  reasoning?: MessagePartComponent<TPart, TMessage>
  tool?: MessagePartComponent<TPart, TMessage>
  file?: MessagePartComponent<TPart, TMessage>
  source?: MessagePartComponent<TPart, TMessage>
  data?: MessagePartComponent<TPart, TMessage>
  custom?: MessagePartComponent<TPart, TMessage>
  stepStart?: MessagePartComponent<TPart, TMessage>
  reasoningFile?: MessagePartComponent<TPart, TMessage>
  fallback?: MessagePartComponent<TPart, TMessage>
  types?: Record<string, MessagePartComponent<TPart, TMessage>>
  tools?: Record<string, MessagePartComponent<TPart, TMessage>>
  dataTypes?: Record<string, MessagePartComponent<TPart, TMessage>>
}

type MessagePartProps<TPart = unknown, TMessage = unknown> = {
  item: MessagePartItem<TPart, TMessage>
  components: MessagePartComponents<TPart, TMessage>
}

type MessagePartsProps<TPart = unknown, TMessage = unknown> = {
  parts:
    | MessagePartsResult<TPart, TMessage>
    | Array<MessagePartItem<TPart, TMessage>>
  components: MessagePartComponents<TPart, TMessage>
  renderPart?: (props: {
    item: MessagePartItem<TPart, TMessage>
    children: React.ReactNode
  }) => React.ReactNode
}

const ASSISTANT_PART_ORDER: MessagePartKind[] = [
  "reasoning",
  "tool",
  "reasoning-file",
  "file",
  "text",
  "source",
  "data",
  "custom",
  "step-start",
]

const USER_PART_ORDER: MessagePartKind[] = [
  "file",
  "text",
  "data",
  "source",
  "custom",
]

const DEFAULT_PART_ORDER: MessagePartKind[] = ["text", "data", "custom"]

function createMessageParts<TMessage>(
  message: TMessage,
  options: CreateMessagePartsOptions<TMessage, MessagePartOf<TMessage>> = {}
): MessagePartsResult<MessagePartOf<TMessage>, TMessage> {
  type TPart = MessagePartOf<TMessage>

  const adapter = options.adapter ?? {}
  const role = adapter.getRole?.(message) ?? getStructuralRole(message)
  const messageParts =
    adapter.getParts?.(message) ??
    (getStructuralParts(message) as ReadonlyArray<TPart>)

  const protocol = messageParts.map((part, index) => {
    const kind =
      adapter.getPartKind?.(part, index, message) ?? getStructuralPartKind(part)
    const name =
      adapter.getPartName?.(part, index, message) ?? getStructuralPartName(part)
    const toolCallId =
      adapter.getToolCallId?.(part, index, message) ??
      getStructuralToolCallId(part)
    const classification = options.classifyPart?.(part, {
      message,
      index,
      kind,
      name,
      toolCallId,
    })

    return {
      key:
        options.getKey?.(part, index, message) ??
        adapter.getPartKey?.(part, index, message) ??
        getStructuralPartKey(part, index),
      part,
      message,
      index,
      kind: classification?.kind ?? kind,
      name: classification?.name ?? name,
      toolCallId: classification?.toolCallId ?? toolCallId,
    } satisfies MessagePartItem<TPart, TMessage>
  })

  const all = orderMessagePartItems(
    protocol,
    options.order ?? "role",
    role,
    message
  )
  const byKind = groupMessagePartItems(all)

  function get(kind: MessagePartKind) {
    return byKind[kind] ?? []
  }

  return {
    role,
    all,
    protocol,
    byKind,
    tools: groupToolPartItems(all, adapter, message),
    toolParts: get("tool"),
    text: get("text"),
    texts: get("text"),
    reasoning: get("reasoning"),
    files: get("file"),
    sources: get("source"),
    data: get("data"),
    custom: get("custom"),
    steps: get("step-start"),
    reasoningFiles: get("reasoning-file"),
    get,
  }
}

function MessageParts<TPart, TMessage>({
  parts,
  components,
  renderPart,
}: MessagePartsProps<TPart, TMessage>) {
  const items = Array.isArray(parts) ? parts : parts.all

  return (
    <>
      {items.map((item) => {
        const children = (
          <MessagePart key={item.key} item={item} components={components} />
        )

        return renderPart ? (
          <React.Fragment key={item.key}>
            {renderPart({ item, children })}
          </React.Fragment>
        ) : (
          children
        )
      })}
    </>
  )
}

function MessagePart<TPart, TMessage>({
  item,
  components,
}: MessagePartProps<TPart, TMessage>) {
  const Component = getMessagePartComponent(item, components)

  if (!Component) {
    return null
  }

  return React.createElement(Component, {
    item,
    part: item.part,
    message: item.message,
    index: item.index,
    kind: item.kind,
    name: item.name,
    toolCallId: item.toolCallId,
  })
}

function getMessagePartComponent<TPart, TMessage>(
  item: MessagePartItem<TPart, TMessage>,
  components: MessagePartComponents<TPart, TMessage>
) {
  const partType = getStructuralPartType(item.part)

  if (partType && components.types?.[partType]) {
    return components.types[partType]
  }

  if (item.kind === "tool" && item.name && components.tools?.[item.name]) {
    return components.tools[item.name]
  }

  if (item.kind === "data" && item.name && components.dataTypes?.[item.name]) {
    return components.dataTypes[item.name]
  }

  if (item.kind === "text") {
    return components.text ?? components.fallback
  }

  if (item.kind === "reasoning") {
    return components.reasoning ?? components.fallback
  }

  if (item.kind === "tool") {
    return components.tool ?? components.fallback
  }

  if (item.kind === "file") {
    return components.file ?? components.fallback
  }

  if (item.kind === "source") {
    return components.source ?? components.fallback
  }

  if (item.kind === "data") {
    return components.data ?? components.fallback
  }

  if (item.kind === "custom") {
    return components.custom ?? components.fallback
  }

  if (item.kind === "step-start") {
    return components.stepStart ?? components.fallback
  }

  if (item.kind === "reasoning-file") {
    return components.reasoningFile ?? components.file ?? components.fallback
  }

  return components.fallback
}

function orderMessagePartItems<TPart, TMessage>(
  items: Array<MessagePartItem<TPart, TMessage>>,
  order: NonNullable<CreateMessagePartsOptions<TMessage, TPart>["order"]>,
  role: string | undefined,
  message: TMessage
) {
  if (order === "protocol") {
    return items
  }

  if (typeof order === "function") {
    return order(items, message)
  }

  const orderedKinds = Array.isArray(order)
    ? order
    : role === "user"
      ? USER_PART_ORDER
      : role === "assistant"
        ? ASSISTANT_PART_ORDER
        : DEFAULT_PART_ORDER
  const orderWeight = new Map(orderedKinds.map((kind, index) => [kind, index]))

  return [...items].sort((a, b) => {
    const aWeight = orderWeight.get(a.kind) ?? Number.MAX_SAFE_INTEGER
    const bWeight = orderWeight.get(b.kind) ?? Number.MAX_SAFE_INTEGER

    return aWeight === bWeight ? a.index - b.index : aWeight - bWeight
  })
}

function groupMessagePartItems<TPart, TMessage>(
  items: Array<MessagePartItem<TPart, TMessage>>
) {
  return items.reduce<Record<string, Array<MessagePartItem<TPart, TMessage>>>>(
    (groups, item) => {
      groups[item.kind] ??= []
      groups[item.kind].push(item)

      return groups
    },
    {}
  )
}

function groupToolPartItems<TPart, TMessage>(
  items: Array<MessagePartItem<TPart, TMessage>>,
  adapter: MessagePartsAdapter<TMessage, TPart>,
  message: TMessage
) {
  const groups: MessageToolPartGroup<TPart, TMessage>[] = []
  const groupsByKey = new Map<string, MessageToolPartGroup<TPart, TMessage>>()

  for (const item of items) {
    if (item.kind !== "tool") {
      continue
    }

    const groupKey = item.toolCallId ?? item.name ?? item.key
    let group = groupsByKey.get(groupKey)

    if (!group) {
      group = {
        key: groupKey,
        name: item.name,
        toolCallId: item.toolCallId,
        items: [],
      }
      groupsByKey.set(groupKey, group)
      groups.push(group)
    }

    group.items.push(item)

    if (adapter.isToolResult?.(item.part, item.index, message)) {
      group.result = item
    } else if (adapter.isToolCall?.(item.part, item.index, message)) {
      group.call = item
    } else if (isStructuralToolResult(item.part)) {
      group.result = item
    } else if (!group.call) {
      group.call = item
    }
  }

  return groups
}

function getStructuralParts(message: unknown) {
  if (isRecord(message) && Array.isArray(message.parts)) {
    return message.parts
  }

  return []
}

function getStructuralRole(message: unknown) {
  if (isRecord(message) && typeof message.role === "string") {
    return message.role
  }

  return undefined
}

function getStructuralPartKey(part: unknown, index: number) {
  const type = getStructuralPartType(part) ?? "part"
  const toolCallId = getStructuralToolCallId(part)

  if (toolCallId) {
    return `${type}:${toolCallId}`
  }

  if (isRecord(part)) {
    if (typeof part.sourceId === "string") {
      return `${type}:${part.sourceId}`
    }

    if (typeof part.id === "string") {
      return `${type}:${part.id}`
    }

    if (typeof part.url === "string") {
      return `${type}:${part.url}:${index}`
    }
  }

  return `${type}:${index}`
}

function getStructuralPartKind(part: unknown): MessagePartKind {
  const type = getStructuralPartType(part)

  if (!type) {
    return "custom"
  }

  if (type === "text") {
    return "text"
  }

  if (type === "reasoning" || type === "thinking") {
    return "reasoning"
  }

  if (
    type === "file" ||
    type === "image" ||
    type === "audio" ||
    type === "video"
  ) {
    return "file"
  }

  if (type === "reasoning-file") {
    return "reasoning-file"
  }

  if (
    type === "source" ||
    type === "source-url" ||
    type === "source-document" ||
    type === "citation" ||
    type === "search-result"
  ) {
    return "source"
  }

  if (
    type === "dynamic-tool" ||
    type === "tool-call" ||
    type === "tool-result" ||
    type === "tool_call" ||
    type === "tool_result" ||
    type.startsWith("tool-")
  ) {
    return "tool"
  }

  if (type.startsWith("data-")) {
    return "data"
  }

  if (type === "step-start" || type === "step_start") {
    return "step-start"
  }

  if (type === "custom") {
    return "custom"
  }

  return "custom"
}

function getStructuralPartName(part: unknown) {
  const type = getStructuralPartType(part)

  if (!type) {
    return undefined
  }

  if (isRecord(part)) {
    if (typeof part.toolName === "string") {
      return part.toolName
    }

    if (typeof part.name === "string") {
      return part.name
    }

    if (typeof part.kind === "string") {
      return part.kind
    }
  }

  if (type.startsWith("tool-")) {
    return type.slice("tool-".length)
  }

  if (type.startsWith("data-")) {
    return type.slice("data-".length)
  }

  if (type === "source-url") {
    return "url"
  }

  if (type === "source-document") {
    return "document"
  }

  return undefined
}

function getStructuralToolCallId(part: unknown) {
  if (!isRecord(part)) {
    return undefined
  }

  if (typeof part.toolCallId === "string") {
    return part.toolCallId
  }

  if (typeof part.callId === "string") {
    return part.callId
  }

  return undefined
}

function isStructuralToolResult(part: unknown) {
  const type = getStructuralPartType(part)

  return (
    type === "tool-result" ||
    type === "tool_result" ||
    (isRecord(part) && "output" in part)
  )
}

function getStructuralPartType(part: unknown) {
  if (isRecord(part) && typeof part.type === "string") {
    return part.type
  }

  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export {
  MessagePart,
  MessageParts,
  createMessageParts,
  getMessagePartComponent,
  type CreateMessagePartsOptions,
  type MessagePartComponent,
  type MessagePartComponents,
  type MessagePartItem,
  type MessagePartKind,
  type MessagePartProps,
  type MessagePartRenderProps,
  type MessagePartsAdapter,
  type MessagePartsProps,
  type MessagePartsResult,
  type MessageToolPartGroup,
}
