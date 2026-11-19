import * as React from "react"
import { userEvent } from "@vitest/browser/context"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"

import { PromptInput, type PromptInputValue } from "."

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = false

const suggestions = [
  { id: "review", type: "skill", trigger: "/", label: "review" },
  { id: "revert", type: "skill", trigger: "/", label: "revert" },
  { id: "readme", type: "file", trigger: "@", label: "README.md" },
]
let root: Root | undefined
let container: HTMLDivElement
let value: PromptInputValue

afterEach(() => {
  root?.unmount()
  container?.remove()
})

async function render(
  props: Partial<React.ComponentProps<typeof PromptInput.Editor>> = {}
) {
  value = { text: "", tokens: [] }
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  function Demo() {
    const [current, setCurrent] = React.useState(value)
    return (
      <>
        <PromptInput.Editor
          aria-label="Message"
          suggestions={suggestions}
          value={current}
          onValueChange={(next) => {
            value = next
            setCurrent(next)
          }}
          renderToken={(token) => (
            <strong data-testid="chip">
              {token.trigger}
              {token.label}
            </strong>
          )}
          {...props}
        />
        <PromptInput.Content
          value={current}
          renderToken={(token) => (
            <strong data-testid="sent-chip">
              {token.trigger}
              {token.label}
            </strong>
          )}
        />
        <button onClick={() => setCurrent({ text: "", tokens: [] })}>
          Reset
        </button>
      </>
    )
  }
  flushSync(() => root!.render(<Demo />))
  await settle()
  return container.querySelector<HTMLElement>("[contenteditable]")!
}

function settle() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
}

async function type(editor: HTMLElement, text: string) {
  await userEvent.type(editor, text)
  await settle()
}

async function keys(keys: string) {
  await userEvent.keyboard(keys)
  await settle()
}

function moveCaret(editor: HTMLElement, edge: "start" | "end") {
  const selection = window.getSelection()!
  selection.selectAllChildren(editor)
  if (edge === "start") selection.collapseToStart()
  else selection.collapseToEnd()
}

test("filters suggestions and selects by keyboard before submitting", async () => {
  const onSubmit = vi.fn()
  const editor = await render({ onSubmit })
  await type(editor, "/rev")
  expect(document.querySelectorAll('[role="option"]').length).toBe(2)
  await keys("{ArrowDown}{Enter}")
  expect(onSubmit).not.toHaveBeenCalled()
  expect(value).toEqual({
    text: "/revert ",
    tokens: [{ ...suggestions[1], start: 0, end: 7 }],
  })
  expect(container.querySelector('[data-testid="chip"]')?.textContent).toBe(
    "/revert"
  )
  expect(
    container.querySelector('[data-testid="sent-chip"]')?.textContent
  ).toBe("/revert")
  expect(document.querySelector('[role="option"]')).toBeNull()
  await keys("{Enter}")
  expect(onSubmit).toHaveBeenCalledTimes(1)
})

test("selects mentions with the mouse and deletes only the chosen token atomically", async () => {
  const editor = await render()
  await type(editor, "Hello @read")
  await userEvent.click(document.querySelector<HTMLElement>('[role="option"]')!)
  await settle()
  expect(document.activeElement).toBe(editor)
  expect(value).toEqual({
    text: "Hello @README.md ",
    tokens: [{ ...suggestions[2], start: 6, end: 16 }],
  })
  await keys("{Backspace}{Backspace}")
  expect(value).toEqual({ text: "Hello ", tokens: [] })
  await type(editor, "/review")
  await keys("{Escape}{Backspace}")
  expect(value).toEqual({ text: "Hello /revie", tokens: [] })
})

test("keeps offsets correct through Unicode, multiline edits, repeated tokens and undo", async () => {
  const editor = await render()
  await userEvent.click(editor)
  const clipboard = new DataTransfer()
  clipboard.setData("text/plain", "👋 ")
  editor.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: clipboard,
      bubbles: true,
      cancelable: true,
    })
  )
  await settle()
  await type(editor, "/rev")
  expect(value.text).toBe("👋 /rev")
  await keys("{Enter}")
  await type(editor, "and /rev")
  await keys("{Enter}")
  expect(value.tokens.map(({ start, end }) => [start, end])).toEqual([
    [3, 10],
    [15, 22],
  ])
  moveCaret(editor, "start")
  await settle()
  await type(editor, "Hi ")
  expect(value.tokens.map(({ start, end }) => [start, end])).toEqual([
    [6, 13],
    [18, 25],
  ])
  moveCaret(editor, "end")
  await settle()
  await keys("{Shift>}{Enter}{/Shift}")
  await type(editor, "next line")
  expect(value.text).toContain("\nnext line")
  await keys("{Backspace}")
  expect(value.text).toMatch(/next lin$/)
  await keys("{ControlOrMeta>}z{/ControlOrMeta}")
  expect(value.text.endsWith("next line")).toBe(true)
  expect(value.tokens.length).toBe(2)
})

