import { createChatIds } from "./ids"
import { lowerEvents } from "./lower"
import { createChatPayloads, createMetadataFactory } from "./payloads"
import { createTurnStream } from "./stream"
import type {
  ChatAssistantOptions,
  ChatEvent,
  ChatFormat,
  ChatOptions,
  ChatTurn,
  ChatUserOptions,
  DataTypes,
  ToolSet,
  TurnStreamOptions,
} from "./types"
import { cloneValue, DEFAULT_STREAM_DELAY_MS, DEFAULT_TEXT } from "./utils"
import { createEventWriter } from "./writer"
import type { EventWriter } from "./writer"

/**
 * A transport response for when no configured assistant response remains —
 * most commonly an exhausted chat (the user keeps sending past the end).
 * A string (one streamed text part), a parts array, or a writer callback
 * that also receives the incoming transcript. Note: fully unrecognized
 * transcripts replay the chat from the top rather than falling back.
 */
export type ChatFallback<
  MESSAGE,
  PART,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
  WRITER = EventWriter<DATA, TOOLS>,
> =
  | string
  | PART[]
  | ((context: { writer: WRITER; messages: MESSAGE[] }) => void)

/**
 * Transport options: `delayMs` between text and reasoning deltas (default 50,
 * explicit `undefined` disables delays) and an optional `fallback` used when
 * no configured assistant response remains instead of throwing.
 */
export type ChatTransportOptions<
  MESSAGE,
  PART,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
  WRITER = EventWriter<DATA, TOOLS>,
> = TurnStreamOptions & {
  fallback?: ChatFallback<MESSAGE, PART, DATA, TOOLS, WRITER>
}

/** A deterministic conversation: chain turns, then read them back or stream them through a transport. */
export type Chat<
  MESSAGE,
  PART,
  TRANSPORT,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
  WRITER = EventWriter<DATA, TOOLS>,
> = {
  /** Scripts a user turn: one text part plus optional file attachments. */
  user(
    text?: string,
    options?: ChatUserOptions<METADATA>
  ): Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER>
  /**
   * Scripts an assistant turn from a string (one streamed text part), a
   * parts array (static parts, streamed instantly), or a writer callback
   * (full control over parts and timing).
   */
  assistant(
    input?: string | PART[] | ((context: { writer: WRITER }) => void),
    options?: ChatAssistantOptions<METADATA>
  ): Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER>
  /** Scripts an assistant turn that streams a bare error chunk and ends. */
  error(
    errorText?: string
  ): Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER>
  /** Delays the next turn's stream. */
  sleep(
    delayMs: number
  ): Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER>
  /** Returns clones of the first `count` configured messages, or all messages when omitted. */
  get(count?: number): MESSAGE[]
  /**
   * Returns the next configured user message after the given transcript, or
   * `null` when none remain. Matches by message id, falling back to role and
   * text, without mutating the chat.
   */
  next(messages: readonly MESSAGE[]): MESSAGE | null
  /** Creates the framework transport that streams configured assistant responses. */
  transport(
    options?: ChatTransportOptions<MESSAGE, PART, DATA, TOOLS, WRITER>
  ): TRANSPORT
}

/**
 * Creates a {@link Chat} bound to a {@link ChatFormat}. This is the
 * factory every adapter's `createChat` wraps — pass your own format to
 * target a framework this package doesn't ship an adapter for.
 */
export function createChatRuntime<
  MESSAGE,
  PART,
  CHUNK,
  TRANSPORT,
  METADATA = unknown,
  DATA extends DataTypes = DataTypes,
  TOOLS extends ToolSet = ToolSet,
  WRITER = EventWriter<DATA, TOOLS>,
