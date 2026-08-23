// @vitest-environment jsdom

import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Questionnaire } from "."

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean
    }
  ).IS_REACT_ACT_ENVIRONMENT = true

  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => {
    root.unmount()
  })
  container.remove()
  vi.restoreAllMocks()
})

describe("Questionnaire", () => {
  it("owns its ordered items, progress, and navigation", async () => {
    await renderQuestionnaire()

    expect(progress().textContent).toBe("Question 1 of 2")
    expect(form().dataset.current).toBe("1")
    expect(form().hasAttribute("data-first")).toBe(true)
    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(item("detail").hidden).toBe(true)
    expect(freeform("scope-input").id).not.toBe("")
    expect(freeform("scope-input").hasAttribute("name")).toBe(false)
    expect(previous().hasAttribute("data-hidden")).toBe(true)
    expect(next().hasAttribute("data-visible")).toBe(true)
    expect(next().disabled).toBe(false)
    expect(next().dataset.status).toBe("unanswered")
    expect(submit().hasAttribute("data-hidden")).toBe(true)

    await click(next())

    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(item("scope").getAttribute("aria-invalid")).toBe("true")
    expect(error("scope-error").hidden).toBe(false)
    expect(document.activeElement).toBe(choiceInput("scope-delegation"))

    await choose("scope-delegation")

    expect(item("scope").hasAttribute("aria-invalid")).toBe(false)
    expect(next().disabled).toBe(false)
    expect(next().dataset.status).toBe("answered")
    await click(next())

    expect(progress().textContent).toBe("Question 2 of 2")
    expect(form().hasAttribute("data-last")).toBe(true)
    expect(item("scope").hidden).toBe(true)
    expect(item("detail").hasAttribute("data-active")).toBe(true)
    expect(previous().hasAttribute("data-visible")).toBe(true)
    expect(next().hasAttribute("data-hidden")).toBe(true)
    expect(submit().hasAttribute("data-visible")).toBe(true)
    expect(submit().disabled).toBe(false)
    expect(submit().dataset.status).toBe("unanswered")

    await click(submit())

    expect(item("detail").getAttribute("aria-invalid")).toBe("true")
    expect(error("detail-error").hidden).toBe(false)
    expect(document.activeElement).toBe(choiceInput("detail-focused"))

    await choose("detail-focused")

    expect(item("detail").hasAttribute("aria-invalid")).toBe(false)
    expect(submit().disabled).toBe(false)
    expect(submit().dataset.status).toBe("answered")
    await click(previous())

    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(choiceInput("scope-delegation").checked).toBe(true)
  })

  it("moves between items with horizontal arrows outside radios and text entry", async () => {
    await renderQuestionnaire()

    expect(item("scope").getAttribute("aria-keyshortcuts")).toBe(
      "Meta+Enter Control+Enter ArrowUp ArrowDown"
    )

    await keydown(item("scope"), "ArrowRight")

    expect(item("scope").hasAttribute("data-active")).toBe(true)

    await choose("scope-delegation")

    expect(item("scope").getAttribute("aria-keyshortcuts")).toBe(
      "Meta+Enter Control+Enter ArrowUp ArrowDown ArrowRight"
    )

    await keydown(choiceInput("scope-delegation"), "ArrowRight")
    await keydown(item("scope"), "ArrowRight", { ctrlKey: true })
    await keydown(item("scope"), "ArrowRight", { repeat: true })

    expect(item("scope").hasAttribute("data-active")).toBe(true)

    await keydown(item("scope"), "ArrowRight")

    expect(item("detail").hasAttribute("data-active")).toBe(true)
    expect(item("detail").getAttribute("aria-keyshortcuts")).toBe(
      "Meta+Enter Control+Enter ArrowUp ArrowDown ArrowLeft"
    )
    expect(document.activeElement).toBe(item("detail"))

    await keydown(item("detail"), "ArrowLeft")

    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(document.activeElement).toBe(item("scope"))

    await type(freeform("scope-input"), "A custom answer")
    await keydown(freeform("scope-input"), "ArrowRight")

    expect(item("scope").hasAttribute("data-active")).toBe(true)

    await keydown(next(), "ArrowRight")

    expect(item("detail").hasAttribute("data-active")).toBe(true)
  })

  it("moves vertical focus across fixed and freeform answers", async () => {
    await renderQuestionnaire()
    await choose("scope-questions")
    await keydown(choiceInput("scope-questions"), "ArrowDown")

    expect(document.activeElement).toBe(freeform("scope-input"))
    expect(choiceInput("scope-questions").checked).toBe(true)

    await keydown(freeform("scope-input"), "ArrowUp")

    expect(document.activeElement).toBe(choiceInput("scope-questions"))
    expect(choiceInput("scope-questions").checked).toBe(true)

    await keydown(choiceInput("scope-questions"), "ArrowDown")
    await keydown(freeform("scope-input"), "ArrowDown")

    expect(document.activeElement).toBe(choiceInput("scope-delegation"))
    expect(choiceInput("scope-delegation").checked).toBe(true)

    await type(freeform("scope-input"), "A custom answer")
    await keydown(freeform("scope-input"), "ArrowUp")

    expect(document.activeElement).toBe(freeform("scope-input"))

    await keydown(freeform("scope-input"), "ArrowDown")

    expect(document.activeElement).toBe(freeform("scope-input"))

    item("scope").focus()
    await keydown(item("scope"), "ArrowRight")
    await keydown(item("detail"), "ArrowDown")

    expect(document.activeElement).toBe(choiceInput("detail-focused"))
    expect(choiceInput("detail-focused").checked).toBe(true)

    item("detail").focus()
    await keydown(item("detail"), "ArrowLeft")
    await keydown(item("scope"), "ArrowDown")

    expect(document.activeElement).toBe(freeform("scope-input"))
    expect(freeform("scope-input").value).toBe("A custom answer")
  })

  it("moves vertical focus through multiple choices without toggling", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="multiple">
          <Questionnaire.Item
            data-testid="multiple"
            multiple
            name="multiple"
            required
          >
            <Questionnaire.Title>Choose several</Questionnaire.Title>
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    item("multiple").focus()
    await keydown(item("multiple"), "ArrowDown")

    expect(document.activeElement).toBe(choiceInput("first"))
    expect(choiceInput("first").checked).toBe(false)

    await keydown(choiceInput("first"), "ArrowDown")

    expect(document.activeElement).toBe(choiceInput("second"))
    expect(choiceInput("second").checked).toBe(false)

    item("multiple").focus()
    await keydown(item("multiple"), "ArrowUp")

    expect(document.activeElement).toBe(choiceInput("second"))
    expect(choiceInput("second").checked).toBe(false)
  })

  it.each(["email", "password", "search", "tel", "text", "url"] as const)(
    "moves vertically out of an empty %s input",
    async (inputType) => {
      await act(async () => {
        root.render(
          <Questionnaire.Root
            key={inputType}
            data-testid="root"
            defaultItem="answer"
          >
            <Questionnaire.Item data-testid="answer" name="answer">
              <Questionnaire.Title>Enter an answer</Questionnaire.Title>
              <TestChoice data-testid="fixed" value="fixed">
                Fixed
              </TestChoice>
              <Questionnaire.Input
                data-testid="answer-input"
                aria-label="Custom answer"
                type={inputType}
              />
            </Questionnaire.Item>
          </Questionnaire.Root>
        )
      })

      await keydown(freeform("answer-input"), "ArrowUp")

      expect(document.activeElement).toBe(choiceInput("fixed"))
      expect(choiceInput("fixed").checked).toBe(true)
    }
  )

  it.each([
    "date",
    "datetime-local",
    "month",
    "number",
    "time",
    "week",
  ] as const)(
    "keeps vertical arrows native for an empty %s input",
    async (inputType) => {
      await act(async () => {
        root.render(
          <Questionnaire.Root
            key={inputType}
            data-testid="root"
            defaultItem="answer"
          >
            <Questionnaire.Item data-testid="answer" name="answer">
              <Questionnaire.Title>Enter an answer</Questionnaire.Title>
              <TestChoice data-testid="fixed" value="fixed">
                Fixed
              </TestChoice>
              <Questionnaire.Input
                data-testid="answer-input"
                aria-label="Custom answer"
                type={inputType}
              />
            </Questionnaire.Item>
          </Questionnaire.Root>
        )
      })

      const input = freeform("answer-input")

      await keydown(input, "ArrowUp")

      expect(document.activeElement).toBe(input)

      await keydown(input, "ArrowDown")

      expect(document.activeElement).toBe(input)
    }
  )

  it("omits disabled answers from shortcuts, navigation, and validation focus", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="approval"
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="approval" name="approval" required>
            <Questionnaire.Title>Choose approval</Questionnaire.Title>
            <TestChoice data-testid="automatic" disabled value="automatic">
              Automatic
            </TestChoice>
            <TestChoice data-testid="review" value="review">
              Review
            </TestChoice>
            <Questionnaire.Input
              data-testid="approval-input"
              aria-label="Another approval"
            />
            <Questionnaire.Error data-testid="approval-error" />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    expect(choice("automatic").hasAttribute("data-shortcut")).toBe(false)
    expect(choice("review").dataset.shortcut).toBe("A")
    expect(freeform("approval-input").hasAttribute("data-shortcut")).toBe(false)

    item("approval").focus()
    await keydown(item("approval"), "ArrowDown")

    expect(document.activeElement).toBe(choiceInput("review"))
    expect(choiceInput("review").checked).toBe(true)

    await act(async () => {
      form().reset()
    })

    await act(async () => {
      form().dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      )
    })

    expect(error("approval-error").hidden).toBe(false)
    expect(document.activeElement).toBe(choiceInput("review"))
  })

  it("counts only enabled answers in item status and validation", async () => {
    const onStatusChange = vi.fn()

    async function renderAnswers(disabled: boolean) {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              multiple
              required
              name="answers"
              onStatusChange={onStatusChange}
            >
              <Questionnaire.Title>Choose answers</Questionnaire.Title>
              <TestChoice
                data-testid="fixed-answer"
                defaultChecked
                disabled={disabled}
                value="fixed"
              >
                Fixed
              </TestChoice>
              <Questionnaire.Input
                data-testid="custom-answer"
                aria-label="Custom answer"
                defaultValue="Custom"
                disabled={disabled}
              />
              <Questionnaire.Error data-testid="answers-error" />
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })
    }

    await renderAnswers(false)

    expect(item("answers").dataset.status).toBe("answered")
    expect(new FormData(form()).getAll("answers")).toEqual(["fixed", "Custom"])
    expect(submit().disabled).toBe(false)

    await renderAnswers(true)

    expect(choiceInput("fixed-answer").checked).toBe(true)
    expect(freeform("custom-answer").value).toBe("Custom")
    expect(item("answers").dataset.status).toBe("unanswered")
    expect(new FormData(form()).getAll("answers")).toEqual([])
    expect(submit().disabled).toBe(false)
    expect(onStatusChange).toHaveBeenLastCalledWith("unanswered")

    await act(async () => {
      form().dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      )
    })

    expect(error("answers-error").hidden).toBe(false)
    expect(document.activeElement).toBe(item("answers"))

    await renderAnswers(false)

    expect(item("answers").dataset.status).toBe("answered")
    expect(new FormData(form()).getAll("answers")).toEqual(["fixed", "Custom"])
    expect(submit().disabled).toBe(false)
    expect(error("answers-error").hidden).toBe(true)
    expect(onStatusChange).toHaveBeenLastCalledWith("answered")
  })

  it("returns to and blocks an externally invalid item", async () => {
    function ExternallyValidatedQuestionnaire() {
      const [activeItem, setActiveItem] = React.useState("first")
      const [firstInvalid, setFirstInvalid] = React.useState(false)

      return (
        <Questionnaire.Root
          data-testid="root"
          item={activeItem}
          onItemChange={setActiveItem}
          onSubmit={(event) => {
            event.preventDefault()
            setFirstInvalid(true)
            setActiveItem("first")
          }}
        >
          <Questionnaire.Item
            data-testid="first"
            invalid={firstInvalid}
            name="first"
            required
          >
            <Questionnaire.Title>First</Questionnaire.Title>
            <TestChoice data-testid="first-choice" value="first">
              First answer
            </TestChoice>
            <TestChoice
              data-testid="first-alternative"
              value="alternative"
              onChange={() => setFirstInvalid(false)}
            >
              Alternative answer
            </TestChoice>
            <Questionnaire.Error data-testid="first-error" id="first-error">
              Choose the alternative answer.
            </Questionnaire.Error>
          </Questionnaire.Item>

          <Questionnaire.Item data-testid="second" name="second" required>
            <Questionnaire.Title>Second</Questionnaire.Title>
            <TestChoice data-testid="second-choice" value="second">
              Second answer
            </TestChoice>
          </Questionnaire.Item>

          <Questionnaire.Next data-testid="next" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ExternallyValidatedQuestionnaire />)
    })

    await choose("first-choice")
    await click(next())
    await choose("second-choice")
    await click(submit())

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(item("first").dataset.status).toBe("answered")
    expect(item("first").getAttribute("aria-invalid")).toBe("true")
    expect(item("first").getAttribute("aria-describedby")).toContain(
      "first-error"
    )
    expect(choiceInput("first-choice").getAttribute("aria-invalid")).toBe(
      "true"
    )
    expect(error("first-error").hidden).toBe(false)
    expect(error("first-error").getAttribute("role")).toBe("alert")
    expect(document.activeElement).toBe(item("first"))

    await keydown(item("first"), "Enter", { metaKey: true })

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(document.activeElement).toBe(choiceInput("first-choice"))

    item("first").focus()
    await click(next())

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(document.activeElement).toBe(choiceInput("first-choice"))

    await choose("first-alternative")

    expect(item("first").hasAttribute("aria-invalid")).toBe(false)
    expect(error("first-error").hidden).toBe(true)

    await click(next())

    expect(item("second").hasAttribute("data-active")).toBe(true)
  })

  it("does not treat ArrowRight as an implicit skip", async () => {
    const onStatusChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="optional">
          <TestItem onStatusChange={onStatusChange} name="optional" />
          <TestItem required name="next" />
          <Questionnaire.Previous data-testid="previous" />
          <Questionnaire.Skip data-testid="skip" />
        </Questionnaire.Root>
      )
    })

    await keydown(item("optional"), "ArrowRight")

    expect(item("optional").hasAttribute("data-active")).toBe(true)
    expect(item("optional").dataset.status).toBe("unanswered")
    expect(onStatusChange).not.toHaveBeenCalled()

    await click(skip())
    await click(previous())

    expect(item("optional").dataset.status).toBe("skipped")
    expect(item("optional").getAttribute("aria-keyshortcuts")).toBe(
      "Meta+Enter Control+Enter ArrowUp ArrowDown ArrowRight"
    )

    await keydown(item("optional"), "ArrowRight")

    expect(item("next").hasAttribute("data-active")).toBe(true)
  })

  it("activates the first enabled item without reporting initialization as navigation", async () => {
    const onItemChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" onItemChange={onItemChange}>
          <Questionnaire.Progress data-testid="progress" />
          <TestItem disabled name="disabled" />
          <TestItem required name="first" />
          <TestItem required name="second" />
        </Questionnaire.Root>
      )
    })

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(item("disabled").hidden).toBe(true)
    expect(progress().textContent).toBe("Question 1 of 2")
    expect(progress().getAttribute("aria-label")).toBe("Questionnaire progress")
    expect(onItemChange).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(document.body)
  })

  it("reports item names without navigation details", async () => {
    const onItemChange = vi.fn()

    await renderQuestionnaire({ onItemChange })
    await choose("scope-delegation")

    expect(item("scope").hasAttribute("name")).toBe(false)
    expect(choiceInput("scope-delegation").name).toBe("scope")

    await click(next())
    await click(previous())

    expect(onItemChange.mock.calls).toEqual([["detail"], ["scope"]])
  })

  it("supports controlled active-item navigation", async () => {
    const onItemChange = vi.fn()

    await act(async () => {
      root.render(<ControlledQuestionnaire onItemChange={onItemChange} />)
    })

    await choose("first-choice")
    await click(next())

    expect(item("second").hasAttribute("data-active")).toBe(true)
    expect(onItemChange).toHaveBeenLastCalledWith("second")

    await click(previous())

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(onItemChange).toHaveBeenLastCalledWith("first")
  })

  it("treats Input as a freeform answer without selecting it on focus", async () => {
    await renderQuestionnaire()
    const input = freeform("scope-input")

    await act(async () => {
      input.focus()
    })

    expect(item("scope").dataset.status).toBe("unanswered")
    expect(input.hasAttribute("name")).toBe(false)
    expect(input.hasAttribute("data-empty")).toBe(true)

    await type(input, "A different direction")

    expect(item("scope").dataset.status).toBe("answered")
    expect(input.name).toBe("scope")
    expect(input.hasAttribute("data-filled")).toBe(true)
    expect(choice("scope-delegation").hasAttribute("data-unchecked")).toBe(true)

    await choose("scope-questions")

    expect(input.value).toBe("A different direction")
    expect(input.hasAttribute("name")).toBe(false)
    expect(input.hasAttribute("data-filled")).toBe(true)
    expect(choice("scope-questions").hasAttribute("data-checked")).toBe(true)

    await type(input, "A revised direction")

    expect(input.name).toBe("scope")
    expect(choiceInput("scope-questions").checked).toBe(false)
    expect(new FormData(form()).get("scope")).toBe("A revised direction")
  })

  it("supports controlled fixed and freeform answers", async () => {
    await act(async () => {
      root.render(<ControlledAnswersQuestionnaire />)
    })

    expect(item("answers").dataset.status).toBe("unanswered")

    await choose("controlled-choice")

    expect(new FormData(form()).getAll("answers")).toEqual(["fixed"])

    await type(freeform("controlled-input"), "Custom")

    expect(new FormData(form()).getAll("answers")).toEqual(["fixed", "Custom"])

    await choose("controlled-choice")
    await type(freeform("controlled-input"), "")

    expect(item("answers").dataset.status).toBe("unanswered")
    expect(new FormData(form()).getAll("answers")).toEqual([])
  })

  it("keeps a coordinated controlled Choice and Input mutually exclusive", async () => {
    await act(async () => {
      root.render(<ControlledSingleSelectAnswersQuestionnaire />)
    })

    await choose("controlled-choice")

    expect(item("answer").dataset.status).toBe("answered")
    expect(choice("controlled-choice").hasAttribute("data-checked")).toBe(true)
    expect(choiceInput("controlled-choice").checked).toBe(true)
    expect(choiceInput("controlled-choice").name).toBe("answer")
    expect(freeform("controlled-input").hasAttribute("name")).toBe(false)
    expect(new FormData(form()).getAll("answer")).toEqual(["fixed"])

    await type(freeform("controlled-input"), "Custom")

    expect(item("answer").dataset.status).toBe("answered")
    expect(choice("controlled-choice").hasAttribute("data-unchecked")).toBe(
      true
    )
    expect(choiceInput("controlled-choice").checked).toBe(false)
    expect(freeform("controlled-input").name).toBe("answer")
    expect(new FormData(form()).getAll("answer")).toEqual(["Custom"])

    await choose("controlled-choice")

    expect(item("answer").dataset.status).toBe("answered")
    expect(choice("controlled-choice").hasAttribute("data-checked")).toBe(true)
    expect(choiceInput("controlled-choice").checked).toBe(true)
    expect(choiceInput("controlled-choice").name).toBe("answer")
    expect(freeform("controlled-input").value).toBe("Custom")
    expect(freeform("controlled-input").hasAttribute("name")).toBe(false)
    expect(new FormData(form()).getAll("answer")).toEqual(["fixed"])
  })

  it("does not infer a controlled Input answer from a rejected edit", async () => {
    const onChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answer">
          <Questionnaire.Item data-testid="answer" required name="answer">
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <Questionnaire.Input
              data-testid="answer-input"
              aria-label="Answer"
              value=""
              onChange={onChange}
            />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await type(freeform("answer-input"), "Rejected")

    expect(onChange).toHaveBeenCalledOnce()
    expect(freeform("answer-input").value).toBe("")
    expect(freeform("answer-input").hasAttribute("name")).toBe(false)
    expect(item("answer").dataset.status).toBe("unanswered")
    expect(submit().disabled).toBe(false)
  })

  it("clears controlled choices when an item is intentionally skipped", async () => {
    const onStatusChange = vi.fn()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          onSubmit={onSubmit}
        >
          <Questionnaire.Item
            data-testid="answer"
            onStatusChange={onStatusChange}
            name="answer"
          >
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <TestChoice
              data-testid="controlled-answer"
              checked
              value="controlled"
              onChange={() => {}}
            >
              Controlled
            </TestChoice>
          </Questionnaire.Item>
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("controlled-answer").checked).toBe(true)
    expect(item("answer").dataset.status).toBe("answered")

    await click(skip())

    expect(choiceInput("controlled-answer").checked).toBe(false)
    expect(choiceInput("controlled-answer").id).not.toBe("")
    expect(choiceInput("controlled-answer").hasAttribute("name")).toBe(false)
    expect(item("answer").dataset.status).toBe("skipped")
    expect(new FormData(form()).getAll("answer")).toEqual([])
    expect(onStatusChange).toHaveBeenLastCalledWith("skipped")
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("does not require fixed radios when an Input can answer the item", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          noValidate={false}
        >
          <Questionnaire.Item data-testid="answer" required name="answer">
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <TestChoice data-testid="fixed" value="fixed">
              Fixed
            </TestChoice>
            <Questionnaire.Input
              data-testid="answer-input"
              aria-label="Another answer"
            />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("fixed").required).toBe(false)

    await type(freeform("answer-input"), "Freeform")

    expect(form().checkValidity()).toBe(true)
    expect(new FormData(form()).get("answer")).toBe("Freeform")
  })

  it("allows fixed and freeform answers in a multiple item", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="signals"
          onSubmit={onSubmit}
        >
          <Questionnaire.Item
            data-testid="signals"
            multiple
            required
            name="signals"
          >
            <Questionnaire.Title>Signals</Questionnaire.Title>
            <TestChoice data-testid="progress" value="progress">
              Progress
            </TestChoice>
            <TestChoice data-testid="risks" value="risks">
              Risks
            </TestChoice>
            <Questionnaire.Input
              data-testid="signals-input"
              aria-label="Another signal"
            />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("progress").type).toBe("checkbox")
    expect(item("signals").hasAttribute("data-multiple")).toBe(true)
    expect(submit().disabled).toBe(false)

    await choose("progress")
    await choose("risks")
    await type(freeform("signals-input"), "Decisions")

    expect(submit().disabled).toBe(false)
    expect(new FormData(form()).getAll("signals")).toEqual([
      "progress",
      "risks",
      "Decisions",
    ])

    await click(submit())

    expect(onSubmit).toHaveBeenCalledOnce()

    await choose("progress")

    expect(new FormData(form()).getAll("signals")).toEqual([
      "risks",
      "Decisions",
    ])
  })

  it("preserves a compatible selection when multiple changes", async () => {
    function DynamicMultipleQuestionnaire() {
      const [multiple, setMultiple] = React.useState(true)

      return (
        <Questionnaire.Root data-testid="root" defaultItem="signals">
          <Questionnaire.Item
            data-testid="signals"
            multiple={multiple}
            name="signals"
            required
          >
            <Questionnaire.Title>Signals</Questionnaire.Title>
            <TestChoice data-testid="first-signal" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second-signal" value="second">
              Second
            </TestChoice>
          </Questionnaire.Item>
          <button
            data-testid="toggle-multiple"
            type="button"
            onClick={() => setMultiple((value) => !value)}
          >
            Toggle multiple
          </button>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<DynamicMultipleQuestionnaire />)
    })

    await choose("first-signal")
    await choose("second-signal")

    expect(new FormData(form()).getAll("signals")).toEqual(["first", "second"])

    await click(
      requiredElement<HTMLButtonElement>('[data-testid="toggle-multiple"]')
    )

    expect(choiceInput("first-signal").type).toBe("radio")
    expect(choiceInput("first-signal").checked).toBe(true)
    expect(choiceInput("second-signal").checked).toBe(false)
    expect(new FormData(form()).getAll("signals")).toEqual(["first"])
    expect(item("signals").dataset.status).toBe("answered")

    await click(
      requiredElement<HTMLButtonElement>('[data-testid="toggle-multiple"]')
    )

    expect(choiceInput("first-signal").type).toBe("checkbox")
    expect(choiceInput("first-signal").checked).toBe(true)
    expect(choiceInput("second-signal").checked).toBe(false)
  })

  it("records an intentional skip separately from an unanswered item", async () => {
    const onTimingStatusChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="plan">
          <TestItem required name="plan" />
          <TestItem
            data-testid="timing"
            onStatusChange={onTimingStatusChange}
            name="timing"
          />
          <TestItem required name="owner" />
          <Questionnaire.Previous data-testid="previous" />
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Next data-testid="next" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(skip().hidden).toBe(true)

    await choose("plan-choice")
    await click(next())

    expect(item("timing").dataset.status).toBe("unanswered")
    expect(skip().hidden).toBe(false)
    expect(next().disabled).toBe(false)

    await choose("timing-choice")

    expect(item("timing").dataset.status).toBe("answered")
    expect(next().disabled).toBe(false)

    await click(skip())

    expect(item("owner").hasAttribute("data-active")).toBe(true)
    expect(choiceInput("timing-choice").checked).toBe(false)
    expect(onTimingStatusChange.mock.calls).toEqual([["answered"], ["skipped"]])

    await click(previous())

    expect(item("timing").dataset.status).toBe("skipped")
    expect(next().disabled).toBe(false)

    await choose("timing-choice")

    expect(item("timing").dataset.status).toBe("answered")
    expect(onTimingStatusChange).toHaveBeenLastCalledWith("answered")
  })

  it("treats an intentional skip as valid for an optional external error", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="optional">
          <Questionnaire.Item data-testid="optional" invalid name="optional">
            <Questionnaire.Title>Optional</Questionnaire.Title>
            <TestChoice data-testid="optional-choice" value="answer">
              Answer
            </TestChoice>
            <Questionnaire.Error data-testid="optional-error">
              This answer is not valid.
            </Questionnaire.Error>
          </Questionnaire.Item>
          <TestItem required name="required" />
          <Questionnaire.Previous data-testid="previous" />
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Next data-testid="next" />
        </Questionnaire.Root>
      )
    })

    expect(item("optional").getAttribute("aria-invalid")).toBe("true")

    await click(skip())

    expect(item("required").hasAttribute("data-active")).toBe(true)

    await click(previous())

    expect(item("optional").dataset.status).toBe("skipped")
    expect(item("optional").hasAttribute("aria-invalid")).toBe(false)
    expect(error("optional-error").hidden).toBe(true)

    await choose("optional-choice")

    expect(item("optional").dataset.status).toBe("answered")
    expect(item("optional").getAttribute("aria-invalid")).toBe("true")

    await click(next())

    expect(item("optional").hasAttribute("data-active")).toBe(true)
    expect(document.activeElement).toBe(choiceInput("optional-choice"))
  })

  it("submits after skipping the final optional item", async () => {
    const onStatusChange = vi.fn()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="timing"
          onSubmit={onSubmit}
        >
          <TestItem
            data-testid="timing"
            onStatusChange={onStatusChange}
            name="timing"
          />
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(skip().hidden).toBe(false)
    expect(submit().disabled).toBe(false)

    await click(skip())

    expect(item("timing").dataset.status).toBe("skipped")
    expect(onStatusChange).toHaveBeenCalledWith("skipped")
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("validates unanswered items on native form submission", async () => {
    const onSubmit = vi.fn()

    await renderQuestionnaire({ onSubmit })

    expect(item("scope").getAttribute("aria-describedby")).toBe(
      "scope-description"
    )

    await act(async () => {
      form().dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      )
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(item("scope").getAttribute("aria-invalid")).toBe("true")
    expect(item("scope").getAttribute("aria-describedby")).toBe(
      "scope-description scope-error-message"
    )
    expect(error("scope-error").hidden).toBe(false)
    expect(document.activeElement).toBe(choiceInput("scope-delegation"))
  })

  it("keeps validation active until an attempted item remains valid", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answer">
          <Questionnaire.Item
            data-testid="answer"
            multiple
            required
            name="answer"
          >
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <TestChoice data-testid="fixed" value="fixed">
              Fixed
            </TestChoice>
            <Questionnaire.Input
              data-testid="answer-input"
              aria-label="Another answer"
            />
            <Questionnaire.Error data-testid="answer-error" />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await act(async () => {
      form().dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      )
    })

    expect(error("answer-error").hidden).toBe(false)

    await type(freeform("answer-input"), " ")

    expect(error("answer-error").hidden).toBe(false)

    await choose("fixed")

    expect(error("answer-error").hidden).toBe(true)

    await choose("fixed")

    expect(error("answer-error").hidden).toBe(false)

    await type(freeform("answer-input"), "Valid")

    expect(error("answer-error").hidden).toBe(true)

    await type(freeform("answer-input"), "")

    expect(error("answer-error").hidden).toBe(false)
  })

  it("keeps live answers when default props change and uses new defaults on reset", async () => {
    await act(async () => {
      root.render(<ChangingDefaultsQuestionnaire />)
    })

    await type(freeform("default-input"), "Edited")
    await choose("secondary-choice")
    await click(requiredElement('[data-testid="change-defaults"]'))

    expect(freeform("default-input").value).toBe("Edited")
    expect(choiceInput("secondary-choice").checked).toBe(true)
    expect(item("defaults").dataset.status).toBe("answered")

    await act(async () => {
      form().reset()
    })

    expect(freeform("default-input").value).toBe("")
    expect(choiceInput("primary-choice").checked).toBe(true)
    expect(choiceInput("secondary-choice").checked).toBe(false)
    expect(item("defaults").dataset.status).toBe("answered")
  })

  it("keeps Enter metadata on only the selected freeform answer", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="answer" required name="answer">
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <TestChoice data-testid="fixed" value="fixed">
              Fixed
            </TestChoice>
            <Questionnaire.Input
              data-testid="answer-input"
              aria-label="Another answer"
            />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    await type(freeform("answer-input"), "Draft")

    expect(freeform("answer-input").getAttribute("aria-keyshortcuts")).toBe(
      "Enter"
    )

    await choose("fixed")

    expect(freeform("answer-input").value).toBe("Draft")
    expect(freeform("answer-input").hasAttribute("aria-keyshortcuts")).toBe(
      false
    )
  })

  it("registers every Description and Error while they remain mounted", async () => {
    await act(async () => {
      root.render(<DynamicDescriptionsQuestionnaire />)
    })

    expect(item("answer").getAttribute("aria-describedby")).toBe(
      "description-one description-two"
    )

    await act(async () => {
      form().dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      )
    })

    expect(item("answer").getAttribute("aria-describedby")).toBe(
      "description-one description-two error-one error-two"
    )

    await click(requiredElement('[data-testid="toggle-details"]'))

    expect(item("answer").getAttribute("aria-describedby")).toBe(
      "description-one error-one"
    )
  })

  it("resets answers, skips, validation, and the initial item", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="channels">
          <Questionnaire.Item data-testid="channels" multiple name="channels">
            <Questionnaire.Title>Channels</Questionnaire.Title>
            <TestChoice data-testid="email" defaultChecked value="email">
              Email
            </TestChoice>
            <TestChoice data-testid="chat" value="chat">
              Chat
            </TestChoice>
          </Questionnaire.Item>
          <TestItem required name="detail" />
          <Questionnaire.Previous data-testid="previous" />
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Next data-testid="next" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await choose("chat")
    await click(skip())
    await choose("detail-choice")

    expect(item("detail").hasAttribute("data-active")).toBe(true)
    expect(choiceInput("email").checked).toBe(false)
    expect(choiceInput("chat").checked).toBe(false)

    await act(async () => {
      form().reset()
    })

    expect(item("channels").hasAttribute("data-active")).toBe(true)
    expect(item("channels").dataset.status).toBe("answered")
    expect(choiceInput("email").checked).toBe(true)
    expect(choiceInput("chat").checked).toBe(false)
  })

  it("skips disabled items and registers in Strict Mode", async () => {
    await act(async () => {
      root.render(
        <React.StrictMode>
          <Questionnaire.Root data-testid="root" defaultItem="first">
            <Questionnaire.Progress data-testid="progress" />
            <TestItem required name="first" />
            <TestItem disabled required name="disabled" />
            <TestItem required name="last" />
            <Questionnaire.Next data-testid="next" />
          </Questionnaire.Root>
        </React.StrictMode>
      )
    })

    expect(progress().textContent).toBe("Question 1 of 2")

    await choose("first-choice")
    await click(next())

    expect(item("last").hasAttribute("data-active")).toBe(true)
    expect(item("disabled").hidden).toBe(true)
    expect(progress().textContent).toBe("Question 2 of 2")
  })

  it("reconciles inserted and removed items in DOM order", async () => {
    const onItemChange = vi.fn()

    await act(async () => {
      root.render(
        <DynamicQuestionnaire
          includeMiddle={false}
          onItemChange={onItemChange}
        />
      )
    })

    expect(progress().textContent).toBe("Question 1 of 2")

    await act(async () => {
      root.render(
        <DynamicQuestionnaire includeMiddle onItemChange={onItemChange} />
      )
    })

    expect(progress().textContent).toBe("Question 1 of 3")

    await choose("first-choice")
    await click(next())

    expect(item("middle").hasAttribute("data-active")).toBe(true)

    await act(async () => {
      root.render(
        <DynamicQuestionnaire
          includeMiddle={false}
          onItemChange={onItemChange}
        />
      )
    })

    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(progress().textContent).toBe("Question 1 of 2")
    expect(onItemChange.mock.calls).toEqual([["middle"], ["first"]])
  })

  it("reconciles inserted and removed answers in DOM order", async () => {
    await act(async () => {
      root.render(<DynamicAnswersQuestionnaire includeMiddle={false} />)
    })

    expect(choice("first-answer").dataset.shortcut).toBe("A")
    expect(choice("last-answer").dataset.shortcut).toBe("B")

    await act(async () => {
      root.render(<DynamicAnswersQuestionnaire includeMiddle />)
    })

    expect(choice("first-answer").dataset.shortcut).toBe("A")
    expect(choice("middle-answer").dataset.shortcut).toBe("B")
    expect(choice("last-answer").dataset.shortcut).toBe("C")

    await act(async () => {
      root.render(<DynamicAnswersQuestionnaire includeMiddle={false} />)
    })

    expect(container.querySelector('[data-testid="middle-answer"]')).toBeNull()
    expect(choice("last-answer").dataset.shortcut).toBe("B")
  })

  it.each([
    { count: 27, lastShortcut: "Z", shortcuts: "letters" as const },
    { count: 10, lastShortcut: "9", shortcuts: "numbers" as const },
  ])(
    "leaves answers beyond the $shortcuts shortcut range unassigned",
    async ({ count, lastShortcut, shortcuts }) => {
      await act(async () => {
        root.render(
          <Questionnaire.Root
            data-testid="root"
            defaultItem="answers"
            shortcuts={shortcuts}
          >
            <Questionnaire.Item data-testid="answers" name="answers">
              <Questionnaire.Title>Choose an answer</Questionnaire.Title>
              {Array.from({ length: count }, (_, index) => (
                <TestChoice
                  key={index}
                  data-testid={`answer-${index}`}
                  value={`answer-${index}`}
                >
                  Answer {index + 1}
                </TestChoice>
              ))}
            </Questionnaire.Item>
          </Questionnaire.Root>
        )
      })

      expect(choice(`answer-${count - 2}`).dataset.shortcut).toBe(lastShortcut)
      expect(choice(`answer-${count - 1}`).hasAttribute("data-shortcut")).toBe(
        false
      )
    }
  )

  it("assigns letter shortcuts to enabled answers in DOM order", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answers"
          onSubmit={onSubmit}
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="answers" required name="answers">
            <Questionnaire.Title>Choose an answer</Questionnaire.Title>
            <Questionnaire.Choices data-testid="choices">
              <TestChoice
                data-testid="disabled-answer"
                disabled
                value="disabled"
              >
                Disabled
              </TestChoice>
              <TestChoice data-testid="first-answer" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second-answer" value="second">
                Second
              </TestChoice>
              <Questionnaire.Input
                data-testid="other-answer"
                aria-label="Other answer"
              />
            </Questionnaire.Choices>
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(form().dataset.shortcuts).toBe("letters")
    expect(
      requiredElement<HTMLElement>('[data-testid="choices"]').dataset.shortcuts
    ).toBe("letters")
    expect(choice("disabled-answer").hasAttribute("data-shortcut")).toBe(false)
    expect(choice("first-answer").dataset.shortcut).toBe("A")
    expect(choice("second-answer").dataset.shortcut).toBe("B")
    expect(freeform("other-answer").hasAttribute("data-shortcut")).toBe(false)
    expect(choiceInput("first-answer").getAttribute("aria-keyshortcuts")).toBe(
      "A"
    )

    await keydown(choiceInput("first-answer"), "b")

    expect(choiceInput("second-answer").checked).toBe(true)
    expect(document.activeElement).toBe(choiceInput("second-answer"))
    expect(choiceInput("second-answer").getAttribute("aria-keyshortcuts")).toBe(
      "B Enter"
    )
    expect(submit().dataset.shortcut).toBe("Enter")

    await keydown(choiceInput("second-answer"), "c")

    expect(document.activeElement).toBe(choiceInput("second-answer"))
    expect(item("answers").dataset.status).toBe("answered")
    expect(choiceInput("second-answer").checked).toBe(true)

    await keydown(freeform("other-answer"), "a")

    expect(choiceInput("first-answer").checked).toBe(false)
    expect(document.activeElement).toBe(freeform("other-answer"))

    await type(freeform("other-answer"), "Draft answer")
    await choose("first-answer")
    await keydown(freeform("other-answer"), "Enter")

    expect(onSubmit).not.toHaveBeenCalled()
    expect(new FormData(form()).get("answers")).toBe("first")
  })

  it("supports number shortcuts and confirms only from a filled answer", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="first"
          onSubmit={onSubmit}
          shortcuts="numbers"
        >
          <TestItem required name="first" />
          <Questionnaire.Item data-testid="second" required name="second">
            <Questionnaire.Title>Explain</Questionnaire.Title>
            <Questionnaire.Input
              data-testid="second-input"
              aria-label="Explanation"
            />
          </Questionnaire.Item>
          <Questionnaire.Next data-testid="next" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(choice("first-choice").dataset.shortcut).toBe("1")

    await keydown(choiceInput("first-choice"), "1")

    expect(choiceInput("first-choice").checked).toBe(true)
    expect(next().dataset.shortcut).toBe("Enter")

    await keydown(choiceInput("first-choice"), "Enter")

    expect(item("second").hasAttribute("data-active")).toBe(true)
    expect(freeform("second-input").hasAttribute("data-shortcut")).toBe(false)

    await keydown(freeform("second-input"), "Enter")

    expect(onSubmit).not.toHaveBeenCalled()

    await type(freeform("second-input"), "Enough detail")
    await keydown(freeform("second-input"), "Enter")

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("validates, advances, and submits with Command or Control plus Enter", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    await renderQuestionnaire({ onSubmit })

    await keydown(freeform("scope-input"), "Enter", { metaKey: true })

    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(item("scope").getAttribute("aria-invalid")).toBe("true")
    expect(document.activeElement).toBe(choiceInput("scope-delegation"))

    await choose("scope-questions")
    await keydown(freeform("scope-input"), "Enter", { metaKey: true })

    expect(item("detail").hasAttribute("data-active")).toBe(true)

    await choose("detail-focused")
    await keydown(item("detail"), "Enter", { ctrlKey: true })

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("does not handle modified, repeated, prevented, or composing keys", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })
    let preventKeyDown = false

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          onSubmit={onSubmit}
          onKeyDown={(event) => {
            if (preventKeyDown) {
              event.preventDefault()
            }
          }}
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="answer" required name="answer">
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <TestChoice data-testid="answer-choice" value="choice">
              Choice
            </TestChoice>
            <Questionnaire.Input
              data-testid="answer-input"
              aria-label="Other answer"
            />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await keydown(choiceInput("answer-choice"), "a", { ctrlKey: true })
    await keydown(choiceInput("answer-choice"), "a", { repeat: true })

    expect(choiceInput("answer-choice").checked).toBe(false)

    await type(freeform("answer-input"), "Composing")
    await keydown(freeform("answer-input"), "Enter", { isComposing: true })
    await keydown(freeform("answer-input"), "Enter", {
      metaKey: true,
      repeat: true,
    })
    await keydown(freeform("answer-input"), "Enter", {
      metaKey: true,
      shiftKey: true,
    })

    expect(onSubmit).not.toHaveBeenCalled()

    preventKeyDown = true
    await keydown(freeform("answer-input"), "Enter")

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("composes fixed choice inputs, labels, and assigned shortcuts", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="answer" name="answer">
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <Questionnaire.Choice data-testid="fixed" value="fixed">
              <Questionnaire.ChoiceInput data-testid="fixed-input" />
              <Questionnaire.ChoiceLabel data-testid="fixed-label">
                Fixed
              </Questionnaire.ChoiceLabel>
              <Questionnaire.ChoiceShortcut data-testid="fixed-shortcut" />
            </Questionnaire.Choice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    const input = requiredElement<HTMLInputElement>(
      '[data-testid="fixed-input"]'
    )
    const label = requiredElement<HTMLElement>('[data-testid="fixed-label"]')
    const shortcut = requiredElement<HTMLElement>(
      '[data-testid="fixed-shortcut"]'
    )

    expect(choice("fixed").tagName).toBe("LABEL")
    expect(input.type).toBe("radio")
    expect(input.name).toBe("answer")
    expect(input.value).toBe("fixed")
    expect(label.tagName).toBe("SPAN")
    expect(label.textContent).toBe("Fixed")
    expect(shortcut.textContent).toBe("A")
    expect(shortcut.dataset.shortcut).toBe("A")
    expect(shortcut.getAttribute("aria-hidden")).toBe("true")
    expect(shortcut.hidden).toBe(false)
  })

  it("registers a ChoiceInput whenever its composed input mounts", async () => {
    function ConditionalChoiceInputQuestionnaire() {
      const [showInput, setShowInput] = React.useState(false)

      return (
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answer"
          shortcuts="letters"
        >
          <Questionnaire.Item data-testid="answer" name="answer" required>
            <Questionnaire.Title>Answer</Questionnaire.Title>
            <Questionnaire.Choice
              data-testid="conditional-choice"
              value="conditional"
            >
              {showInput && (
                <Questionnaire.ChoiceInput data-testid="conditional-input" />
              )}
              <Questionnaire.ChoiceLabel>Conditional</Questionnaire.ChoiceLabel>
              <Questionnaire.ChoiceShortcut />
            </Questionnaire.Choice>
          </Questionnaire.Item>
          <button
            data-testid="toggle-input"
            type="button"
            onClick={() => setShowInput((value) => !value)}
          >
            Toggle input
          </button>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ConditionalChoiceInputQuestionnaire />)
    })

    expect(item("answer").dataset.status).toBe("unanswered")
    expect(choice("conditional-choice").hasAttribute("data-shortcut")).toBe(
      false
    )

    const toggle = requiredElement<HTMLButtonElement>(
      '[data-testid="toggle-input"]'
    )

    await click(toggle)

    const firstInput = requiredElement<HTMLInputElement>(
      '[data-testid="conditional-input"]'
    )

    expect(choice("conditional-choice").dataset.shortcut).toBe("A")

    await click(firstInput)

    expect(item("answer").dataset.status).toBe("answered")

    await click(toggle)

    expect(item("answer").dataset.status).toBe("unanswered")

    await click(toggle)

    const secondInput = requiredElement<HTMLInputElement>(
      '[data-testid="conditional-input"]'
    )

    expect(secondInput).not.toBe(firstInput)
    expect(secondInput.checked).toBe(true)
    expect(item("answer").dataset.status).toBe("answered")
  })

  it("supports render callbacks and emits no primitive data slots", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="only">
          <Questionnaire.Progress
            data-testid="progress"
            render={(props, state) => (
              <output {...props}>
                {state.current}/{state.total}
              </output>
            )}
          />
          <TestItem required name="only" />
          <Questionnaire.Submit
            data-testid="submit"
            render={(props, state) => (
              <button
                {...props}
                data-render-status={state.status ?? undefined}
                disabled={state.status === "unanswered"}
              />
            )}
          />
        </Questionnaire.Root>
      )
    })

    expect(progress().tagName).toBe("OUTPUT")
    expect(progress().textContent).toBe("1/1")
    expect(progress().hasAttribute("data-first")).toBe(true)
    expect(progress().hasAttribute("data-last")).toBe(true)
    expect(container.querySelector("[data-slot]")).toBeNull()
    expect(item("only").querySelector("legend")?.textContent).toBe("only")
    expect(submit().dataset.renderStatus).toBe("unanswered")
    expect(submit().dataset.status).toBe("unanswered")
    expect(submit().disabled).toBe(true)
  })

  it("renders a custom title element", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root defaultItem="only">
          <Questionnaire.Item
            aria-labelledby="only-title"
            data-testid="only"
            name="only"
          >
            <Questionnaire.Title
              id="only-title"
              data-testid="custom-title"
              render={<h2 />}
            >
              Custom title
            </Questionnaire.Title>
            <TestChoice value="answer">Answer</TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    const title = requiredElement<HTMLElement>('[data-testid="custom-title"]')

    expect(title.tagName).toBe("H2")
    expect(title.textContent).toBe("Custom title")
    expect(item("only").getAttribute("aria-labelledby")).toBe("only-title")
  })
})

