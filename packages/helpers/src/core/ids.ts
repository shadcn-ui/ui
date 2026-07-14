import type { ChatIds, ChatIdsOptions } from "./types"

/**
 * Creates deterministic sequential id generators (`msg-1`, `call-1`,
 * `source-1`, …). A chat and its transport share one instance so ids never
 * collide across scripted turns.
 */
export function createChatIds(options: ChatIdsOptions = {}): ChatIds {
  const messageIdPrefix = options.messageIdPrefix ?? "msg"
  const toolCallIdPrefix = options.toolCallIdPrefix ?? "call"
  const sourceIdPrefix = options.sourceIdPrefix ?? "source"

  function createSequence(prefix: string) {
    const reserved = new Set<string>()
    let index = 0

    function reserve(id: string) {
      reserved.add(id)

      const prefixWithSeparator = `${prefix}-`

      if (!id.startsWith(prefixWithSeparator)) {
        return
      }

      const suffix = id.slice(prefixWithSeparator.length)

      if (!/^\d+$/.test(suffix)) {
        return
      }

      const observedIndex = Number(suffix)

      if (Number.isSafeInteger(observedIndex)) {
        index = Math.max(index, observedIndex)
      }
    }

    function next() {
      let id: string

      do {
        index += 1
        id = `${prefix}-${index}`
      } while (reserved.has(id))

      reserve(id)

      return id
    }

    return { next, reserve }
  }

  const messageIds = createSequence(messageIdPrefix)
  const toolCallIds = createSequence(toolCallIdPrefix)
  const sourceIds = createSequence(sourceIdPrefix)

  return {
    nextMessageId() {
      return messageIds.next()
    },

    nextToolCallId() {
      return toolCallIds.next()
    },

    nextSourceId() {
      return sourceIds.next()
    },

    reserveMessageId(id) {
      messageIds.reserve(id)
    },

    reserveToolCallId(id) {
      toolCallIds.reserve(id)
    },

    reserveSourceId(id) {
      sourceIds.reserve(id)
    },
  }
}