test("plain text paste does not manufacture tokens and copy exposes readable text", async () => {
  const editor = await render()
  await type(editor, "/rev")
  await keys("{Enter}")
  await keys("{ControlOrMeta>}a{/ControlOrMeta}")
  const clipboard = new DataTransfer()
  editor.dispatchEvent(
    new ClipboardEvent("copy", {
      clipboardData: clipboard,
      bubbles: true,
      cancelable: true,
    })
  )
  expect(clipboard.getData("text/plain")).toBe("/review ")
  const paste = new DataTransfer()
  paste.setData("text/plain", "/review @README.md")
  paste.setData("text/html", '<b onclick="alert(1)">/review</b>')
  editor.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: paste,
      bubbles: true,
      cancelable: true,
    })
  )
  await settle()
  expect(value).toEqual({ text: "/review @README.md", tokens: [] })
  expect(editor.querySelector("b")).toBeNull()
})

test("does not swallow Enter with no matching suggestions and resets sent-message history", async () => {
  const onSubmit = vi.fn()
  const editor = await render({ onSubmit })
  await type(editor, "/unknown")
  expect(document.querySelector('[role="option"]')).toBeNull()
  await keys("{Enter}")
  expect(onSubmit).toHaveBeenCalledTimes(1)
  await type(editor, " /rev")
  await keys("{Enter}")
  await userEvent.click(container.querySelector("button")!)
  await settle()
  await userEvent.click(editor)
  await keys("{ControlOrMeta>}z{/ControlOrMeta}")
  expect(editor.textContent).toBe("")
})

test.each([{ disabled: true }, { readOnly: true }])(
  "prevents editing and suggestions: %j",
  async (props) => {
    const editor = await render(props)
    expect(editor.contentEditable).toBe("false")
    expect(document.querySelector('[role="option"]')).toBeNull()
  }
)

test("undo and redo preserve token identity and forward Delete removes the whole token", async () => {
  const editor = await render()
  await type(editor, "/rev")
  await keys("{Enter}{Backspace}{Backspace}")
  expect(value.tokens).toEqual([])
  await keys("{ControlOrMeta>}z{/ControlOrMeta}")
  expect(value.tokens[0]).toEqual({ ...suggestions[0], start: 0, end: 7 })
  await keys("{ControlOrMeta>}{Shift>}z{/Shift}{/ControlOrMeta}")
  expect(value.tokens).toEqual([])
  await type(editor, "/rev")
  await keys("{Enter}")
  moveCaret(editor, "start")
  await settle()
  await keys("{Delete}")
  expect(value.tokens).toEqual([])
  expect(value.text).toBe(" ")
})

test("selection replacement removes tokens and a controlled reset allows typing again", async () => {
  const editor = await render()
  await type(editor, "/rev")
  await keys("{Enter}")
  await keys("{ControlOrMeta>}a{/ControlOrMeta}")
  await type(editor, "replacement")
  expect(value).toEqual({ text: "replacement", tokens: [] })
  await userEvent.click(container.querySelector("button")!)
  await settle()
  await type(editor, "/rev")
  await keys("{Enter}")
  expect(value.tokens).toEqual([{ ...suggestions[0], start: 0, end: 7 }])
})

test("does not submit an IME confirmation and closes suggestions on blur", async () => {
  const onSubmit = vi.fn()
  const editor = await render({ onSubmit })
  await userEvent.click(editor)
  editor.dispatchEvent(
    new CompositionEvent("compositionstart", { bubbles: true })
  )
  await keys("{Enter}")
  expect(onSubmit).not.toHaveBeenCalled()
  editor.dispatchEvent(
    new CompositionEvent("compositionend", { bubbles: true, data: "" })
  )
  await type(editor, "/rev")
  expect(document.querySelector('[role="option"]')).not.toBeNull()
  await userEvent.tab()
  await settle()
  expect(document.querySelector('[role="option"]')).toBeNull()
})

test("inserts a token at the caret without replacing the rest of the message", async () => {
  const editor = await render()
  await type(editor, "before /rev after")
  const text = editor.querySelector("[data-lexical-text]")!.firstChild!
  const selection = window.getSelection()!
  selection.setBaseAndExtent(text, 11, text, 11)
  await settle()
  await keys("{Enter}")
  expect(value).toEqual({
    text: "before /review  after",
    tokens: [{ ...suggestions[0], start: 7, end: 14 }],
  })
  await type(editor, "inserted")
  expect(value.text).toBe("before /review inserted after")
})
