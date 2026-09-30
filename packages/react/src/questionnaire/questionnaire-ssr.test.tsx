// @vitest-environment jsdom

import * as React from "react"
import { act } from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Questionnaire } from "."
import type { QuestionnaireItemDefinition } from "./types"

const items = [
  {
    choices: [
      { value: "delegation" },
      { disabled: true, value: "automatic" },
      { value: "questions" },
    ],
    name: "scope",
    required: true,
  },
  {
    choices: [{ value: "ignored" }],
    disabled: true,
    name: "disabled",
  },
  {
    choices: [{ value: "focused" }, { value: "complete" }],
    name: "detail",
  },
] as const satisfies readonly QuestionnaireItemDefinition[]

let container: HTMLDivElement
let root: Root | null

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean
    }
  ).IS_REACT_ACT_ENVIRONMENT = true

  container = document.createElement("div")
  document.body.appendChild(container)
  root = null
})

afterEach(async () => {
  if (root) {
    await act(async () => {
      root?.unmount()
    })
  }

  container.remove()
  vi.restoreAllMocks()
})

describe("Questionnaire server rendering", () => {
  it("renders collection progress, active item, actions, and shortcuts", () => {
    renderServerQuestionnaire()

    expect(form().dataset.current).toBe("1")
    expect(form().dataset.total).toBe("2")
    expect(form().hasAttribute("data-first")).toBe(true)
    expect(progress().textContent).toBe("Question 1 of 2")
    expect(progress().getAttribute("aria-valuenow")).toBe("1")
    expect(progress().getAttribute("aria-valuemax")).toBe("2")
    expect(item("scope").hasAttribute("data-active")).toBe(true)
    expect(item("scope").hidden).toBe(false)
    expect(item("disabled").hidden).toBe(true)
    expect(item("detail").hidden).toBe(true)
    expect(action("previous").hidden).toBe(true)
    expect(action("skip").hidden).toBe(true)
    expect(action("next").hidden).toBe(false)
    expect(action("next").dataset.status).toBe("unanswered")
    expect(action("submit").hidden).toBe(true)
    expect(choice("delegation").dataset.shortcut).toBe("A")
    expect(choiceInput("delegation").getAttribute("aria-keyshortcuts")).toBe(
      "A"
    )
    expect(choice("automatic").hasAttribute("data-shortcut")).toBe(false)
    expect(shortcut("automatic").hidden).toBe(true)
    expect(choice("questions").dataset.shortcut).toBe("B")
  })

  it("renders a requested optional item and its applicable actions", () => {
    renderServerQuestionnaire({ defaultItem: "detail" })

    expect(form().dataset.current).toBe("2")
    expect(form().hasAttribute("data-last")).toBe(true)
    expect(progress().textContent).toBe("Question 2 of 2")
    expect(item("scope").hidden).toBe(true)
    expect(item("detail").hasAttribute("data-active")).toBe(true)
    expect(action("previous").hidden).toBe(false)
    expect(action("skip").hidden).toBe(false)
    expect(action("next").hidden).toBe(true)
    expect(action("submit").hidden).toBe(false)
  })

  it("renders a controlled item from the collection", () => {
    renderMarkup(<TestQuestionnaire item="detail" />)

    expect(progress().textContent).toBe("Question 2 of 2")
    expect(item("scope").hidden).toBe(true)
    expect(item("detail").hasAttribute("data-active")).toBe(true)
  })

  it.each(["missing", "disabled"])(
    "falls back from an invalid default item %s during render",
    (defaultItem) => {
      renderServerQuestionnaire({ defaultItem })

      expect(progress().textContent).toBe("Question 1 of 2")
      expect(item("scope").hasAttribute("data-active")).toBe(true)
      expect(item("detail").hidden).toBe(true)
    }
  )

  it("renders numeric shortcuts and leaves overflow choices unassigned", () => {
    const choices = Array.from({ length: 10 }, (_, index) => ({
      value: `choice-${index + 1}`,
    }))
    const numericItems = [{ choices, name: "numeric" }]

    renderMarkup(
      <Questionnaire.Root items={numericItems} shortcuts="numbers">
        <Questionnaire.Item name="numeric">
          <Questionnaire.Title>Choose a number</Questionnaire.Title>
          {choices.map((choice) => (
            <TestChoice key={choice.value} value={choice.value} />
          ))}
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    expect(choice("choice-1").dataset.shortcut).toBe("1")
    expect(choice("choice-9").dataset.shortcut).toBe("9")
    expect(choice("choice-10").hasAttribute("data-shortcut")).toBe(false)
  })

  it("renders an input-only item without fixed-choice definitions", () => {
    renderMarkup(
      <Questionnaire.Root items={[{ name: "input" }]}>
        <Questionnaire.Progress data-testid="progress" />
        <Questionnaire.Item data-testid="input" name="input">
          <Questionnaire.Title>Describe the result</Questionnaire.Title>
          <Questionnaire.Input
            data-testid="input-control"
            aria-label="Result"
          />
        </Questionnaire.Item>
        <Questionnaire.Submit data-testid="submit" />
      </Questionnaire.Root>
    )

    expect(progress().textContent).toBe("Question 1 of 1")
    expect(item("input").hasAttribute("data-active")).toBe(true)
    expect(query<HTMLInputElement>("input-control").type).toBe("text")
    expect(action("submit").hidden).toBe(false)
  })

  it("renders both navigation directions for a middle item", () => {
    const middleItems = [
      { name: "first" },
      { name: "middle" },
      { name: "last" },
    ]

    renderMarkup(
      <Questionnaire.Root defaultItem="middle" items={middleItems}>
        <Questionnaire.Progress data-testid="progress" />
        {middleItems.map((definition) => (
          <Questionnaire.Item
            key={definition.name}
            data-testid={definition.name}
            name={definition.name}
          >
            <Questionnaire.Title>{definition.name}</Questionnaire.Title>
          </Questionnaire.Item>
        ))}
        <Questionnaire.Previous data-testid="previous" />
        <Questionnaire.Next data-testid="next" />
        <Questionnaire.Submit data-testid="submit" />
      </Questionnaire.Root>
    )

    expect(progress().textContent).toBe("Question 2 of 3")
    expect(action("previous").hidden).toBe(false)
    expect(action("next").hidden).toBe(false)
    expect(action("submit").hidden).toBe(true)
  })

  it("pins the current defaultChecked server-rendering limitation", () => {
    const defaultItems = [{ choices: [{ value: "default" }], name: "answer" }]

    renderMarkup(
      <Questionnaire.Root items={defaultItems}>
        <Questionnaire.Item name="answer">
          <TestChoice defaultChecked value="default" />
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    expect(choiceInput("default").checked).toBe(false)
    expect(choice("default").hasAttribute("data-checked")).toBe(false)
  })
})

describe("Questionnaire hydration", () => {
  it("hydrates without changing collection-derived output", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const onRecoverableError = vi.fn()
    const questionnaire = <TestQuestionnaire />

    renderMarkup(questionnaire)
    const initialMarkup = {
      actions: actionsMarkup(),
      progress: progress().outerHTML,
      root: form().outerHTML.match(/<form[^>]*>/)?.[0],
    }

    await act(async () => {
      root = hydrateRoot(container, questionnaire, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleWarn).not.toHaveBeenCalled()
    expect(progress().outerHTML).toBe(initialMarkup.progress)
    expect(actionsMarkup()).toBe(initialMarkup.actions)
    expect(form().outerHTML.match(/<form[^>]*>/)?.[0]).toBe(initialMarkup.root)
  })

  it("warns after falling back from an invalid default item", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const questionnaire = <TestQuestionnaire defaultItem="missing" />

    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(progress().textContent).toBe("Question 1 of 2")
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'defaultItem "missing" does not identify an enabled item'
      )
    )
  })

  it("joins logical navigation to matching runtime items", async () => {
    const questionnaire = <TestQuestionnaire />

    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    await act(async () => {
      choiceInput("delegation").click()
    })

    await act(async () => {
      action("next").click()
    })

    expect(progress().textContent).toBe("Question 2 of 2")
    expect(item("scope").hidden).toBe(true)
    expect(item("detail").hasAttribute("data-active")).toBe(true)
  })

  it("keeps definition shortcut order authoritative after hydration", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const orderedItems = [
      {
        choices: [{ value: "second" }, { value: "first" }],
        name: "order",
      },
    ]
    const questionnaire = (
      <Questionnaire.Root items={orderedItems} shortcuts="letters">
        <Questionnaire.Item data-testid="order" name="order">
          <TestChoice value="first" />
          <TestChoice value="second" />
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    renderMarkup(questionnaire)

    expect(choice("first").dataset.shortcut).toBe("B")
    expect(choice("second").dataset.shortcut).toBe("A")

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    await keydown(item("order"), "A")

    expect(choiceInput("second").checked).toBe(true)
    expect(choiceInput("first").checked).toBe(false)
    expect(choiceInput("second").getAttribute("aria-keyshortcuts")).toContain(
      "A"
    )
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Choice order for item "order" differs between Root.items'
      )
    )
  })

  it("warns when rendered metadata differs from its definitions", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const questionnaire = (
      <Questionnaire.Root
        items={[
          {
            choices: [{ disabled: true, value: "fixed" }],
            name: "answer",
            required: true,
          },
        ]}
      >
        <Questionnaire.Item name="answer">
          <TestChoice value="fixed" />
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(consoleWarn).toHaveBeenCalledTimes(2)
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Item "answer" has different required values in Root.items'
      )
    )
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Choice "fixed" in item "answer" has different disabled values'
      )
    )
  })

  it("warns about duplicate item names and choice values", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const questionnaire = (
      <Questionnaire.Root
        items={[
          {
            choices: [{ value: "fixed" }, { value: "fixed" }],
            name: "answer",
          },
          { disabled: true, name: "answer" },
        ]}
      >
        <Questionnaire.Item name="answer">
          <TestChoice value="fixed" />
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Item name "answer" is defined more than once')
    )
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Choice value "fixed" is defined more than once in item "answer"'
      )
    )
  })

  it("does not assign post-hydration shortcuts to omitted definitions", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const questionnaire = (
      <Questionnaire.Root items={[{ name: "answer" }]} shortcuts="letters">
        <Questionnaire.Item name="answer">
          <TestChoice value="fixed" />
          <Questionnaire.Input aria-label="Another answer" />
        </Questionnaire.Item>
      </Questionnaire.Root>
    )

    renderMarkup(questionnaire)

    expect(shortcut("fixed").hidden).toBe(true)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(shortcut("fixed").hidden).toBe(true)
    expect(choiceInput("fixed").hasAttribute("aria-keyshortcuts")).toBe(false)
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Rendered choice "fixed" in item "answer" is missing from Root.items'
      )
    )
  })

  it("updates authoritative order and falls back when the active item is disabled", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const onItemChange = vi.fn()
    const initialItems = [
      { name: "first" },
      { name: "second" },
      { name: "third" },
    ]

    function DynamicQuestionnaire({
      definitions,
    }: {
      definitions: readonly QuestionnaireItemDefinition[]
    }) {
      return (
        <Questionnaire.Root
          data-testid="root"
          defaultItem="second"
          items={definitions}
          onItemChange={onItemChange}
        >
          <Questionnaire.Progress data-testid="progress" />
          {definitions.map((definition) => (
            <Questionnaire.Item
              key={definition.name}
              data-testid={definition.name}
              disabled={definition.disabled}
              name={definition.name}
            >
              <Questionnaire.Title>{definition.name}</Questionnaire.Title>
            </Questionnaire.Item>
          ))}
          <Questionnaire.Previous data-testid="previous" />
          <Questionnaire.Next data-testid="next" />
          <Questionnaire.Submit data-testid="submit" />
        </Questionnaire.Root>
      )
    }

    const questionnaire = <DynamicQuestionnaire definitions={initialItems} />
    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(progress().textContent).toBe("Question 2 of 3")

    const reorderedItems = [
      { name: "second" },
      { name: "first" },
      { name: "third" },
    ]

    await act(async () => {
      root?.render(<DynamicQuestionnaire definitions={reorderedItems} />)
    })

    expect(progress().textContent).toBe("Question 1 of 3")
    expect(action("previous").hidden).toBe(true)

    const disabledItems = [
      { disabled: true, name: "second" },
      { name: "first" },
      { name: "third" },
    ]

    await act(async () => {
      root?.render(<DynamicQuestionnaire definitions={disabledItems} />)
    })

    expect(progress().textContent).toBe("Question 1 of 2")
    expect(item("first").hasAttribute("data-active")).toBe(true)
    expect(onItemChange).toHaveBeenLastCalledWith("first")
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'defaultItem "second" does not identify an enabled item'
      )
    )

    const expandedItems = [
      { name: "first" },
      { name: "third" },
      { name: "fourth" },
    ]

    await act(async () => {
      root?.render(<DynamicQuestionnaire definitions={expandedItems} />)
    })

    expect(progress().textContent).toBe("Question 1 of 3")
    expect(action("next").hidden).toBe(false)
    expect(item("fourth").hidden).toBe(true)
  })

  it("keeps a controlled item aligned with collection updates", async () => {
    function ControlledQuestionnaire({ item: activeItem }: { item: string }) {
      return (
        <Questionnaire.Root item={activeItem} items={items}>
          <Questionnaire.Progress data-testid="progress" />
          <Questionnaire.Item data-testid="scope" name="scope" required>
            <Questionnaire.Title>Scope</Questionnaire.Title>
            <TestChoice value="delegation" />
            <TestChoice disabled value="automatic" />
            <TestChoice value="questions" />
          </Questionnaire.Item>
          <Questionnaire.Item data-testid="detail" name="detail">
            <Questionnaire.Title>Detail</Questionnaire.Title>
            <TestChoice value="focused" />
            <TestChoice value="complete" />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    }

    const questionnaire = <ControlledQuestionnaire item="scope" />
    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    await act(async () => {
      root?.render(<ControlledQuestionnaire item="detail" />)
    })

    expect(progress().textContent).toBe("Question 2 of 2")
    expect(item("scope").hidden).toBe(true)
    expect(item("detail").hasAttribute("data-active")).toBe(true)
  })

  it("reports a mismatch again after it resolves and recurs", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})

    function WarningQuestionnaire({
      includeChoice,
    }: {
      includeChoice: boolean
    }) {
      const definitions = [
        {
          choices: includeChoice ? [{ value: "fixed" }] : undefined,
          name: "answer",
        },
      ]

      return (
        <Questionnaire.Root items={definitions} shortcuts="letters">
          <Questionnaire.Item name="answer">
            <TestChoice value="fixed" />
          </Questionnaire.Item>
        </Questionnaire.Root>
      )
    }

    const questionnaire = <WarningQuestionnaire includeChoice />
    renderMarkup(questionnaire)

    await act(async () => {
      root = hydrateRoot(container, questionnaire)
    })

    expect(consoleWarn).not.toHaveBeenCalled()

    await act(async () => {
      root?.render(<WarningQuestionnaire includeChoice={false} />)
    })

    expect(consoleWarn).toHaveBeenCalledTimes(1)

    await act(async () => {
      root?.render(<WarningQuestionnaire includeChoice />)
    })

    await act(async () => {
      root?.render(<WarningQuestionnaire includeChoice={false} />)
    })

    expect(consoleWarn).toHaveBeenCalledTimes(2)
  })
})

