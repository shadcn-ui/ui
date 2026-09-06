import * as React from "react"
import { userEvent } from "@vitest/browser/context"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"

import { Questionnaire, type QuestionnaireItemStatus } from "."

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = false

let root: Root | null = null
let container: HTMLDivElement | null = null

afterEach(() => {
  root?.unmount()
  container?.remove()
  root = null
  container = null
  vi.restoreAllMocks()
})

test("selects a composed choice through its label row", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="answer">
      <Questionnaire.Item name="answer" required>
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="answer" value="answer">
          Answer
        </TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  const input = choiceInput("answer")

  await userEvent.click(requiredElement('[data-testid="answer"]'))
  await settle()

  expect(input.checked).toBe(true)
  expect(new FormData(form()).get("answer")).toBe("answer")
})

test("registers a ChoiceInput whenever its composed input mounts", async () => {
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

  await render(<ConditionalChoiceInputQuestionnaire />)

  const answer = requiredElement('[data-testid="answer"]')
  const choice = requiredElement('[data-testid="conditional-choice"]')
  const toggle = requiredElement('[data-testid="toggle-input"]')

  expect(answer.getAttribute("data-status")).toBe("unanswered")
  expect(choice.hasAttribute("data-shortcut")).toBe(false)

  await userEvent.click(toggle)
  await settle()

  const firstInput = requiredElement<HTMLInputElement>(
    '[data-testid="conditional-input"]'
  )

  expect(choice.getAttribute("data-shortcut")).toBe("A")

  await userEvent.click(firstInput)
  await settle()

  expect(answer.getAttribute("data-status")).toBe("answered")

  await userEvent.click(toggle)
  await settle()

  expect(answer.getAttribute("data-status")).toBe("unanswered")

  await userEvent.click(toggle)
  await settle()

  const secondInput = requiredElement<HTMLInputElement>(
    '[data-testid="conditional-input"]'
  )

  expect(secondInput).not.toBe(firstInput)
  expect(secondInput.checked).toBe(true)
  expect(answer.getAttribute("data-status")).toBe("answered")
})

test("preserves a compatible selection when multiple changes", async () => {
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

  await render(<DynamicMultipleQuestionnaire />)

  await userEvent.click(choiceInput("first-signal"))
  await userEvent.click(choiceInput("second-signal"))
  await settle()

  expect(new FormData(form()).getAll("signals")).toEqual(["first", "second"])

  await userEvent.click(requiredElement('[data-testid="toggle-multiple"]'))
  await settle()

  expect(choiceInput("first-signal").type).toBe("radio")
  expect(choiceInput("first-signal").checked).toBe(true)
  expect(choiceInput("second-signal").checked).toBe(false)
  expect(new FormData(form()).getAll("signals")).toEqual(["first"])
  expect(
    requiredElement('[data-testid="signals"]').getAttribute("data-status")
  ).toBe("answered")

  await userEvent.click(requiredElement('[data-testid="toggle-multiple"]'))
  await settle()

  expect(choiceInput("first-signal").type).toBe("checkbox")
  expect(choiceInput("first-signal").checked).toBe(true)
  expect(choiceInput("second-signal").checked).toBe(false)
})

