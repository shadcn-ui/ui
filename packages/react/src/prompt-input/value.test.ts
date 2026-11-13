import { createEditor } from "lexical"
import { describe, expect, test } from "vitest"

import { TokenNode } from "./token-node"
import { getTokens } from "./utils"
import { $readValue, $writeValue } from "./value"

const skill = { id: "review", type: "skill", trigger: "/", label: "review" }
const token = { ...skill, start: 3, end: 10 }

describe("prompt input value", () => {
  test("round trips repeated tokens, Unicode and multiline text", () => {
    const value = {
      text: "👋 /review\n/review /review",
      tokens: [token, { ...skill, start: 11, end: 18 }],
    }
    const editor = createEditor({
      namespace: "test",
      nodes: [TokenNode],
      onError: (error) => {
        throw error
      },
    })
    editor.update(() => $writeValue(value), { discrete: true })
    expect(editor.getEditorState().read($readValue)).toEqual(value)
    const serialized = editor.getEditorState().toJSON()
    editor.setEditorState(editor.parseEditorState(serialized))
    expect(editor.getEditorState().read($readValue)).toEqual(value)
  })

  test("ignores stale, out-of-bounds and overlapping token metadata", () => {
    const value = {
      text: "👋 /review",
      tokens: [
        { ...token, end: 100 },
        { ...token, start: -1 },
        { ...token, id: "stale", label: "revert" },
        token,
        token,
      ],
    }
    expect(getTokens(value)).toEqual([token])
  })
})