type RenderQuestionnaireOptions = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  onItemChange?: React.ComponentProps<typeof Questionnaire.Root>["onItemChange"]
}

function ControlledQuestionnaire({
  onItemChange,
}: {
  onItemChange: (item: string) => void
}) {
  const [item, setItem] = React.useState("first")

  function handleItemChange(nextItem: string) {
    onItemChange(nextItem)
    setItem(nextItem)
  }

  return (
    <Questionnaire.Root
      data-testid="root"
      item={item}
      onItemChange={handleItemChange}
    >
      <TestItem required name="first" />
      <TestItem required name="second" />
      <Questionnaire.Previous data-testid="previous" />
      <Questionnaire.Next data-testid="next" />
    </Questionnaire.Root>
  )
}

function ControlledAnswersQuestionnaire() {
  const [checked, setChecked] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  return (
    <Questionnaire.Root data-testid="root" defaultItem="answers">
      <Questionnaire.Item
        data-testid="answers"
        multiple
        required
        name="answers"
      >
        <Questionnaire.Title>Answers</Questionnaire.Title>
        <TestChoice
          data-testid="controlled-choice"
          checked={checked}
          value="fixed"
          onChange={(event) => setChecked(event.target.checked)}
        >
          Fixed
        </TestChoice>
        <Questionnaire.Input
          data-testid="controlled-input"
          aria-label="Custom answer"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </Questionnaire.Item>
    </Questionnaire.Root>
  )
}