test("renders a custom title and labels its item", async () => {
  await render(
    <Questionnaire.Root defaultItem="answer">
      <Questionnaire.Item aria-labelledby="answer-title" name="answer">
        <Questionnaire.Title
          id="answer-title"
          data-testid="answer-title"
          render={<h2 />}
        >
          Choose one
        </Questionnaire.Title>
        <TestChoice value="answer">Answer</TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  const title = requiredElement<HTMLElement>('[data-testid="answer-title"]')
  const item = requiredElement<HTMLFieldSetElement>("fieldset")

  expect(title.tagName).toBe("H2")
  expect(title.textContent).toBe("Choose one")
  expect(item.getAttribute("aria-labelledby")).toBe("answer-title")
})

test("preserves native radio and checkbox keyboard behavior", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="single">
      <Questionnaire.Item name="single" required>
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="alpha" value="alpha">
          Alpha
        </TestChoice>
        <TestChoice data-testid="beta" value="beta">
          Beta
        </TestChoice>
        <Questionnaire.Input data-testid="other" aria-label="Other answer" />
      </Questionnaire.Item>

      <Questionnaire.Item multiple name="multiple" required>
        <Questionnaire.Title>Choose several</Questionnaire.Title>
        <TestChoice data-testid="gamma" value="gamma">
          Gamma
        </TestChoice>
        <TestChoice data-testid="delta" value="delta">
          Delta
        </TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Next data-testid="next" />
    </Questionnaire.Root>
  )

  const alpha = choiceInput("alpha")
  const beta = choiceInput("beta")

  alpha.focus()
  await userEvent.keyboard("{ArrowRight}")
  await settle()

  expect(alpha.checked).toBe(false)
  expect(beta.checked).toBe(true)
  expect(new FormData(form()).get("single")).toBe("beta")
  expect(
    requiredElement('[data-testid="root"] [data-active]').textContent
  ).toContain("Choose one")

  await userEvent.keyboard("{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(
    requiredElement<HTMLInputElement>('[data-testid="other"]')
  )
  expect(beta.checked).toBe(true)

  await userEvent.keyboard("{ArrowUp}")
  await settle()

  expect(document.activeElement).toBe(beta)
  expect(beta.checked).toBe(true)

  await userEvent.keyboard("{ArrowDown}")
  await settle()
  await userEvent.keyboard("{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(alpha)
  expect(alpha.checked).toBe(true)

  const other = requiredElement<HTMLInputElement>('[data-testid="other"]')

  expect(other.id).not.toBe("")
  expect(other.hasAttribute("name")).toBe(false)

  await userEvent.type(other, "Draft")
  await userEvent.keyboard("{ArrowUp}{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(other)

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  const gamma = choiceInput("gamma")
  const delta = choiceInput("delta")

  gamma.focus()
  await userEvent.keyboard(" ")
  await settle()

  expect(gamma.checked).toBe(true)
  expect(new FormData(form()).getAll("multiple")).toEqual(["gamma"])

  await userEvent.keyboard("{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(delta)
  expect(delta.checked).toBe(false)

  await userEvent.keyboard(" ")
  await settle()

  expect(new FormData(form()).getAll("multiple")).toEqual(["gamma", "delta"])
})

test("moves between items with contextual horizontal arrows", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="first">
      <Questionnaire.Item data-testid="first" name="first" required>
        <Questionnaire.Title>First question</Questionnaire.Title>
        <TestChoice data-testid="first-answer" value="first-answer">
          First answer
        </TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="second" name="second" required>
        <Questionnaire.Title>Second question</Questionnaire.Title>
        <Questionnaire.Input
          data-testid="second-answer"
          aria-label="Second answer"
        />
      </Questionnaire.Item>

      <Questionnaire.Previous />
      <Questionnaire.Next />
    </Questionnaire.Root>
  )

  const first = requiredElement<HTMLFieldSetElement>('[data-testid="first"]')
  const second = requiredElement<HTMLFieldSetElement>('[data-testid="second"]')

  first.focus()
  await userEvent.keyboard("{ArrowRight}")
  await settle()

  expect(first.hasAttribute("data-active")).toBe(true)

  await userEvent.click(choiceInput("first-answer"))
  first.focus()
  await userEvent.keyboard("{ArrowRight}")
  await settle()

  expect(second.hasAttribute("data-active")).toBe(true)
  expect(document.activeElement).toBe(second)

  const secondAnswer = requiredElement<HTMLInputElement>(
    '[data-testid="second-answer"]'
  )

  await userEvent.keyboard("{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(secondAnswer)

  await userEvent.type(secondAnswer, "Draft")
  await userEvent.keyboard("{ArrowLeft}")
  await settle()

  expect(second.hasAttribute("data-active")).toBe(true)

  second.focus()
  await userEvent.keyboard("{ArrowLeft}")
  await settle()

  expect(first.hasAttribute("data-active")).toBe(true)
  expect(document.activeElement).toBe(first)
})

test("keeps native arrow behavior for number inputs", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="rounds">
      <Questionnaire.Item name="rounds" required>
        <Questionnaire.Title>Review rounds</Questionnaire.Title>
        <TestChoice data-testid="unlimited" value="unlimited">
          No limit
        </TestChoice>
        <Questionnaire.Input
          data-testid="round-count"
          aria-label="Round count"
          min={1}
          type="number"
        />
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  const roundCount = requiredElement<HTMLInputElement>(
    '[data-testid="round-count"]'
  )

  await userEvent.click(roundCount)
  await userEvent.keyboard("{ArrowUp}")
  await settle()

  expect(document.activeElement).toBe(roundCount)
})

