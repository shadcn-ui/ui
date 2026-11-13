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

  it("infers multiple selection from max and allows skipping", async () => {
    await renderConstraintItem({ max: 2 })

    expect(choiceInput("first").type).toBe("checkbox")

    // Without min or required, the item remains optional.
    expect(skip().hidden).toBe(false)

    await choose("first")
    await choose("second")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

    // A third selection must be rejected.
    await choose("third")

    expect(choiceInput("third").checked).toBe(false)

    // A fourth selection must be rejected.
    await choose("fourth")

    expect(choiceInput("fourth").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])
  })

  it("enforces minimum and maximum selection constraints", async () => {
    const onFourthChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            min={2}
            max={3}
          >
            <Questionnaire.Title>Choose answers</Questionnaire.Title>

            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>
            <TestChoice data-testid="third" value="third">
              Third
            </TestChoice>
            <TestChoice
              data-testid="fourth"
              onChange={onFourthChange}
              value="fourth"
            >
              Fourth
            </TestChoice>

            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>

          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    // min={2} and max={3} should infer multiple selection.
    expect(choiceInput("first").type).toBe("checkbox")
    expect(choiceInput("second").type).toBe("checkbox")

    // Minimum selection is required.
    expect(skip().hidden).toBe(true)

    // Submitting without enough answers should fail.
    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
    expect(error("answers-error").hidden).toBe(false)
    expect(error("answers-error").textContent).toBe(
      "Select between 2 and 3 answers to continue."
    )
    expect(
      item("answers").getAttribute("aria-describedby")?.split(" ")
    ).toContain(error("answers-error").id)

    // One answer is below the minimum.
    await choose("first")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
    expect(error("answers-error").hidden).toBe(false)

    // Two answers satisfy the minimum.
    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    expect(error("answers-error").hidden).toBe(true)

    // Three answers are allowed.
    await choose("third")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(true)

    // A fourth answer exceeds max={3}.
    await choose("fourth")

    expect(choiceInput("fourth").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual([
      "first",
      "second",
      "third",
    ])
    expect(onFourthChange).not.toHaveBeenCalled()
  })

  it("enforces min without max during navigation", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item data-testid="answers" name="answers" min={2}>
            <Questionnaire.Title>Choose answers</Questionnaire.Title>
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>
            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>

          <TestItem required name="details" />
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Next data-testid="next" />
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(next())

    expect(item("answers").hasAttribute("data-active")).toBe(true)
    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
    expect(item("answers").dataset.status).toBe("unanswered")

    await click(next())

    expect(item("answers").hasAttribute("data-active")).toBe(true)

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    expect(item("answers").dataset.status).toBe("answered")

    await click(next())

    expect(item("details").hasAttribute("data-active")).toBe(true)
  })

  it("prevents freeform input from exceeding max", async () => {
    const onInputChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={1}
          >
            <TestChoice data-testid="choice" value="choice">
              Choice
            </TestChoice>
            <Questionnaire.Input
              data-testid="freeform"
              onChange={onInputChange}
            />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    await choose("choice")

    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)
    expect(freeform("freeform").readOnly).toBe(true)
    expect(freeform("freeform").getAttribute("aria-disabled")).toBe("true")
    expect(freeform("freeform").hasAttribute("data-filled")).toBe(false)
    expect(onInputChange).not.toHaveBeenCalled()
    expect(new FormData(form()).getAll("answers")).toEqual(["choice"])

    // Attempting to type while at max must be rejected.
    await type(freeform("freeform"), "extra")

    expect(onInputChange).not.toHaveBeenCalled()
    expect(new FormData(form()).getAll("answers")).toEqual(["choice"])

    // Deselecting the choice clears the max-reached state.
    await choose("choice")

    expect(item("answers").hasAttribute("data-max-reached")).toBe(false)
    expect(freeform("freeform").readOnly).toBe(false)
    expect(freeform("freeform").hasAttribute("aria-disabled")).toBe(false)
  })

  it("allows zero selections when min is zero", async () => {
    await renderConstraintItem({ min: 0, max: 3 })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(false)

    expect(item("answers").dataset.status).toBe("unanswered")

    await click(submit())
    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("first")
    await choose("second")
    await choose("third")
    await choose("fourth")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(true)
    expect(choiceInput("fourth").checked).toBe(false)
    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)
  })

  it("enforces an exact selection count and validates deselection", async () => {
    await renderConstraintItem({ min: 2, max: 2 })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")
    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("third")

    expect(choiceInput("third").checked).toBe(false)
    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

    // Deselecting one answer takes the count below min.
    await choose("second")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(false)
    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    // Selecting another answer restores validity.
    await choose("third")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "third"])
  })

  it("does not count disabled default answers toward min", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            min={2}
            max={3}
          >
            <TestChoice
              data-testid="disabled"
              defaultChecked
              disabled
              value="disabled"
            >
              Disabled
            </TestChoice>

            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>

            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>

            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>

          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("disabled").checked).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])
  })

  it("disabled default does not count toward max", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={2}
          >
            <Questionnaire.Title>Choose answers</Questionnaire.Title>

            <TestChoice
              data-testid="disabled-default"
              defaultChecked
              disabled
              value="disabled"
            >
              Disabled default
            </TestChoice>

            <TestChoice
              data-testid="first"
              defaultChecked
              value="first"
            >
              First
            </TestChoice>

            <TestChoice
              data-testid="second"
              defaultChecked
              value="second"
            >
              Second
            </TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    // Both enabled defaults must be checked despite the disabled one.
    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("disabled-default").checked).toBe(true)
  })

  it("counts freeform answers toward min and max", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            min={2}
            max={2}
          >
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>

            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>

            <Questionnaire.Input
              data-testid="custom"
              aria-label="Custom answer"
            />

            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>

          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")
    await type(freeform("custom"), "Custom answer")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    // The freeform answer and first choice already reach max={2}.
    await choose("second")

    expect(choiceInput("second").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual([
      "first",
      "Custom answer",
    ])
  })

  it("restores default selections and validation on reset with min and max", async () => {
    await renderConstraintItem({ min: 2, max: 2, defaultChecked: ["first", "second"] })

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)

    await choose("second")

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await act(async () => {
      form().reset()
    })

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(false)

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    expect(error("answers-error").hidden).toBe(true)
  })

  it("enforces min one and infers single selection", async () => {
    await renderConstraintItem({ min: 1 })

    expect(choiceInput("first").type).toBe("radio")
    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(choiceInput("first").checked).toBe(true)
    expect(item("answers").dataset.status).toBe("answered")
    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    // min={1} infers single selection.
    await choose("second")

    expect(choiceInput("first").checked).toBe(false)
    expect(choiceInput("second").checked).toBe(true)
  })

  it("infers single selection from max one", async () => {
    await renderConstraintItem({ max: 1 })

    expect(choiceInput("first").type).toBe("radio")

    await choose("first")
    expect(choiceInput("first").checked).toBe(true)

    await choose("second")

    expect(choiceInput("first").checked).toBe(false)
    expect(choiceInput("second").checked).toBe(true)
  })

  it("enforces exactly three selections", async () => {
    await renderConstraintItem({ min: 3, max: 3 })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(submit())
    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")
    await choose("second")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("third")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("fourth")

    expect(choiceInput("fourth").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual([
      "first",
      "second",
      "third",
    ])
  })

  it("enforces max with explicit multiple true", async () => {
    await renderConstraintItem({
      multiple: true,
      max: 2,
    })

    expect(choiceInput("first").type).toBe("checkbox")

    await choose("first")
    await choose("second")
    await choose("third")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])
  })

  it("enforces min with explicit multiple true", async () => {
    await renderConstraintItem({
      multiple: true,
      min: 2,
    })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
  })

  it.each([
    {
      name: "max greater than one",
      max: 2,
      expected: "multiple={false} cannot be used with min > 1 or max > 1.",
    },
    {
      name: "min greater than one",
      min: 2,
      expected: "multiple={false} cannot be used with min > 1 or max > 1.",
    },
  ])(
    "warns when multiple false conflicts with $name",
    async ({ min, max, expected }) => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({
        multiple: false,
        min,
        max,
      })

      expect(getWarningMessages(warn)).toContain(expected)
    }
  )

  it("enforces required with min two", async () => {
    await renderConstraintItem({
      required: true,
      min: 2,
    })

    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
  })

  it("enforces required with max two", async () => {
    await renderConstraintItem({
      required: true,
      max: 2,
    })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("first")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("third")

    expect(choiceInput("third").checked).toBe(false)
  })

  it("keeps required behavior when min is zero", async () => {
    await renderConstraintItem({
      required: true,
      min: 0,
      max: 2,
    })

    expect(choiceInput("first").type).toBe("checkbox")
    expect(skip().hidden).toBe(true)

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
    expect(error("answers-error").textContent).toBe(
      "Select between 1 and 2 answers to continue."
    )

    await choose("first")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

    await choose("second")
    await choose("third")

    expect(choiceInput("third").checked).toBe(false)
  })

  it("ignores conflicting min > max constraints so the item can still be completed", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({
      min: 2,
      max: 1,
    })

    expect(choiceInput("first").type).toBe("radio")
    expect(getWarningMessages(warn)).toContain(
      "min (2) cannot be greater than max (1)."
    )

    await choose("first")
    await click(submit())

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
  })

  it("fails validation when min is larger than available answers", async () => {
    await renderConstraintItem({ min: 5 })

    await choose("first")
    await choose("second")
    await choose("third")
    await choose("fourth")

    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
  })

  it.each([
    { name: "NaN minimum", min: Number.NaN },
    { name: "NaN maximum", max: Number.NaN },
    { name: "Infinity minimum", min: Infinity },
    { name: "Infinity maximum", max: Infinity },
    { name: "zero maximum", max: 0 },
    { name: "single-select minimum", min: 2, multiple: false },
    { name: "fractional minimum", min: 1.5 },
    { name: "fractional maximum", max: 1.5 },
    { name: "Infinity constraints", min: Infinity, max: Infinity },
  ])("keeps $name constraints completable", async (constraints) => {
    await renderConstraintItem(constraints)

    await choose("first")
    await click(submit())

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
  })

  it("ignores fractional max while enforcing valid min", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({ min: 2, max: 1.5 })

    expect(getWarningMessages(warn)).toContain(
      "max (1.5) must be an integer."
    )

    await choose("first")
    await click(submit())

    expect(item("answers").getAttribute("aria-invalid")).toBe("true")

    await choose("second")

    expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
  })

  it("uses the effective single-select max in its error message", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            invalid
            max={3}
            multiple={false}
            name="answers"
          >
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    expect(choiceInput("first").type).toBe("radio")
    expect(error("answers-error").textContent).toBe(
      "Select at most 1 answer to continue."
    )
  })

  it("uses the standard required message for a single-select item", async () => {
    await renderConstraintItem({ required: true })

    await click(submit())

    expect(error("answers-error").textContent).toBe(
      "Choose an answer to continue."
    )
  })

  it("enforces min and max through keyboard shortcuts", async () => {
    await renderConstraintItem({
      min: 2,
      max: 2,
      shortcuts: "letters",
    })

    await keydown(choiceInput("first"), "a")

    expect(choiceInput("first").checked).toBe(true)

    await keydown(choiceInput("second"), "b")

    expect(choiceInput("second").checked).toBe(true)

    await keydown(choiceInput("third"), "c")

    expect(choiceInput("third").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])
  })

  it("does not restore default selections beyond max", async () => {
    await renderConstraintItem({
      max: 2,
      defaultChecked: ["first", "second", "third"],
    })

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(false)

    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])

    await act(async () => {
      form().reset()
    })

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(false)
  })

  it("warns and excludes controlled selections beyond max", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    function ControlledMaxQuestionnaire() {
      const [selected, setSelected] = React.useState(["first", "second"])

      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={1}
          >
            <TestChoice
              data-testid="first"
              checked={selected.includes("first")}
              value="first"
              onChange={(event) => {
                setSelected((current) =>
                  event.target.checked
                    ? [...current, "first"]
                    : current.filter((value) => value !== "first")
                )
              }}
            >
              First
            </TestChoice>

            <TestChoice
              data-testid="second"
              checked={selected.includes("second")}
              value="second"
              onChange={(event) => {
                setSelected((current) =>
                  event.target.checked
                    ? [...current, "second"]
                    : current.filter((value) => value !== "second")
                )
              }}
            >
              Second
            </TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ControlledMaxQuestionnaire />)
    })

    await flushQuestionnaireWarnings()

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(false)
    expect(new FormData(form()).getAll("answers")).toEqual(["first"])
    expect(getWarningMessages(warn)).toContain(
      "controlled selection exceeds max"
    )
  })

  it("retries a controlled choice rejected at max after another is unchecked", async () => {
    function ControlledMaxRetryQuestionnaire() {
      const [selected, setSelected] = React.useState(["first", "second"])

      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={1}
          >
            <TestChoice
              data-testid="first"
              checked={selected.includes("first")}
              value="first"
              onChange={(event) => {
                setSelected((current) =>
                  event.target.checked
                    ? [...current, "first"]
                    : current.filter((v) => v !== "first")
                )
              }}
            >
              First
            </TestChoice>

            <TestChoice
              data-testid="second"
              checked={selected.includes("second")}
              value="second"
              onChange={(event) => {
                setSelected((current) =>
                  event.target.checked
                    ? [...current, "second"]
                    : current.filter((v) => v !== "second")
                )
              }}
            >
              Second
            </TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ControlledMaxRetryQuestionnaire />)
    })

    await flushQuestionnaireWarnings()

    // "second" is rejected at mount because "first" already occupies the slot.
    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(false)

    // Unchecking "first" via the controlled prop — parent's state drives it.
    await choose("first")

    // "second" must now be registered after the max slot opened up.
    expect(new FormData(form()).getAll("answers")).toEqual(["second"])
  })

  it("trims selections when max decreases at runtime", async () => {
    function DynamicMaxQuestionnaire() {
      const [max, setMax] = React.useState(3)

      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item data-testid="answers" max={max} name="answers">
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>
            <TestChoice data-testid="third" value="third">
              Third
            </TestChoice>
          </Questionnaire.Item>
          <TestItem required name="details" />
          <Questionnaire.Next data-testid="next" />
          <button data-testid="lower-max" type="button" onClick={() => setMax(2)}>
            Lower max
          </button>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<DynamicMaxQuestionnaire />)
    })

    await choose("first")
    await choose("second")
    await choose("third")
    await click(requiredElement<HTMLButtonElement>('[data-testid="lower-max"]'))

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(false)
    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)
    expect(new FormData(form()).getAll("answers")).toEqual(["first", "second"])

    // The item is still active before clicking next.
    expect(item("answers").hasAttribute("data-active")).toBe(true)

    await click(next())

    expect(item("details").hasAttribute("data-active")).toBe(true)
  })

  it.each([
    {
      name: "min greater than max",
      min: 4,
      max: 2,
      expected: "min (4) cannot be greater than max (2).",
    },
    {
      name: "negative min",
      min: -1,
      expected: "min (-1) cannot be negative.",
    },
    {
      name: "zero max",
      max: 0,
      expected: "max (0) must be greater than 0.",
    },
    {
      name: "fractional min",
      min: 1.5,
      expected: "min (1.5) must be an integer.",
    },
    {
      name: "fractional max",
      max: 2.5,
      expected: "max (2.5) must be an integer.",
    },
  ])("warns for invalid $name", async ({ min, max, expected }) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({ min, max })

    expect(getWarningMessages(warn)).toContain(expected)
  })

  it("warns about invalid constraints defined in Root.items", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await act(async () => {
      root.render(
        <Questionnaire.Root
          data-testid="root"
          defaultItem="answers"
          items={[
            {
              name: "answers",
              min: -1,
            },
          ]}
        />
      )
    })

    await flushQuestionnaireWarnings()

    expect(getWarningMessages(warn)).toContain(
      'Item "answers": min (-1) cannot be negative.'
    )
  })

  it("does not warn when Root.items and Item constraints match", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({
      min: 2,
      max: 3,
      rootItems: [
        {
          name: "answers",
          min: 2,
          max: 3,
        },
      ],
    })

    await flushQuestionnaireWarnings()

    const messages = getWarningMessages(warn)

    expect(messages).not.toContain("different min values")
    expect(messages).not.toContain("different max values")
    expect(messages).not.toContain("different multiple values")
    expect(messages).not.toContain("different required values")
  })

  it("warns when Root.items and Item have different resolved multiple values", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({
      multiple: true,
      rootItems: [
        {
          name: "answers",
          multiple: false,
        },
      ],
    })

    await flushQuestionnaireWarnings()

    expect(getWarningMessages(warn)).toContain(
      'Item "answers" has different multiple values in Root.items and Questionnaire.Item.'
    )
  })

  it.each([
    {
      name: "min",
      itemMin: 1,
      itemMax: 3,
      rootMin: 2,
      rootMax: 3,
      expected: "different min values",
    },
    {
      name: "max",
      itemMin: 2,
      itemMax: 2,
      rootMin: 2,
      rootMax: 3,
      expected: "different max values",
    },
  ])(
    "warns when Root.items and Item have different $name values",
    async ({ itemMin, itemMax, rootMin, rootMax, expected }) => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({
        min: itemMin,
        max: itemMax,
        rootItems: [
          {
            name: "answers",
            min: rootMin,
            max: rootMax,
          },
        ],
      })

      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain(expected)
    }
  )

  it("logs constraint warnings once when Root.items matches Item", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({
      min: 2,
      max: 1,
      rootItems: [{ name: "answers", min: 2, max: 1 }],
    })
    await flushQuestionnaireWarnings()

    expect(
      getWarningMessages(warn).match(
        /min \(2\) cannot be greater than max \(1\)/g
      )
    ).toHaveLength(1)
  })

  it("keeps a skipped controlled item skipped when max frees up", async () => {
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answer"
          onSubmit={(e) => e.preventDefault()}>
          <Questionnaire.Item data-testid="answer" name="answer" multiple max={1}>
            <TestChoice data-testid="a" checked value="a" onChange={() => {}}>A</TestChoice>
          </Questionnaire.Item>
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    })

    await click(skip())

    expect(item("answer").dataset.status).toBe("skipped")
    expect(choiceInput("a").checked).toBe(false)
  })

  it("keeps a selection when a choice is disabled and re-enabled", async () => {
    function Toggle() {
      const [disabled, setDisabled] = React.useState(false)
      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item data-testid="answers" name="answers" multiple max={2}>
            <TestChoice data-testid="first" disabled={disabled} value="first">First</TestChoice>
            <TestChoice data-testid="second" value="second">Second</TestChoice>
          </Questionnaire.Item>
          <button data-testid="toggle" type="button" onClick={() => setDisabled((v) => !v)}>t</button>
        </Questionnaire.Root>
      )
    }
    await act(async () => { root.render(<Toggle />) })

    await choose("first")
    const toggle = requiredElement<HTMLButtonElement>('[data-testid="toggle"]')
    await click(toggle)
    expect(choiceInput("first").checked).toBe(true)

    await click(toggle)
    expect(choiceInput("first").checked).toBe(true)
    expect(new FormData(form()).getAll("answers")).toEqual(["first"])
  })

  it("lets the user clear a filled freeform input that was rejected at max", async () => {
    const onInputChange = vi.fn()
    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={1}
          >
            <TestChoice data-testid="choice" defaultChecked value="choice">
              Choice
            </TestChoice>
            <Questionnaire.Input
              data-testid="freeform"
              defaultValue="x"
              onChange={onInputChange}
            />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    expect(freeform("freeform").readOnly).toBe(false)
    expect(freeform("freeform").hasAttribute("aria-disabled")).toBe(false)

    await type(freeform("freeform"), "")

    expect(onInputChange).toHaveBeenCalledOnce()
  })

  it("keeps a skipped controlled item skipped when parent changes max or multiple", async () => {
    function ControlledSkipWithDynamicProps() {
      const [max, setMax] = React.useState<number | undefined>(2)
      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={max}
          >
            <Questionnaire.Title>Answers</Questionnaire.Title>
            <TestChoice data-testid="first" checked={true} value="first">
              First
            </TestChoice>
            <Questionnaire.Input data-testid="freeform" value="typed" />
          </Questionnaire.Item>
          <Questionnaire.Skip data-testid="skip" />
          <button
            data-testid="change-max"
            type="button"
            onClick={() => setMax(3)}
          >
            Change Max
          </button>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ControlledSkipWithDynamicProps />)
    })

    expect(choiceInput("first").checked).toBe(true)
    expect(item("answers").dataset.status).toBe("answered")

    await click(skip())
    expect(item("answers").dataset.status).toBe("skipped")

    await click(requiredElement('[data-testid="change-max"]'))

    expect(item("answers").dataset.status).toBe("skipped")
  })

  it("keeps a skipped controlled item skipped when parent toggles multiple", async () => {
    function ControlledSkipWithMultipleToggle() {
      const [multiple, setMultiple] = React.useState(true)
      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple={multiple}
          >
            <Questionnaire.Title>Answers</Questionnaire.Title>
            <TestChoice data-testid="first" checked={true} value="first">
              First
            </TestChoice>
          </Questionnaire.Item>
          <Questionnaire.Skip data-testid="skip" />
          <button
            data-testid="toggle-multiple"
            type="button"
            onClick={() => setMultiple((m) => !m)}
          >
            Toggle Multiple
          </button>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ControlledSkipWithMultipleToggle />)
    })

    expect(choiceInput("first").checked).toBe(true)
    expect(item("answers").dataset.status).toBe("answered")

    await click(skip())
    expect(item("answers").dataset.status).toBe("skipped")

    await click(requiredElement('[data-testid="toggle-multiple"]'))
    expect(item("answers").dataset.status).toBe("skipped")

    await click(requiredElement('[data-testid="toggle-multiple"]'))
    expect(item("answers").dataset.status).toBe("skipped")
  })

  it("lets the user clear a rejected controlled freeform input", async () => {
    function ControlledRejectedInput() {
      const [val, setVal] = React.useState("Custom")
      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            multiple
            max={1}
          >
            <TestChoice data-testid="choice" defaultChecked value="choice">
              Choice
            </TestChoice>
            <Questionnaire.Input
              data-testid="freeform"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<ControlledRejectedInput />)
    })

    expect(choiceInput("choice").checked).toBe(true)
    expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

    expect(freeform("freeform").readOnly).toBe(false)
    expect(freeform("freeform").hasAttribute("aria-disabled")).toBe(false)

    await type(freeform("freeform"), "")
    expect(freeform("freeform").value).toBe("")
  })

  it("transitions status across min and max thresholds", async () => {
    await renderConstraintItem({ min: 2, max: 3 })

    expect(item("answers").dataset.status).toBe("unanswered")

    await choose("first")
    expect(item("answers").dataset.status).toBe("unanswered")

    await choose("second")
    expect(item("answers").dataset.status).toBe("answered")

    await choose("third")
    expect(item("answers").dataset.status).toBe("answered")

    await choose("third")
    expect(item("answers").dataset.status).toBe("answered")

    await choose("second")
    expect(item("answers").dataset.status).toBe("unanswered")
  })

  it("remains unanswered initially when min is zero and becomes answered upon selection", async () => {
    await renderConstraintItem({ min: 0 })

    expect(item("answers").dataset.status).toBe("unanswered")

    await choose("first")
    expect(item("answers").dataset.status).toBe("answered")
  })

  it("does not emit answered through onStatusChange prematurely before min selections", async () => {
    const onStatusChange = vi.fn()

    await act(async () => {
      root.render(
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item
            data-testid="answers"
            name="answers"
            min={2}
            max={3}
            onStatusChange={onStatusChange}
          >
            <Questionnaire.Title>Choose answers</Questionnaire.Title>
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            <TestChoice data-testid="second" value="second">
              Second
            </TestChoice>
            <TestChoice data-testid="third" value="third">
              Third
            </TestChoice>
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    })

    expect(onStatusChange).not.toHaveBeenCalledWith("answered")

    await choose("first")
    expect(onStatusChange).not.toHaveBeenCalledWith("answered")

    await choose("second")
    expect(onStatusChange).toHaveBeenLastCalledWith("answered")
  })

  it("handles negative min gracefully by falling back to zero and warning", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({ min: -1 })
    await flushQuestionnaireWarnings()

    expect(getWarningMessages(warn)).toContain("min (-1) cannot be negative.")
    expect(item("answers").dataset.status).toBe("unanswered")

    await choose("first")
    expect(item("answers").dataset.status).toBe("answered")
  })

  it("handles negative max gracefully by ignoring it and warning", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await renderConstraintItem({ max: -1, multiple: true })
    await flushQuestionnaireWarnings()

    expect(getWarningMessages(warn)).toContain(
      "max (-1) must be greater than 0."
    )

    await choose("first")
    await choose("second")
    await choose("third")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("third").checked).toBe(true)
  })

  describe("strict resolver policy for developer constraints", () => {
    it("ignores fractional min, warns, and leaves item optional", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({ min: 1.5 })
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain("min (1.5) must be an integer.")
      expect(choiceInput("first").type).toBe("radio")

      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    })

    it("ignores fractional max, warns, and leaves max unconstrained", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({ max: 2.5, multiple: true })
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain("max (2.5) must be an integer.")

      await choose("first")
      await choose("second")
      await choose("third")

      expect(choiceInput("first").checked).toBe(true)
      expect(choiceInput("second").checked).toBe(true)
      expect(choiceInput("third").checked).toBe(true)
    })

    it("ignores both conflicting constraints when min > max and warns", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({ min: 3, max: 2 })
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain(
        "min (3) cannot be greater than max (2)."
      )
      expect(choiceInput("first").type).toBe("radio")

      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    })

    it("ignores incompatible min when min=2 and multiple=false, warns, and stays single-choice", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({ min: 2, multiple: false })
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain(
        "multiple={false} cannot be used with min > 1 or max > 1."
      )
      expect(choiceInput("first").type).toBe("radio")
      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    })

    it("ignores incompatible max when max=2 and multiple=false, warns, and stays single-choice", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      await renderConstraintItem({ max: 2, multiple: false })
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain(
        "multiple={false} cannot be used with min > 1 or max > 1."
      )
      expect(choiceInput("first").type).toBe("radio")
    })

    it("enforces exact single selection under min=1 max=1", async () => {
      await renderConstraintItem({ min: 1, max: 1 })

      expect(choiceInput("first").type).toBe("radio")
      expect(skip().hidden).toBe(true)

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")
      expect(error("answers-error").hidden).toBe(false)

      await choose("first")
      expect(choiceInput("first").checked).toBe(true)
      expect(item("answers").dataset.status).toBe("answered")
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
      expect(error("answers-error").hidden).toBe(true)
    })

    it("limits checkboxes to at most one selection under multiple=true max=1", async () => {
      await renderConstraintItem({ multiple: true, max: 1 })

      expect(choiceInput("first").type).toBe("checkbox")
      expect(choiceInput("second").type).toBe("checkbox")

      await choose("first")
      expect(choiceInput("first").checked).toBe(true)
      expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

      await choose("second")
      expect(choiceInput("second").checked).toBe(false)

      await choose("first")
      expect(choiceInput("first").checked).toBe(false)
      expect(item("answers").hasAttribute("data-max-reached")).toBe(false)

      await choose("second")
      expect(choiceInput("second").checked).toBe(true)
    })

    it("enforces required along with min=2 max=3 constraints", async () => {
      await renderConstraintItem({ required: true, min: 2, max: 3 })

      expect(skip().hidden).toBe(true)

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")
      expect(error("answers-error").textContent).toBe(
        "Select between 2 and 3 answers to continue."
      )

      await choose("first")
      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")

      await choose("second")
      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

      await choose("third")
      expect(choiceInput("third").checked).toBe(true)

      await choose("fourth")
      expect(choiceInput("fourth").checked).toBe(false)
    })

    it("handles all choices disabled: choices cannot be selected and item remains unanswered", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item data-testid="answers" name="answers" min={2}>
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" disabled value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" disabled value="second">
                Second
              </TestChoice>
              <Questionnaire.Error data-testid="answers-error" />
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      expect(choiceInput("first").disabled).toBe(true)
      expect(choiceInput("second").disabled).toBe(true)
      expect(item("answers").dataset.status).toBe("unanswered")

      await choose("first")
      expect(choiceInput("first").checked).toBe(false)
      expect(item("answers").dataset.status).toBe("unanswered")

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")
      expect(error("answers-error").hidden).toBe(false)
    })

    it("allows additional selections when max increases dynamically", async () => {
      function DynamicMax() {
        const [max, setMax] = React.useState(1)
        return (
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              multiple
              max={max}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
            </Questionnaire.Item>
            <button
              data-testid="increase-max"
              type="button"
              onClick={() => setMax(2)}
            >
              Increase
            </button>
          </Questionnaire.Root>
        )
      }

      await act(async () => {
        root.render(<DynamicMax />)
      })

      await choose("first")
      expect(choiceInput("first").checked).toBe(true)

      await choose("second")
      expect(choiceInput("second").checked).toBe(false)

      await click(requiredElement('[data-testid="increase-max"]'))

      await choose("second")
      expect(choiceInput("second").checked).toBe(true)
    })

    it("updates status and validation when min changes dynamically", async () => {
      function DynamicMin() {
        const [min, setMin] = React.useState(1)
        return (
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              min={min}
              max={3}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
              <TestChoice data-testid="third" value="third">
                Third
              </TestChoice>
              <Questionnaire.Error data-testid="answers-error" />
            </Questionnaire.Item>
            <button
              data-testid="increase-min"
              type="button"
              onClick={() => setMin(3)}
            >
              Increase
            </button>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      }

      await act(async () => {
        root.render(<DynamicMin />)
      })

      await choose("first")
      expect(item("answers").dataset.status).toBe("answered")

      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)

      await click(requiredElement('[data-testid="increase-min"]'))

      expect(item("answers").dataset.status).toBe("unanswered")

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")
      expect(error("answers-error").hidden).toBe(false)
    })

    it("unlocks additional selections when max is removed dynamically", async () => {
      function RemoveMaxQuestionnaire() {
        const [max, setMax] = React.useState<number | undefined>(2)
        return (
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              multiple
              max={max}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
              <TestChoice data-testid="third" value="third">
                Third
              </TestChoice>
            </Questionnaire.Item>
            <button
              data-testid="remove-max"
              type="button"
              onClick={() => setMax(undefined)}
            >
              Remove Max
            </button>
          </Questionnaire.Root>
        )
      }

      await act(async () => {
        root.render(<RemoveMaxQuestionnaire />)
      })

      await choose("first")
      await choose("second")
      expect(choiceInput("first").checked).toBe(true)
      expect(choiceInput("second").checked).toBe(true)
      expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

      await choose("third")
      expect(choiceInput("third").checked).toBe(false)

      await click(requiredElement('[data-testid="remove-max"]'))

      expect(item("answers").hasAttribute("data-max-reached")).toBe(false)

      await choose("third")
      expect(choiceInput("third").checked).toBe(true)
      expect(new FormData(form()).getAll("answers")).toEqual([
        "first",
        "second",
        "third",
      ])
    })

    it("makes item optional and valid when min is removed dynamically", async () => {
      function RemoveMinQuestionnaire() {
        const [min, setMin] = React.useState<number | undefined>(2)
        return (
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              multiple
              min={min}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
              <Questionnaire.Error data-testid="answers-error" />
            </Questionnaire.Item>
            <Questionnaire.Skip data-testid="skip" />
            <button
              data-testid="remove-min"
              type="button"
              onClick={() => setMin(undefined)}
            >
              Remove Min
            </button>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      }

      await act(async () => {
        root.render(<RemoveMinQuestionnaire />)
      })

      expect(skip().hidden).toBe(true)

      await choose("first")
      expect(item("answers").dataset.status).toBe("unanswered")

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")

      await click(requiredElement('[data-testid="remove-min"]'))

      expect(item("answers").dataset.status).toBe("answered")
      expect(skip().hidden).toBe(false)

      await click(submit())
      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
    })

    it("enforces max across multiple freeform inputs", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              multiple
              max={2}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <Questionnaire.Input
                data-testid="input-one"
                aria-label="Input One"
              />
              <Questionnaire.Input
                data-testid="input-two"
                aria-label="Input Two"
              />
            </Questionnaire.Item>
          </Questionnaire.Root>
        )
      })

      await choose("first")
      expect(choiceInput("first").checked).toBe(true)

      await type(freeform("input-one"), "Hello")
      expect(freeform("input-one").value).toBe("Hello")
      expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

      expect(freeform("input-two").readOnly).toBe(true)
      expect(freeform("input-two").hasAttribute("aria-disabled")).toBe(true)

      await type(freeform("input-one"), "")
      expect(item("answers").hasAttribute("data-max-reached")).toBe(false)
      expect(freeform("input-two").readOnly).toBe(false)
    })

    it("resets validation error state on form reset", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item data-testid="answers" name="answers" min={2}>
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" value="first">
                First
              </TestChoice>
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
              <Questionnaire.Error data-testid="answers-error" />
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      await click(submit())
      expect(item("answers").getAttribute("aria-invalid")).toBe("true")
      expect(error("answers-error").hidden).toBe(false)

      await act(async () => {
        form().reset()
      })

      expect(item("answers").hasAttribute("aria-invalid")).toBe(false)
      expect(error("answers-error").hidden).toBe(true)
    })

    it("warns and excludes controlled input when selections reach max", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      function ControlledInputOverMax() {
        const [text, setText] = React.useState("")
        return (
          <Questionnaire.Root data-testid="root" defaultItem="answers">
            <Questionnaire.Item
              data-testid="answers"
              name="answers"
              multiple
              max={1}
            >
              <Questionnaire.Title>Answers</Questionnaire.Title>
              <TestChoice data-testid="first" defaultChecked value="first">
                First
              </TestChoice>
              <Questionnaire.Input
                data-testid="freeform"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Questionnaire.Item>
            <button
              data-testid="set-text"
              type="button"
              onClick={() => setText("Overflow")}
            >
              Set
            </button>
          </Questionnaire.Root>
        )
      }

      await act(async () => {
        root.render(<ControlledInputOverMax />)
      })

      expect(choiceInput("first").checked).toBe(true)
      expect(item("answers").hasAttribute("data-max-reached")).toBe(true)

      await click(requiredElement('[data-testid="set-text"]'))
      await flushQuestionnaireWarnings()

      expect(getWarningMessages(warn)).toContain(
        "blocked because the item is at max"
      )
      expect(new FormData(form()).getAll("answers")).toEqual(["first"])
    })
  })

  it("updates status and fails validation when a selected choice is removed dynamically below min", async () => {
    function DynamicRemoval() {
      const [showSecond, setShowSecond] = React.useState(true)

      return (
        <Questionnaire.Root data-testid="root" defaultItem="answers">
          <Questionnaire.Item data-testid="answers" name="answers" min={2}>
            <Questionnaire.Title>Answers</Questionnaire.Title>
            <TestChoice data-testid="first" value="first">
              First
            </TestChoice>
            {showSecond && (
              <TestChoice data-testid="second" value="second">
                Second
              </TestChoice>
            )}
            <TestChoice data-testid="third" value="third">
              Third
            </TestChoice>
            <Questionnaire.Error data-testid="answers-error" />
          </Questionnaire.Item>
          <button
            data-testid="remove-btn"
            type="button"
            onClick={() => setShowSecond(false)}
          >
            Remove second
          </button>
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    }

    await act(async () => {
      root.render(<DynamicRemoval />)
    })

    await choose("first")
    await choose("second")

    expect(choiceInput("first").checked).toBe(true)
    expect(choiceInput("second").checked).toBe(true)
    expect(item("answers").dataset.status).toBe("answered")

    const removeBtn = requiredElement<HTMLButtonElement>(
      '[data-testid="remove-btn"]'
    )
    await click(removeBtn)

    expect(item("answers").dataset.status).toBe("unanswered")

    await click(submit())
    expect(item("answers").getAttribute("aria-invalid")).toBe("true")
    expect(error("answers-error").hidden).toBe(false)
  })

  describe("legacy Item usage backward compatibility", () => {
    it("supports legacy single select item without required", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="single">
            <Questionnaire.Item data-testid="single" name="single">
              <TestChoice data-testid="a" value="a">
                A
              </TestChoice>
              <TestChoice data-testid="b" value="b">
                B
              </TestChoice>
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      expect(choiceInput("a").type).toBe("radio")
      expect(item("single").dataset.status).toBe("unanswered")

      await choose("a")
      expect(choiceInput("a").checked).toBe(true)
      expect(item("single").dataset.status).toBe("answered")

      await choose("b")
      expect(choiceInput("a").checked).toBe(false)
      expect(choiceInput("b").checked).toBe(true)
      expect(item("single").dataset.status).toBe("answered")
      expect(new FormData(form()).get("single")).toBe("b")
    })

    it("supports legacy required single select item", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="required">
            <Questionnaire.Item data-testid="required" name="required" required>
              <TestChoice data-testid="a" value="a">
                A
              </TestChoice>
              <TestChoice data-testid="b" value="b">
                B
              </TestChoice>
              <Questionnaire.Error data-testid="required-error" />
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      expect(choiceInput("a").type).toBe("radio")
      expect(item("required").dataset.status).toBe("unanswered")

      await click(submit())
      expect(item("required").getAttribute("aria-invalid")).toBe("true")
      expect(error("required-error").hidden).toBe(false)

      await choose("a")
      expect(item("required").dataset.status).toBe("answered")
      expect(item("required").hasAttribute("aria-invalid")).toBe(false)
      expect(error("required-error").hidden).toBe(true)
    })

    it("supports legacy multiple select item", async () => {
      await act(async () => {
        root.render(
          <Questionnaire.Root data-testid="root" defaultItem="multiple">
            <Questionnaire.Item data-testid="multiple" name="multiple" multiple>
              <TestChoice data-testid="a" value="a">
                A
              </TestChoice>
              <TestChoice data-testid="b" value="b">
                B
              </TestChoice>
            </Questionnaire.Item>
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      expect(choiceInput("a").type).toBe("checkbox")
      expect(choiceInput("b").type).toBe("checkbox")
      expect(item("multiple").dataset.status).toBe("unanswered")

      await choose("a")
      await choose("b")
      expect(choiceInput("a").checked).toBe(true)
      expect(choiceInput("b").checked).toBe(true)
      expect(item("multiple").dataset.status).toBe("answered")
      expect(new FormData(form()).getAll("multiple")).toEqual(["a", "b"])

      await choose("a")
      expect(choiceInput("a").checked).toBe(false)
      expect(choiceInput("b").checked).toBe(true)
      expect(item("multiple").dataset.status).toBe("answered")

      await choose("b")
      expect(choiceInput("b").checked).toBe(false)
      expect(item("multiple").dataset.status).toBe("unanswered")
    })

    it("supports legacy optional item submission and skipping", async () => {
      const onSubmit = vi.fn((e) => e.preventDefault())

      await act(async () => {
        root.render(
          <Questionnaire.Root
            data-testid="root"
            defaultItem="optional"
            onSubmit={onSubmit}
          >
            <Questionnaire.Item data-testid="optional" name="optional">
              <TestChoice data-testid="a" value="a">
                A
              </TestChoice>
              <Questionnaire.Error data-testid="optional-error" />
            </Questionnaire.Item>
            <Questionnaire.Skip data-testid="skip" />
            <Questionnaire.Submit data-testid="submit" />
          </Questionnaire.Root>
        )
      })

      expect(item("optional").dataset.status).toBe("unanswered")
      expect(skip().hidden).toBe(false)

      await click(submit())
      expect(item("optional").hasAttribute("aria-invalid")).toBe(false)
      expect(onSubmit).toHaveBeenCalled()

      await click(skip())
      expect(item("optional").dataset.status).toBe("skipped")
    })
  })
})