function ControlledSingleSelectAnswersQuestionnaire() {
  const [checked, setChecked] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  return (
    <Questionnaire.Root data-testid="root" defaultItem="answer">
      <Questionnaire.Item data-testid="answer" required name="answer">
        <Questionnaire.Title>Answer</Questionnaire.Title>
        <TestChoice
          data-testid="controlled-choice"
          checked={checked}
          value="fixed"
          onChange={(event) => setChecked(event.target.checked)}
        >
          Fixed
        </TestChoice>
        <Questionnaire.Input
          data-testid="controlled-input"
          aria-label="Custom answer"
          value={inputValue}
          onChange={(event) => {
            const nextValue = event.target.value
            setInputValue(nextValue)

            if (nextValue.trim().length > 0) {
              setChecked(false)
            }
          }}
        />
      </Questionnaire.Item>
    </Questionnaire.Root>
  )
}

function ChangingDefaultsQuestionnaire() {
  const [defaultsChanged, setDefaultsChanged] = React.useState(false)

  return (
    <Questionnaire.Root data-testid="root" defaultItem="defaults">
      <Questionnaire.Item
        data-testid="defaults"
        multiple
        required
        name="defaults"
      >
        <Questionnaire.Title>Defaults</Questionnaire.Title>
        <TestChoice
          data-testid="primary-choice"
          defaultChecked={defaultsChanged}
          value="primary"
        >
          Primary
        </TestChoice>
        <TestChoice data-testid="secondary-choice" value="secondary">
          Secondary
        </TestChoice>
        <Questionnaire.Input
          data-testid="default-input"
          aria-label="Default input"
          defaultValue={defaultsChanged ? "" : "Initial"}
        />
      </Questionnaire.Item>
      <button
        data-testid="change-defaults"
        type="button"
        onClick={() => setDefaultsChanged(true)}
      >
        Change defaults
      </button>
    </Questionnaire.Root>
  )
}