test("does not count disabled controls as answers", async () => {
  function AvailabilityQuestionnaire() {
    const [disabled, setDisabled] = React.useState(false)

    return (
      <Questionnaire.Root data-testid="root" defaultItem="answers">
        <Questionnaire.Item
          data-testid="answers"
          multiple
          required
          name="answers"
        >
          <Questionnaire.Title>Choose answers</Questionnaire.Title>
          <TestChoice
            data-testid="fixed"
            defaultChecked
            disabled={disabled}
            value="fixed"
          >
            Fixed
          </TestChoice>
          <Questionnaire.Input
            data-testid="custom"
            aria-label="Custom answer"
            defaultValue="Custom"
            disabled={disabled}
          />
          <Questionnaire.Error data-testid="error" />
        </Questionnaire.Item>
        <Questionnaire.Submit data-testid="submit" />
        <button
          data-testid="toggle"
          type="button"
          onClick={() => setDisabled((current) => !current)}
        >
          Toggle answers
        </button>
      </Questionnaire.Root>
    )
  }

  await render(<AvailabilityQuestionnaire />)

  const answers = requiredElement('[data-testid="answers"]')
  const submit = requiredElement<HTMLButtonElement>('[data-testid="submit"]')

  expect(answers.getAttribute("data-status")).toBe("answered")
  expect(new FormData(form()).getAll("answers")).toEqual(["fixed", "Custom"])
  expect(submit.disabled).toBe(false)

  await userEvent.click(requiredElement('[data-testid="toggle"]'))
  await settle()

  expect(answers.getAttribute("data-status")).toBe("unanswered")
  expect(new FormData(form()).getAll("answers")).toEqual([])
  expect(submit.disabled).toBe(false)

  await userEvent.click(submit)
  await settle()

  expect(requiredElement('[data-testid="error"]').hidden).toBe(false)
  expect(document.activeElement).toBe(answers)

  await userEvent.click(requiredElement('[data-testid="toggle"]'))
  await settle()

  expect(answers.getAttribute("data-status")).toBe("answered")
  expect(new FormData(form()).getAll("answers")).toEqual(["fixed", "Custom"])
  expect(submit.disabled).toBe(false)
  expect(requiredElement('[data-testid="error"]').hidden).toBe(true)
})

test("selects answers with scoped shortcuts and confirms with Enter", async () => {
  let submittedValue: FormDataEntryValue | null = null

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="single"
      shortcuts="letters"
      onSubmit={(event) => {
        event.preventDefault()
        submittedValue = new FormData(event.currentTarget).get("detail")
      }}
    >
      <Questionnaire.Item name="single" required>
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="alpha" value="alpha">
          Alpha
        </TestChoice>
        <TestChoice data-testid="beta" value="beta">
          Beta
        </TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Item name="detail" required>
        <Questionnaire.Title>Add detail</Questionnaire.Title>
        <TestChoice data-testid="brief" value="brief">
          Keep it brief
        </TestChoice>
        <Questionnaire.Input
          data-testid="detail-input"
          aria-label="Other detail"
        />
      </Questionnaire.Item>

      <Questionnaire.Next />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )

  const alpha = choiceInput("alpha")
  const beta = choiceInput("beta")
  const betaShortcut = requiredElement<HTMLElement>(
    '[data-testid="beta"] span[data-shortcut="B"]'
  )

  expect(betaShortcut.textContent).toBe("B")
  expect(betaShortcut.getAttribute("aria-hidden")).toBe("true")

  alpha.focus()
  await userEvent.keyboard("b")
  await settle()

  expect(beta.checked).toBe(true)
  expect(document.activeElement).toBe(beta)

  await userEvent.keyboard("{Enter}")
  await settle()

  const detailInput = requiredElement<HTMLInputElement>(
    '[data-testid="detail-input"]'
  )

  expect(detailInput.hasAttribute("data-shortcut")).toBe(false)

  await userEvent.keyboard("{ArrowDown}{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(detailInput)
  expect(detailInput.value).toBe("")

  await userEvent.type(detailInput, "Custom detail")
  await userEvent.keyboard("{Enter}")
  await settle()

  expect(submittedValue).toBe("Custom detail")
})

