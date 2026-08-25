import { describe, expect, it } from "vitest"

import { createChatIds } from "./ids"

describe("createChatIds", () => {
  it("generates sequential ids with default prefixes", () => {
    const ids = createChatIds()

    expect(ids.nextMessageId()).toBe("msg-1")
    expect(ids.nextMessageId()).toBe("msg-2")
    expect(ids.nextToolCallId()).toBe("call-1")
    expect(ids.nextSourceId()).toBe("source-1")
  })

  it("supports custom prefixes", () => {
    const ids = createChatIds({
      messageIdPrefix: "m",
      toolCallIdPrefix: "t",
      sourceIdPrefix: "s",
    })

    expect(ids.nextMessageId()).toBe("m-1")
    expect(ids.nextToolCallId()).toBe("t-1")
    expect(ids.nextSourceId()).toBe("s-1")
  })

  it("continues after explicitly reserved ids", () => {
    const ids = createChatIds()

    ids.reserveMessageId("msg-2")
    ids.reserveToolCallId("call-4")
    ids.reserveSourceId("source-3")

    expect(ids.nextMessageId()).toBe("msg-3")
    expect(ids.nextToolCallId()).toBe("call-5")
    expect(ids.nextSourceId()).toBe("source-4")
  })
})