function DynamicDescriptionsQuestionnaire() {
  const [showAdditionalDetails, setShowAdditionalDetails] = React.useState(true)

  return (
    <Questionnaire.Root data-testid="root" defaultItem="answer">
      <Questionnaire.Item data-testid="answer" required name="answer">
        <Questionnaire.Title>Answer</Questionnaire.Title>
        <Questionnaire.Description id="description-one">
          First description
        </Questionnaire.Description>
        {showAdditionalDetails ? (
          <Questionnaire.Description id="description-two">
            Second description
          </Questionnaire.Description>
        ) : null}
        <TestChoice value="answer">Answer</TestChoice>
        <Questionnaire.Error id="error-one">First error</Questionnaire.Error>
        {showAdditionalDetails ? (
          <Questionnaire.Error id="error-two">Second error</Questionnaire.Error>
        ) : null}
      </Questionnaire.Item>
      <Questionnaire.Submit />
      <button
        data-testid="toggle-details"
        type="button"
        onClick={() => setShowAdditionalDetails(false)}
      >
        Hide details
      </button>
    </Questionnaire.Root>
  )
}

function DynamicQuestionnaire({
  includeMiddle,
  onItemChange,
}: {
  includeMiddle: boolean
  onItemChange: (item: string) => void
}) {
  return (
    <Questionnaire.Root
      data-testid="root"
      defaultItem="first"
      onItemChange={onItemChange}
    >
      <Questionnaire.Progress data-testid="progress" />
      <TestItem required name="first" />
      {includeMiddle ? <TestItem required name="middle" /> : null}
      <TestItem required name="last" />
      <Questionnaire.Next data-testid="next" />
    </Questionnaire.Root>
  )
}