test("uses definition order for shortcut activation", async () => {
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="answer"
      items={[
        {
          choices: [{ value: "second" }, { value: "first" }],
          name: "answer",
        },
      ]}
      shortcuts="letters"
    >
      <Questionnaire.Item data-testid="answer" name="answer">
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="first" value="first">
          First
        </TestChoice>
        <TestChoice data-testid="second" value="second">
          Second
        </TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  expect(requiredElement('[data-testid="first"]').dataset.shortcut).toBe("B")
  expect(requiredElement('[data-testid="second"]').dataset.shortcut).toBe("A")

  requiredElement<HTMLElement>('[data-testid="answer"]').focus()
  await userEvent.keyboard("a")
  await settle()

  expect(choiceInput("second").checked).toBe(true)
  expect(choiceInput("first").checked).toBe(false)
  expect(consoleWarn).toHaveBeenCalledWith(
    expect.stringContaining(
      'Choice order for item "answer" differs between Root.items'
    )
  )
})

test("keeps vertical answer navigation in DOM order with definitions", async () => {
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})

  await render(
    <Questionnaire.Root
      data-testid="root"
      items={[
        {
          choices: [{ value: "second" }, { value: "first" }],
          name: "answer",
        },
      ]}
      shortcuts="letters"
    >
      <Questionnaire.Item data-testid="answer" name="answer">
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="first" value="first">
          First
        </TestChoice>
        <Questionnaire.Input data-testid="other" aria-label="Other answer" />
        <TestChoice data-testid="second" value="second">
          Second
        </TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  choiceInput("first").focus()
  await userEvent.keyboard("{ArrowDown}")
  await settle()

  const other = requiredElement<HTMLInputElement>('[data-testid="other"]')

  expect(document.activeElement).toBe(other)
  expect(choiceInput("first").checked).toBe(false)

  await userEvent.keyboard("{ArrowDown}")
  await settle()

  expect(document.activeElement).toBe(choiceInput("second"))
  expect(choiceInput("second").checked).toBe(true)
  expect(consoleWarn).toHaveBeenCalledWith(
    expect.stringContaining(
      'Choice order for item "answer" differs between Root.items'
    )
  )
})

test("validates, advances, and submits with Command or Control plus Enter", async () => {
  let submitCount = 0

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="first"
      onSubmit={(event) => {
        event.preventDefault()
        submitCount += 1
      }}
    >
      <Questionnaire.Item data-testid="first" name="first" required>
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="first-answer" value="first-answer">
          First answer
        </TestChoice>
        <Questionnaire.Input
          data-testid="first-input"
          aria-label="Other first answer"
        />
        <Questionnaire.Error data-testid="first-error" />
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="second" name="second" required>
        <Questionnaire.Title>Choose another</Questionnaire.Title>
        <TestChoice data-testid="second-answer" value="second-answer">
          Second answer
        </TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Next />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )

  const firstInput = requiredElement<HTMLInputElement>(
    '[data-testid="first-input"]'
  )

  firstInput.focus()
  firstInput.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      metaKey: true,
    })
  )
  await settle()

  expect(requiredElement('[data-testid="first"]').hidden).toBe(false)
  expect(requiredElement('[data-testid="first-error"]').hidden).toBe(false)
  expect(document.activeElement).toBe(choiceInput("first-answer"))

  await userEvent.click(choiceInput("first-answer"))
  firstInput.focus()
  firstInput.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      metaKey: true,
    })
  )
  await settle()

  const second = requiredElement('[data-testid="second"]')

  expect(second.hidden).toBe(false)
  expect(document.activeElement).toBe(second)

  await userEvent.click(choiceInput("second-answer"))
  second.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      key: "Enter",
    })
  )
  await settle()

  expect(submitCount).toBe(1)
})

