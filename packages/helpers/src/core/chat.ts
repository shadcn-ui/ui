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
  MessageRole,
  PendingToolCall,
  ToolSet,
  TurnStreamOptions,
} from "./types"
import {
  cloneValue,
  DEFAULT_STREAM_DELAY_MS,
  DEFAULT_TEXT,
  devWarn,
} from "./utils"
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

/**
 * The context handed to assistant writer callbacks. A continuation turn — a
 * callback turn scripted after a turn that pauses for user input — also
 * receives the live transcript and the resolved human-in-the-loop tool
 * calls; eager turns receive only the writer.
 */
export type AssistantTurnContext<
  WRITER,
  MESSAGE,
  TOOLS extends ToolSet = ToolSet,
> = {
  writer: WRITER
  messages?: MESSAGE[]
  toolCall?: PendingToolCall<TOOLS>
  toolCalls?: Array<PendingToolCall<TOOLS>>
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
   * (full control over parts and timing). A callback turn scripted after a
   * paused turn — an unresolved tool call or `needsApproval` — becomes a
   * continuation: it materializes when the follow-up request arrives, with
   * the live transcript and resolved tool calls in its context.
   */
  assistant(
    input?:
      | string
      | PART[]
      | ((context: AssistantTurnContext<WRITER, MESSAGE, TOOLS>) => void),
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
  /**
   * Returns clones of the first `count` configured messages, or all
   * materializable messages when omitted. Continuation turns have no message
   * without a live transcript, so `get` stops before the first one and
   * throws when `count` reaches past it.
   */
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
  type InternalTurn = {
    role: MessageRole
    events: ChatEvent<DATA, TOOLS>[]
    messageId: string
    metadata?: METADATA
    // Continuation turns carry `resolve` instead of a materialized message.
    message?: MESSAGE
    resolve?: (context: AssistantTurnContext<WRITER, MESSAGE, TOOLS>) => void
    // Continuations stream without a message id so the client keeps merging
    // into the assistant message it is already continuing.
    continuation?: boolean
    // The events last streamed for a continuation turn. Later continuations
    // read pending calls from here so re-runs cannot drift generated ids
    // away from the transcript.
    lastEvents?: ChatEvent<DATA, TOOLS>[]
  }

  type ResolvedTurn = ChatTurn<MESSAGE, DATA, TOOLS> & {
    metadata?: METADATA
    continuation?: boolean
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
        event.kind === "tool-denied" ||
        event.kind === "tool-approval-request"
      ) {
        ids.reserveToolCallId(event.toolCallId)
      }

      if (event.kind === "tool-approval-request") {
        ids.reserveApprovalId(event.approvalId)
      }

      if (event.kind === "source-url" || event.kind === "source-document") {
        ids.reserveSourceId(event.part.sourceId)
      }
    }
  }

  function getPendingToolInputs(events: ChatEvent<DATA, TOOLS>[]) {
    const resolvedToolCallIds = new Set<string>()

    for (const event of events) {
      if (
        event.kind === "tool-output" ||
        event.kind === "tool-error" ||
        event.kind === "tool-denied"
      ) {
        resolvedToolCallIds.add(event.toolCallId)
      }
    }

    return events.flatMap((event) =>
      event.kind === "tool-input" && !resolvedToolCallIds.has(event.toolCallId)
        ? [
            {
              input: event,
              approval: events.find(
                (
                  candidate
                ): candidate is Extract<
                  ChatEvent<DATA, TOOLS>,
                  { kind: "tool-approval-request" }
                > =>
                  candidate.kind === "tool-approval-request" &&
                  candidate.toolCallId === event.toolCallId
              ),
            },
          ]
        : []
    )
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
      messageId: format.getMessageId(message),
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
      if (messageIds.has(turns[index].messageId)) {
        latestChatIndex = index
      }
    }

    if (latestChatIndex === -1) {
      const lastMessage = messages[messages.length - 1]

      latestChatIndex = turns.findIndex(
        (turn) =>
          lastMessage !== undefined &&
          turn.message !== undefined &&
          turn.role === format.getMessageRole(lastMessage) &&
          format.getMessageText(turn.message) ===
            format.getMessageText(lastMessage)
      )
    }

    return latestChatIndex
  }

  function findAssistantTurnIndexAfter(startIndex: number) {
    for (let index = startIndex; index < turns.length; index++) {
      if (turns[index].role === "assistant") {
        return index
      }
    }

    return -1
  }

  function findNextAssistantTurnIndex(messages: MESSAGE[], messageId?: string) {
    if (messageId) {
      const index = turns.findIndex((turn) => turn.messageId === messageId)

      if (turns[index]?.role === "assistant") {
        return index
      }

      // Unknown ids fall through to transcript matching so regenerating a
      // fallback-produced message falls back again instead of replaying the
      // first configured response.
      if (index !== -1) {
        return findAssistantTurnIndexAfter(index + 1)
      }
    }

    return findAssistantTurnIndexAfter(findLatestChatIndex(messages) + 1)
  }

  function findNextUserTurn(messages: readonly MESSAGE[]) {
    const latestChatIndex = findLatestChatIndex(messages)

    return turns.slice(latestChatIndex + 1).find((turn) => turn.role === "user")
  }

  function materializeAssistantInput(
    input:
      | string
      | PART[]
      | ((context: AssistantTurnContext<WRITER, MESSAGE, TOOLS>) => void),
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
  ): ResolvedTurn {
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

  function findPreviousAssistantIndex(turnIndex: number) {
    for (let index = turnIndex - 1; index >= 0; index--) {
      if (turns[index].role === "assistant") {
        return index
      }
    }

    return -1
  }

  function isPreviousTurnPausedAssistant() {
    const previousTurn = turns[turns.length - 1]

    if (previousTurn?.role !== "assistant") {
      return false
    }

    // A continuation may itself pause, so turns after one stay continuations.
    return (
      previousTurn.resolve !== undefined ||
      getPendingToolInputs(previousTurn.events).length > 0
    )
  }

  function resolvePendingToolCalls(turnIndex: number, messages: MESSAGE[]) {
    const previousIndex = findPreviousAssistantIndex(turnIndex)
    const previousTurn = turns[previousIndex]

    if (!previousTurn) {
      return []
    }

    const previousEvents = previousTurn.resolve
      ? (previousTurn.lastEvents ??
        materializeDeferredTurn(previousIndex, messages).events)
      : previousTurn.events
    const pendingInputs = getPendingToolInputs(previousEvents)

    if (!pendingInputs.length) {
      return []
    }

    const previousMessage = messages.find(
      (message) => format.getMessageId(message) === previousTurn.messageId
    )
    const summaries =
      previousMessage && format.getToolCalls
        ? format.getToolCalls(previousMessage)
        : []

    return pendingInputs.map((pendingInput) => ({
      ...pendingInput,
      summary: summaries.find(
        (summary) => summary.toolCallId === pendingInput.input.toolCallId
      ),
    }))
  }

  function toPendingToolCall(
    call: ReturnType<typeof resolvePendingToolCalls>[number]
  ) {
    const approved = call.approval
      ? call.summary?.approval?.approved
      : undefined

    return {
      name: call.input.name,
      toolCallId: call.input.toolCallId,
      input: call.summary?.input ?? call.input.input,
      output: call.approval
        ? approved === true
          ? call.approval.output
          : undefined
        : call.summary?.state === "output-available"
          ? call.summary.output
          : undefined,
      ...(call.approval
        ? {
            approved: approved === true,
            denied: approved === false,
          }
        : {}),
    } as PendingToolCall<TOOLS>
  }

  function materializeDeferredTurn(
    turnIndex: number,
    messages: MESSAGE[]
  ): ResolvedTurn {
    const turn = turns[turnIndex]
    const resolve = turn.resolve

    if (!resolve) {
      throw new Error("Only continuation turns materialize from a transcript.")
    }

    const events = [...turn.events]

    // The client merges a continuation into the prior assistant message as a
    // new step. The step boundary keeps the resolved tool call out of the
    // latest step so automatic sending does not retrigger on it.
    events.push({ kind: "step-start" })

    const pending = resolvePendingToolCalls(turnIndex, messages)

    if (!pending.length) {
      devWarn(
        "A continuation turn resolved without a pending tool call. Its toolCall context is empty."
      )
    }

    for (const call of pending) {
      if (!call.approval || call.summary?.state !== "approval-responded") {
        continue
      }

      if (call.summary.approval?.approved) {
        if (call.approval.errorText !== undefined) {
          events.push({
            kind: "tool-error",
            toolCallId: call.input.toolCallId,
            errorText: call.approval.errorText,
            providerExecuted: call.input.providerExecuted,
            toolMetadata: call.input.toolMetadata,
            dynamic: call.input.dynamic,
          })
        } else {
          events.push({
            kind: "tool-output",
            toolCallId: call.input.toolCallId,
            output: call.approval.output,
            providerExecuted: call.input.providerExecuted,
            toolMetadata: call.input.toolMetadata,
            dynamic: call.input.dynamic,
          })
        }
      } else {
        events.push({
          kind: "tool-denied",
          toolCallId: call.input.toolCallId,
        })
      }
    }

    const toolCalls = pending.map(toPendingToolCall)
    // Same cast point as materializeAssistantInput: the full writer passes
    // through the adapter's narrower callback type.
    const writer = createEventWriter(events, {
      ids,
      payloads,
    }) as unknown as WRITER

    resolve({
      writer,
      messages,
      toolCall: toolCalls[toolCalls.length - 1],
      toolCalls,
    })
    reserveEventIds(events)
    turn.lastEvents = events

    const parts = format.materializeParts(events)
    const turnMetadata =
      turn.metadata === undefined ? metadata() : cloneValue(turn.metadata)

    return {
      role: "assistant",
      message: format.createMessage({
        id: turn.messageId,
        role: "assistant",
        metadata: turnMetadata,
        parts,
      }),
      events,
      metadata: turnMetadata,
      continuation: true,
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
      const messageId = resolveMessageId(userOptions.id)
      const userMessage = format.createMessage({
        id: messageId,
        role: "user",
        metadata: turnMetadata,
        parts,
      })

      return pushTurn({
        role: "user",
        message: userMessage,
        messageId,
        events,
        metadata: turnMetadata,
      })
    },

    assistant(
      input:
        | string
        | PART[]
        | ((
            context: AssistantTurnContext<WRITER, MESSAGE, TOOLS>
          ) => void) = DEFAULT_TEXT,
      assistantOptions: ChatAssistantOptions<METADATA> = {}
    ) {
      const events = takePendingEvents()
      const continuation = isPreviousTurnPausedAssistant()

      if (typeof input === "function" && continuation) {
        return pushTurn({
          role: "assistant",
          messageId: resolveMessageId(assistantOptions.id),
          events,
          metadata:
            assistantOptions.metadata === undefined
              ? undefined
              : cloneValue(assistantOptions.metadata),
          resolve: input,
          continuation,
        })
      }

      if (continuation) {
        events.push({ kind: "step-start" })
      }

      const messageParts = materializeAssistantInput(input, events)
      const turnMetadata =
        assistantOptions.metadata === undefined
          ? metadata()
          : cloneValue(assistantOptions.metadata)
      const messageId = resolveMessageId(assistantOptions.id)
      const assistantMessage = format.createMessage({
        id: messageId,
        role: "assistant",
        metadata: turnMetadata,
        parts: messageParts,
      })

      return pushTurn({
        role: "assistant",
        message: assistantMessage,
        messageId,
        events,
        metadata: turnMetadata,
        continuation: continuation || undefined,
      })
    },

    error(errorText = "An error occurred.") {
      const events = takePendingEvents()

      events.push({
        kind: "error",
        errorText,
      })

      const turnMetadata = metadata()
      const messageId = resolveMessageId()

      return pushTurn({
        role: "assistant",
        message: format.createMessage({
          id: messageId,
          role: "assistant",
          metadata: turnMetadata,
          parts: [],
        }),
        messageId,
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

    get(count) {
      const deferredIndex = turns.findIndex(
        (turn) => turn.resolve !== undefined
      )
      const limit = deferredIndex === -1 ? turns.length : deferredIndex

      if (count === undefined) {
        count = limit
      }

      if (!Number.isInteger(count) || count < 0) {
        throw new RangeError("count must be a non-negative integer.")
      }

      if (deferredIndex !== -1 && count > deferredIndex) {
        throw new Error(
          "get() cannot materialize a continuation turn without a live transcript."
        )
      }

      return turns
        .slice(0, count)
        .map((turn) => cloneValue(turn.message as MESSAGE))
    },

    next(messages) {
      const turn = findNextUserTurn(messages)

      return turn?.message ? cloneValue(turn.message) : null
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
      const lastAssistantIndex = findPreviousAssistantIndex(turns.length)
      const lastAssistant = turns[lastAssistantIndex]

      if (
        lastAssistant &&
        !lastAssistant.resolve &&
        getPendingToolInputs(lastAssistant.events).some(
          (pendingInput) => pendingInput.approval
        )
      ) {
        devWarn(
          "The last scripted assistant turn requests approval but no continuation turn follows. The decision will have no response."
        )
      }

      return format.createTransport(
        {
          resolveTurn(messages, messageId) {
            const turnIndex = findNextAssistantTurnIndex(messages, messageId)
            const turn = turnIndex === -1 ? undefined : turns[turnIndex]

            if (turn) {
              return turn.resolve
                ? materializeDeferredTurn(turnIndex, messages)
                : (turn as ChatTurn<MESSAGE, DATA, TOOLS>)
            }

            if (transportOptions.fallback === undefined) {
              return undefined
            }

            return createFallbackTurn(transportOptions.fallback, messages)
          },

          streamTurn(turn, encodeChunk, streamOptions = {}, abortSignal) {
            const steps = lowerEvents<METADATA, DATA, TOOLS>(turn.events, {
              delayMs: DEFAULT_STREAM_DELAY_MS,
              ...streamOptions,
              // A continuation stream carries no message id: the client is
              // already continuing the paused assistant message, and a new
              // id would fork it into a duplicate instead of updating it.
              messageId: (turn as ResolvedTurn).continuation
                ? undefined
                : format.getMessageId(turn.message),
              messageMetadata: (turn as ResolvedTurn).metadata,
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