function DynamicAnswersQuestionnaire({
  includeMiddle,
}: {
  includeMiddle: boolean
}) {
  return (
    <Questionnaire.Root
      data-testid="root"
      defaultItem="answers"
      shortcuts="letters"
    >
      <Questionnaire.Item data-testid="answers" name="answers">
        <Questionnaire.Title>Choose an answer</Questionnaire.Title>
        <TestChoice data-testid="first-answer" value="first">
          First
        </TestChoice>
        {includeMiddle ? (
          <TestChoice data-testid="middle-answer" value="middle">
            Middle
          </TestChoice>
        ) : null}
        <TestChoice data-testid="last-answer" value="last">
          Last
        </TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )
}

async function renderQuestionnaire(options: RenderQuestionnaireOptions = {}) {
  await act(async () => {
    root.render(
      <Questionnaire.Root
        data-testid="root"
        defaultItem="scope"
        onSubmit={options.onSubmit}
        onItemChange={options.onItemChange}
      >
        <Questionnaire.Progress data-testid="progress" />

        <Questionnaire.Item data-testid="scope" required name="scope">
          <Questionnaire.Title>What should come next?</Questionnaire.Title>
          <Questionnaire.Description id="scope-description">
            Choose one or write another answer.
          </Questionnaire.Description>
          <Questionnaire.Choices>
            <TestChoice data-testid="scope-delegation" value="delegation">
              Delegation
            </TestChoice>
            <TestChoice data-testid="scope-questions" value="questions">
              Question prompts
            </TestChoice>
            <Questionnaire.Input
              data-testid="scope-input"
              aria-label="Another answer"
            />
          </Questionnaire.Choices>
          <Questionnaire.Error
            data-testid="scope-error"
            id="scope-error-message"
          />
        </Questionnaire.Item>

        <Questionnaire.Item data-testid="detail" required name="detail">
          <Questionnaire.Title>How much detail?</Questionnaire.Title>
          <Questionnaire.Choices>
            <TestChoice data-testid="detail-focused" value="focused">
              Focused
            </TestChoice>
            <TestChoice data-testid="detail-complete" value="complete">
              Complete
            </TestChoice>
          </Questionnaire.Choices>
          <Questionnaire.Error data-testid="detail-error" />
        </Questionnaire.Item>

        <Questionnaire.Previous data-testid="previous" />
        <Questionnaire.Skip data-testid="skip" />
        <Questionnaire.Next data-testid="next" />
        <Questionnaire.Submit data-testid="submit" />
      </Questionnaire.Root>
    )
  })
}