test("toggles multiple answers with scoped shortcuts", async () => {
  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="answers"
      shortcuts="numbers"
    >
      <Questionnaire.Item multiple name="answers" required>
        <Questionnaire.Title>Choose several</Questionnaire.Title>
        <TestChoice data-testid="alpha" value="alpha">
          Alpha
        </TestChoice>
        <TestChoice data-testid="beta" value="beta">
          Beta
        </TestChoice>
      </Questionnaire.Item>
    </Questionnaire.Root>
  )

  const alpha = choiceInput("alpha")
  const beta = choiceInput("beta")

  alpha.focus()
  await userEvent.keyboard("2")
  await settle()

  expect(document.activeElement).toBe(beta)
  expect(beta.checked).toBe(true)
  expect(new FormData(form()).getAll("answers")).toEqual(["beta"])

  await userEvent.keyboard("2")
  await settle()

  expect(beta.checked).toBe(false)
  expect(new FormData(form()).getAll("answers")).toEqual([])

  await userEvent.keyboard("1")
  await settle()

  expect(document.activeElement).toBe(alpha)
  expect(alpha.checked).toBe(true)
  expect(new FormData(form()).getAll("answers")).toEqual(["alpha"])
})

test("does not implicitly submit from an unselected answer", async () => {
  let submitCount = 0

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="answer"
      onSubmit={(event) => {
        event.preventDefault()
        submitCount += 1
      }}
    >
      <Questionnaire.Item name="answer" required>
        <Questionnaire.Title>Choose one</Questionnaire.Title>
        <TestChoice data-testid="alpha" value="alpha">
          Alpha
        </TestChoice>
        <TestChoice data-testid="beta" value="beta">
          Beta
        </TestChoice>
        <Questionnaire.Input data-testid="other" aria-label="Other answer" />
      </Questionnaire.Item>
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )

  const alpha = choiceInput("alpha")
  const beta = choiceInput("beta")
  const other = requiredElement<HTMLInputElement>('[data-testid="other"]')

  await userEvent.click(alpha)
  beta.focus()
  await userEvent.keyboard("{Enter}")
  await settle()

  expect(submitCount).toBe(0)

  await userEvent.type(other, "Preserved draft")
  await userEvent.click(alpha)
  other.focus()
  await userEvent.keyboard("{Enter}")
  await settle()

  expect(submitCount).toBe(0)

  alpha.focus()
  await userEvent.keyboard("{Enter}")
  await settle()

  expect(submitCount).toBe(1)
})

test("keeps controlled, skipped, and native form state aligned", async () => {
  function StateQuestionnaire() {
    const [controlledValue] = React.useState("")
    const [skippedValue, setSkippedValue] = React.useState<string | null>("")

    return (
      <>
        <Questionnaire.Root data-testid="controlled-root">
          <Questionnaire.Item
            data-testid="controlled-item"
            required
            name="controlled"
          >
            <Questionnaire.Title>Controlled answer</Questionnaire.Title>
            <Questionnaire.Input
              data-testid="controlled-input"
              aria-label="Controlled answer"
              value={controlledValue}
              onChange={() => {}}
            />
          </Questionnaire.Item>
          <Questionnaire.Submit data-testid="controlled-submit" />
        </Questionnaire.Root>

        <Questionnaire.Root
          data-testid="skip-root"
          onSubmit={(event) => {
            event.preventDefault()
            setSkippedValue(
              new FormData(event.currentTarget).get("skipped")?.toString() ??
                null
            )
          }}
        >
          <Questionnaire.Item data-testid="skip-item" name="skipped">
            <Questionnaire.Title>Skippable answer</Questionnaire.Title>
            <TestChoice
              data-testid="controlled-choice"
              checked
              value="kept"
              onChange={() => {}}
            >
              Kept
            </TestChoice>
          </Questionnaire.Item>
          <Questionnaire.Skip data-testid="skip" />
          <Questionnaire.Submit />
        </Questionnaire.Root>

        <output data-testid="skipped-value">
          {skippedValue === null ? "empty" : skippedValue}
        </output>
      </>
    )
  }

  await render(<StateQuestionnaire />)

  const controlledInput = requiredElement<HTMLInputElement>(
    '[data-testid="controlled-input"]'
  )

  await userEvent.type(controlledInput, "Rejected")
  await settle()

  expect(controlledInput.value).toBe("")
  expect(
    requiredElement('[data-testid="controlled-item"]').getAttribute(
      "data-status"
    )
  ).toBe("unanswered")
  expect(
    requiredElement<HTMLButtonElement>('[data-testid="controlled-submit"]')
      .disabled
  ).toBe(false)

  await userEvent.click(requiredElement('[data-testid="skip"]'))
  await settle()

  const controlledChoice = choiceInput("controlled-choice")

  expect(controlledChoice.checked).toBe(false)
  expect(controlledChoice.id).not.toBe("")
  expect(controlledChoice.hasAttribute("name")).toBe(false)
  expect(
    requiredElement('[data-testid="skip-item"]').getAttribute("data-status")
  ).toBe("skipped")
  expect(requiredElement('[data-testid="skipped-value"]').textContent).toBe(
    "empty"
  )
})