function TestQuestionnaire({
  defaultItem,
  item: controlledItem,
}: {
  defaultItem?: string
  item?: string
}) {
  return (
    <Questionnaire.Root
      data-testid="root"
      defaultItem={defaultItem}
      item={controlledItem}
      items={items}
      shortcuts="letters"
    >
      <Questionnaire.Progress data-testid="progress" />

      <Questionnaire.Item data-testid="scope" name="scope" required>
        <Questionnaire.Title>Choose the scope</Questionnaire.Title>
        <TestChoice value="delegation" />
        <TestChoice disabled value="automatic" />
        <TestChoice value="questions" />
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="disabled" disabled name="disabled">
        <Questionnaire.Title>Disabled question</Questionnaire.Title>
        <TestChoice value="ignored" />
      </Questionnaire.Item>

      <Questionnaire.Item data-testid="detail" name="detail">
        <Questionnaire.Title>Choose the detail</Questionnaire.Title>
        <TestChoice value="focused" />
        <TestChoice value="complete" />
      </Questionnaire.Item>

      <Questionnaire.Previous data-testid="previous" />
      <Questionnaire.Skip data-testid="skip" />
      <Questionnaire.Next data-testid="next" />
      <Questionnaire.Submit data-testid="submit" />
    </Questionnaire.Root>
  )
}