function TestItem({
  disabled,
  name,
  onStatusChange,
  required,
  ...props
}: React.ComponentProps<typeof Questionnaire.Item>) {
  return (
    <Questionnaire.Item
      data-testid={name}
      disabled={disabled}
      name={name}
      onStatusChange={onStatusChange}
      required={required}
      {...props}
    >
      <Questionnaire.Title>{name}</Questionnaire.Title>
      <TestChoice data-testid={`${name}-choice`} value={`${name}-answer`}>
        Answer
      </TestChoice>
      <Questionnaire.Error data-testid={`${name}-error`} />
    </Questionnaire.Item>
  )
}

function TestChoice({
  children,
  ...props
}: React.ComponentProps<typeof Questionnaire.Choice>) {
  return (
    <Questionnaire.Choice {...props}>
      <Questionnaire.ChoiceInput />
      <Questionnaire.ChoiceLabel>{children}</Questionnaire.ChoiceLabel>
      <Questionnaire.ChoiceShortcut />
    </Questionnaire.Choice>
  )
}

function form() {
  return requiredElement<HTMLFormElement>('[data-testid="root"]')
}

function progress() {
  return requiredElement<HTMLElement>('[data-testid="progress"]')
}

function item(value: string) {
  return requiredElement<HTMLFieldSetElement>(`[data-testid="${value}"]`)
}