test("returns to and blocks an externally invalid item", async () => {
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

  await render(<ExternallyValidatedQuestionnaire />)

  await userEvent.click(choiceInput("first-choice"))
  await userEvent.click(requiredElement('[data-testid="next"]'))
  await userEvent.click(choiceInput("second-choice"))
  await userEvent.click(requiredElement('[data-testid="submit"]'))
  await settle()

  const first = requiredElement('[data-testid="first"]')
  const firstError = requiredElement('[data-testid="first-error"]')

  expect(first.hidden).toBe(false)
  expect(first.getAttribute("data-status")).toBe("answered")
  expect(first.getAttribute("aria-invalid")).toBe("true")
  expect(first.getAttribute("aria-describedby")).toContain("first-error")
  expect(choiceInput("first-choice").getAttribute("aria-invalid")).toBe("true")
  expect(firstError.hidden).toBe(false)
  expect(firstError.getAttribute("role")).toBe("alert")
  expect(document.activeElement).toBe(first)

  first.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      metaKey: true,
    })
  )
  await settle()

  expect(first.hidden).toBe(false)
  expect(document.activeElement).toBe(choiceInput("first-choice"))

  first.focus()
  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(first.hidden).toBe(false)
  expect(document.activeElement).toBe(choiceInput("first-choice"))

  await userEvent.click(choiceInput("first-alternative"))
  await settle()

  expect(first.hasAttribute("aria-invalid")).toBe(false)
  expect(firstError.hidden).toBe(true)

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(requiredElement('[data-testid="second"]').hidden).toBe(false)
})

test("treats an intentional skip as valid for an optional external error", async () => {
  await render(
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
      <Questionnaire.Item data-testid="required" name="required" required>
        <Questionnaire.Title>Required</Questionnaire.Title>
        <TestChoice data-testid="required-choice" value="required">
          Required answer
        </TestChoice>
      </Questionnaire.Item>
      <Questionnaire.Previous data-testid="previous" />
      <Questionnaire.Skip data-testid="skip" />
      <Questionnaire.Next data-testid="next" />
    </Questionnaire.Root>
  )

  const optional = requiredElement('[data-testid="optional"]')
  const optionalError = requiredElement<HTMLParagraphElement>(
    '[data-testid="optional-error"]'
  )

  expect(optional.getAttribute("aria-invalid")).toBe("true")

  await userEvent.click(requiredElement('[data-testid="skip"]'))
  await settle()

  expect(
    requiredElement('[data-testid="required"]').hasAttribute("data-active")
  ).toBe(true)

  await userEvent.click(requiredElement('[data-testid="previous"]'))
  await settle()

  expect(optional.getAttribute("data-status")).toBe("skipped")
  expect(optional.hasAttribute("aria-invalid")).toBe(false)
  expect(optionalError.hidden).toBe(true)

  await userEvent.click(choiceInput("optional-choice"))
  await settle()

  expect(optional.getAttribute("data-status")).toBe("answered")
  expect(optional.getAttribute("aria-invalid")).toBe("true")

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(optional.hasAttribute("data-active")).toBe(true)
  expect(document.activeElement).toBe(choiceInput("optional-choice"))
})