function TestChoice({
  value,
  ...props
}: Omit<React.ComponentProps<typeof Questionnaire.Choice>, "children">) {
  return (
    <Questionnaire.Choice
      data-testid={`choice-${value}`}
      value={value}
      {...props}
    >
      <Questionnaire.ChoiceInput data-testid={`input-${value}`} />
      <Questionnaire.ChoiceLabel>{value}</Questionnaire.ChoiceLabel>
      <Questionnaire.ChoiceShortcut data-testid={`shortcut-${value}`} />
    </Questionnaire.Choice>
  )
}

function renderServerQuestionnaire({
  defaultItem,
}: {
  defaultItem?: string
} = {}) {
  renderMarkup(<TestQuestionnaire defaultItem={defaultItem} />)
}

function renderMarkup(element: React.ReactNode) {
  container.innerHTML = renderToString(element)
}

function form() {
  return query<HTMLFormElement>("root")
}

function progress() {
  return query<HTMLElement>("progress")
}

function item(name: string) {
  return query<HTMLFieldSetElement>(name)
}

function choice(value: string) {
  return query<HTMLLabelElement>(`choice-${value}`)
}

function choiceInput(value: string) {
  return query<HTMLInputElement>(`input-${value}`)
}

function shortcut(value: string) {
  return query<HTMLElement>(`shortcut-${value}`)
}

function action(name: "next" | "previous" | "skip" | "submit") {
  return query<HTMLButtonElement>(name)
}

function actionsMarkup() {
  return ["previous", "skip", "next", "submit"]
    .map(
      (name) =>
        action(name as "next" | "previous" | "skip" | "submit").outerHTML
    )
    .join("")
}

function query<ElementType extends Element>(testId: string) {
  const element = container.querySelector<ElementType>(
    `[data-testid="${testId}"]`
  )

  if (!element) {
    throw new Error(`Missing test element: ${testId}`)
  }

  return element
}

async function keydown(element: Element, key: string) {
  await act(async () => {
    element.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key })
    )
  })
}