function choice(testId: string) {
  return requiredElement<HTMLLabelElement>(`[data-testid="${testId}"]`)
}

function choiceInput(testId: string) {
  const input = choice(testId).querySelector<HTMLInputElement>("input")

  if (!input) {
    throw new Error(`Missing choice input: ${testId}`)
  }

  return input
}

function freeform(testId: string) {
  return requiredElement<HTMLInputElement>(`[data-testid="${testId}"]`)
}

function error(testId: string) {
  return requiredElement<HTMLParagraphElement>(`[data-testid="${testId}"]`)
}

function previous() {
  return requiredElement<HTMLButtonElement>('[data-testid="previous"]')
}

function skip() {
  return requiredElement<HTMLButtonElement>('[data-testid="skip"]')
}

function next() {
  return requiredElement<HTMLButtonElement>('[data-testid="next"]')
}

function submit() {
  return requiredElement<HTMLButtonElement>('[data-testid="submit"]')
}

function requiredElement<T extends Element>(selector: string) {
  const element = container.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing test element: ${selector}`)
  }

  return element
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click()
  })
}

async function choose(testId: string) {
  await click(choiceInput(testId))
}

async function type(element: HTMLInputElement, value: string) {
  await act(async () => {
    element.focus()
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set?.call(element, value)
    element.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

async function keydown(
  element: HTMLElement,
  key: string,
  options: KeyboardEventInit = {}
) {
  await act(async () => {
    element.focus()
    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key,
        ...options,
      })
    )
  })
}