test("allows a freeform answer with native validation enabled", async () => {
  let submittedValue: FormDataEntryValue | null = null

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="answer"
      noValidate={false}
      onSubmit={(event) => {
        event.preventDefault()
        submittedValue = new FormData(event.currentTarget).get("answer")
      }}
    >
      <Questionnaire.Item name="answer" required>
        <Questionnaire.Title>Choose or type</Questionnaire.Title>
        <TestChoice data-testid="fixed" value="fixed">
          Fixed
        </TestChoice>
        <Questionnaire.Input data-testid="other" aria-label="Other answer" />
      </Questionnaire.Item>
      <Questionnaire.Submit data-testid="submit" />
    </Questionnaire.Root>
  )

  const fixed = choiceInput("fixed")
  const other = requiredElement<HTMLInputElement>('[data-testid="other"]')

  expect(fixed.required).toBe(false)

  await userEvent.type(other, "Freeform")
  await userEvent.click(requiredElement('[data-testid="submit"]'))
  await settle()

  expect(fixed.validity.valid).toBe(true)
  expect(submittedValue).toBe("Freeform")
})

test("validates selected native controls without validating unselected drafts", async () => {
  let submittedValue: FormDataEntryValue | null = null

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="contact"
      noValidate={false}
      onSubmit={(event) => {
        event.preventDefault()
        submittedValue = new FormData(event.currentTarget).get("contact")
      }}
    >
      <Questionnaire.Item data-testid="contact" name="contact" required>
        <Questionnaire.Title>How should we contact you?</Questionnaire.Title>
        <TestChoice data-testid="fixed-contact" value="fixed">
          Use the saved address
        </TestChoice>
        <Questionnaire.Input
          data-testid="contact-input"
          aria-label="Another email"
          type="email"
        />
      </Questionnaire.Item>
      <Questionnaire.Item
        data-testid="confirmation"
        name="confirmation"
        required
      >
        <Questionnaire.Title>Confirm</Questionnaire.Title>
        <TestChoice data-testid="confirm" value="confirmed">
          Confirmed
        </TestChoice>
      </Questionnaire.Item>
      <Questionnaire.Next data-testid="next" />
      <Questionnaire.Submit data-testid="submit" />
    </Questionnaire.Root>
  )

  const contact = requiredElement('[data-testid="contact"]')
  const input = requiredElement<HTMLInputElement>(
    '[data-testid="contact-input"]'
  )

  expect(input.form).toBeNull()

  await userEvent.type(input, "not-an-email")
  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(contact.hasAttribute("data-active")).toBe(true)
  expect(input.validity.valid).toBe(false)
  expect(document.activeElement).toBe(input)

  await userEvent.click(choiceInput("fixed-contact"))
  await settle()

  expect(input.value).toBe("not-an-email")
  expect(input.hasAttribute("name")).toBe(false)
  expect(input.form).toBeNull()

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(
    requiredElement('[data-testid="confirmation"]').hasAttribute("data-active")
  ).toBe(true)

  await userEvent.click(choiceInput("confirm"))
  await userEvent.click(requiredElement('[data-testid="submit"]'))
  await settle()

  expect(submittedValue).toBe("fixed")
})

test("does not confirm a freeform answer while an IME composition is active", async () => {
  let submitCount = 0

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="detail"
      shortcuts="numbers"
      onSubmit={(event) => {
        event.preventDefault()
        submitCount += 1
      }}
    >
      <Questionnaire.Item name="detail" required>
        <Questionnaire.Title>Add detail</Questionnaire.Title>
        <Questionnaire.Input
          data-testid="detail-input"
          aria-label="Other detail"
        />
      </Questionnaire.Item>
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )

  const detailInput = requiredElement<HTMLInputElement>(
    '[data-testid="detail-input"]'
  )

  await userEvent.type(detailInput, "入力")
  detailInput.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      isComposing: true,
      key: "Enter",
    })
  )
  await settle()

  expect(submitCount).toBe(0)
})

test("moves focus on validation and navigation", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="first">
      <Questionnaire.Item data-testid="first" name="first" required>
        <Questionnaire.Title>First</Questionnaire.Title>
        <TestChoice data-testid="first-answer" value="first-answer">
          First answer
        </TestChoice>
        <Questionnaire.Error />
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="second" name="second" required>
        <Questionnaire.Title>Second</Questionnaire.Title>
        <TestChoice data-testid="second-answer" value="second-answer">
          Second answer
        </TestChoice>
        <Questionnaire.Error />
      </Questionnaire.Item>

      <Questionnaire.Next data-testid="next" />
      <Questionnaire.Submit data-testid="submit" />
    </Questionnaire.Root>
  )

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  expect(document.activeElement).toBe(choiceInput("first-answer"))

  await userEvent.click(choiceInput("first-answer"))
  await userEvent.click(requiredElement('[data-testid="next"]'))
  await settle()

  const second = requiredElement('[data-testid="second"]')

  expect(second.hasAttribute("data-active")).toBe(true)
  expect(document.activeElement).toBe(second)

  await userEvent.click(requiredElement('[data-testid="submit"]'))
  await settle()

  expect(document.activeElement).toBe(choiceInput("second-answer"))
})