type RenderQuestionnaireOptions = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  onItemChange?: React.ComponentProps<typeof Questionnaire.Root>["onItemChange"]
}

type ConstraintTestOptions = {
  defaultChecked?: string[]
  max?: number
  min?: number
  multiple?: boolean
  required?: boolean
  rootItems?: React.ComponentProps<typeof Questionnaire.Root>["items"]
  shortcuts?: "letters" | "numbers"
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

async function renderConstraintItem({
  defaultChecked = [],
  max,
  min,
  multiple,
  required,
  rootItems,
  shortcuts,
}: ConstraintTestOptions = {}) {
  await act(async () => {
    root.render(
      <Questionnaire.Root
        data-testid="root"
        defaultItem="answers"
        items={rootItems}
        onSubmit={(event) => event.preventDefault()}
        shortcuts={shortcuts}
      >
        <Questionnaire.Item
          data-testid="answers"
          name="answers"
          max={max}
          min={min}
          multiple={multiple}
          required={required}
        >
          <Questionnaire.Title>Choose answers</Questionnaire.Title>

          <TestChoice
            data-testid="first"
            defaultChecked={defaultChecked.includes("first")}
            value="first"
          >
            First
          </TestChoice>

          <TestChoice
            data-testid="second"
            defaultChecked={defaultChecked.includes("second")}
            value="second"
          >
            Second
          </TestChoice>

          <TestChoice
            data-testid="third"
            defaultChecked={defaultChecked.includes("third")}
            value="third"
          >
            Third
          </TestChoice>

          <TestChoice
            data-testid="fourth"
            defaultChecked={defaultChecked.includes("fourth")}
            value="fourth"
          >
            Fourth
          </TestChoice>

          <Questionnaire.Error data-testid="answers-error" />
        </Questionnaire.Item>

        <Questionnaire.Skip data-testid="skip" />
        <Questionnaire.Next data-testid="next" />
        <Questionnaire.Submit data-testid="submit" />
      </Questionnaire.Root>
    )
  })
}

async function flushQuestionnaireWarnings() {
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  })
}

function getWarningMessages(warn: ReturnType<typeof vi.spyOn>) {
  return warn.mock.calls.map(([message]) => String(message)).join("\n")
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