>(
  format: ChatFormat<MESSAGE, PART, CHUNK, TRANSPORT, METADATA, DATA, TOOLS>,
  options: ChatOptions & {
    /** Hydrate the chat from existing messages, e.g. a recorded transcript. */
    messages?: MESSAGE[]
  } = {}
): Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER> {
  type InternalTurn = ChatTurn<MESSAGE, DATA, TOOLS> & {
    metadata?: METADATA
  }

  const ids = createChatIds(options)
  const payloads = createChatPayloads(ids)
  const metadata = createMetadataFactory<METADATA>(options.now)

  const turns: InternalTurn[] = []
  const pendingEvents: ChatEvent<DATA, TOOLS>[] = []

  function reserveEventIds(events: ChatEvent<DATA, TOOLS>[]) {
    for (const event of events) {
      if (
        event.kind === "tool-input" ||
        event.kind === "tool-output" ||
        event.kind === "tool-error" ||
        event.kind === "tool-denied"
      ) {
        ids.reserveToolCallId(event.toolCallId)
      }

      if (event.kind === "source-url" || event.kind === "source-document") {
        ids.reserveSourceId(event.part.sourceId)
      }
    }
  }

  function resolveMessageId(id?: string) {
    if (id !== undefined) {
      ids.reserveMessageId(id)

      return id
    }

    return ids.nextMessageId()
  }

  for (const seededMessage of options.messages ?? []) {
    const message = cloneValue(seededMessage)
    const events = format.eventsFromParts(format.getMessageParts(message))

    ids.reserveMessageId(format.getMessageId(message))
    reserveEventIds(events)

    turns.push({
      role: format.getMessageRole(message),
      message,
      events,
      metadata: format.getMessageMetadata?.(message),
    })
  }

  function takePendingEvents() {
    return pendingEvents.splice(0, pendingEvents.length)
  }

  function pushTurn(turn: InternalTurn) {
    turns.push(turn)

    return api
  }

  function findLatestChatIndex(messages: readonly MESSAGE[]) {
    const messageIds = new Set(
      messages.map((message) => format.getMessageId(message))
    )
    let latestChatIndex = -1

    for (let index = 0; index < turns.length; index++) {
      if (messageIds.has(format.getMessageId(turns[index].message))) {
        latestChatIndex = index
      }
    }

    if (latestChatIndex === -1) {
      const lastMessage = messages[messages.length - 1]

      latestChatIndex = turns.findIndex(
        (turn) =>
          lastMessage !== undefined &&
          format.getMessageRole(turn.message) ===
            format.getMessageRole(lastMessage) &&
          format.getMessageText(turn.message) ===
            format.getMessageText(lastMessage)
      )
    }

    return latestChatIndex
  }

  function findNextAssistantTurn(messages: MESSAGE[], messageId?: string) {
    if (messageId) {
      const index = turns.findIndex(
        (turn) => format.getMessageId(turn.message) === messageId
      )
      const turn = turns[index]

      if (turn?.role === "assistant") {
        return turn
      }

      // Unknown ids fall through to transcript matching so regenerating a
      // fallback-produced message falls back again instead of replaying the
      // first configured response.
      if (index !== -1) {
        return turns
          .slice(index + 1)
          .find((nextTurn) => nextTurn.role === "assistant")
      }
    }

    const latestChatIndex = findLatestChatIndex(messages)

    return turns
      .slice(latestChatIndex + 1)
      .find((turn) => turn.role === "assistant")
  }

  function findNextUserTurn(messages: readonly MESSAGE[]) {
    const latestChatIndex = findLatestChatIndex(messages)

    return turns.slice(latestChatIndex + 1).find((turn) => turn.role === "user")
  }

  function materializeAssistantInput(
    input: string | PART[] | ((context: { writer: WRITER }) => void),
    events: ChatEvent<DATA, TOOLS>[]
  ): PART[] {
    if (typeof input === "string") {
      const writer = createEventWriter(events, { ids, payloads })

      writer.text(input)

      return format.materializeParts(events)
    }

    if (typeof input === "function") {
      // `WRITER` is an adapter-narrowed subset of the full writer created
      // here. This is the single cast point that passes the full writer
      // through the adapter's narrower callback type.
      const writer = createEventWriter(events, {
        ids,
        payloads,
      }) as unknown as WRITER

      input({ writer })
      reserveEventIds(events)

      return format.materializeParts(events)
    }

    const parts = cloneValue(input)
    const partEvents = format.eventsFromParts(parts)

    reserveEventIds(partEvents)
    events.push(...partEvents)

    return parts
  }

  function createFallbackTurn(
    fallback: ChatFallback<MESSAGE, PART, DATA, TOOLS, WRITER>,
    messages: MESSAGE[]
  ): InternalTurn {
    const events: ChatEvent<DATA, TOOLS>[] = []
    const input =
      typeof fallback === "function"
        ? (context: { writer: WRITER }) => fallback({ ...context, messages })
        : fallback
    const parts = materializeAssistantInput(input, events)
    const turnMetadata = metadata()

    return {
      role: "assistant",
      message: format.createMessage({
        id: resolveMessageId(),
        role: "assistant",
        metadata: turnMetadata,
        parts,
      }),
      events,
      metadata: turnMetadata,
    }
  }

  const api: Chat<MESSAGE, PART, TRANSPORT, METADATA, DATA, TOOLS, WRITER> = {
    user(text = DEFAULT_TEXT, userOptions: ChatUserOptions<METADATA> = {}) {
      const events = takePendingEvents()
      const turnEvents: ChatEvent<DATA, TOOLS>[] = []

      turnEvents.push({
        kind: "text",
        id: `text-${turnEvents.length + 1}`,
        text,
        options: {
          mode: "instant",
        },
      })

      for (const file of userOptions.files ?? []) {
        const { type: _type, ...part } = file

        turnEvents.push({
          kind: "file",
          part: cloneValue(part),
        })
      }

      const parts = format.materializeParts(turnEvents)

      events.push(...turnEvents)

      const turnMetadata =
        userOptions.metadata === undefined
          ? metadata()
          : cloneValue(userOptions.metadata)
      const userMessage = format.createMessage({
        id: resolveMessageId(userOptions.id),
        role: "user",
        metadata: turnMetadata,
        parts,
      })

      return pushTurn({
        role: "user",
        message: userMessage,
        events,
        metadata: turnMetadata,
      })
    },

    assistant(
      input:
        | string
        | PART[]
        | ((context: { writer: WRITER }) => void) = DEFAULT_TEXT,
      assistantOptions: ChatAssistantOptions<METADATA> = {}
    ) {
      const events = takePendingEvents()
      const messageParts = materializeAssistantInput(input, events)
      const turnMetadata =
        assistantOptions.metadata === undefined
          ? metadata()
          : cloneValue(assistantOptions.metadata)
      const assistantMessage = format.createMessage({
        id: resolveMessageId(assistantOptions.id),
        role: "assistant",
        metadata: turnMetadata,
        parts: messageParts,
      })

      return pushTurn({
        role: "assistant",
        message: assistantMessage,
        events,
        metadata: turnMetadata,
      })
    },

    error(errorText = "An error occurred.") {
      const events = takePendingEvents()

      events.push({
        kind: "error",
        errorText,
      })

      const turnMetadata = metadata()

      return pushTurn({
        role: "assistant",
        message: format.createMessage({
          id: resolveMessageId(),
          role: "assistant",
          metadata: turnMetadata,
          parts: [],
        }),
        events,
        metadata: turnMetadata,
      })
    },

    sleep(delayMs: number) {
      pendingEvents.push({
        kind: "sleep",
        delayMs,
        phase: "before-start",
      })

      return api
    },

    get(count = turns.length) {
      if (!Number.isInteger(count) || count < 0) {
        throw new RangeError("count must be a non-negative integer.")
      }

      return turns.slice(0, count).map((turn) => cloneValue(turn.message))
    },

    next(messages) {
      const turn = findNextUserTurn(messages)

      return turn ? cloneValue(turn.message) : null
    },

    transport(
      transportOptions: ChatTransportOptions<
        MESSAGE,
        PART,
        DATA,
        TOOLS,
        WRITER
      > = {}
    ) {
      return format.createTransport(
        {
          resolveTurn(messages, messageId) {
            const turn = findNextAssistantTurn(messages, messageId)

            if (turn || transportOptions.fallback === undefined) {
              return turn
            }

            return createFallbackTurn(transportOptions.fallback, messages)
          },

          streamTurn(turn, encodeChunk, streamOptions = {}, abortSignal) {
            const steps = lowerEvents<METADATA, DATA, TOOLS>(turn.events, {
              delayMs: DEFAULT_STREAM_DELAY_MS,
              ...streamOptions,
              messageId: format.getMessageId(turn.message),
              messageMetadata: (turn as InternalTurn).metadata,
            })

            return createTurnStream(steps, encodeChunk, abortSignal)
          },
        },
        transportOptions
      )
    },
  }

  return api
}