test("submits an intentional final skip through the native form", async () => {
  let status: QuestionnaireItemStatus = "unanswered"
  let submittedStatus: QuestionnaireItemStatus | null = null
  let submittedValues: FormDataEntryValue[] | null = null

  await render(
    <Questionnaire.Root
      data-testid="root"
      defaultItem="timing"
      onSubmit={(event) => {
        event.preventDefault()
        submittedStatus = status
        submittedValues = new FormData(event.currentTarget).getAll("timing")
      }}
    >
      <Questionnaire.Item
        name="timing"
        onStatusChange={(nextStatus) => {
          status = nextStatus
        }}
      >
        <Questionnaire.Title>When?</Questionnaire.Title>
        <TestChoice value="today">Today</TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Skip data-testid="skip" />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )

  await userEvent.click(requiredElement('[data-testid="skip"]'))
  await settle()

  expect(submittedStatus).toBe("skipped")
  expect(submittedValues).toEqual([])
})

test("preserves inactive answers and restores native defaults on reset", async () => {
  await render(
    <Questionnaire.Root data-testid="root" defaultItem="channel">
      <Questionnaire.Item data-testid="channel" name="channel" required>
        <Questionnaire.Title>Channel</Questionnaire.Title>
        <TestChoice data-testid="email" defaultChecked value="email">
          Email
        </TestChoice>
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="detail" multiple name="detail" required>
        <Questionnaire.Title>Detail</Questionnaire.Title>
        <Questionnaire.Input
          data-testid="detail-input"
          aria-label="Detail"
          defaultValue="Default detail"
        />
        <Questionnaire.Input
          data-testid="controlled-detail-input"
          aria-label="Controlled detail"
          readOnly
          value="Controlled detail"
        />
      </Questionnaire.Item>

      <Questionnaire.Previous data-testid="previous" />
      <Questionnaire.Next data-testid="next" />
      <button data-testid="reset" type="reset">
        Reset
      </button>
    </Questionnaire.Root>
  )

  await userEvent.click(requiredElement('[data-testid="next"]'))
  await userEvent.clear(requiredElement('[data-testid="detail-input"]'))
  await userEvent.type(
    requiredElement('[data-testid="detail-input"]'),
    "Custom detail"
  )
  await userEvent.click(requiredElement('[data-testid="previous"]'))
  await settle()

  expect(new FormData(form()).get("channel")).toBe("email")
  expect(new FormData(form()).get("detail")).toBe("Custom detail")

  await userEvent.click(requiredElement('[data-testid="reset"]'))
  await settle()

  expect(requiredElement('[data-testid="channel"]').hidden).toBe(false)
  expect(requiredElement('[data-testid="detail"]').hidden).toBe(true)
  expect(choiceInput("email").checked).toBe(true)
  expect(
    requiredElement<HTMLInputElement>('[data-testid="detail-input"]').value
  ).toBe("Default detail")
  expect(
    requiredElement<HTMLInputElement>('[data-testid="controlled-detail-input"]')
      .value
  ).toBe("Controlled detail")
})

async function render(children: React.ReactNode) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)

  flushSync(() => {
    root!.render(children)
  })

  await settle()
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

function choiceInput(testId: string) {
  return requiredElement<HTMLInputElement>(`[data-testid="${testId}"] input`)
}

function requiredElement<T extends Element = HTMLElement>(selector: string) {
  const element = container?.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing test element: ${selector}`)
  }

  return element
}

function settle(frames = 2) {
  return new Promise<void>((resolve) => {
    let remaining = frames

    function nextFrame() {
      if (remaining-- <= 0) {
        resolve()
        return
      }

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  })
}
