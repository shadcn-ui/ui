---
title: Questionnaire
description: Build accessible, multi-step questionnaires with single, multiple, freeform, and intentionally skipped answers.
---

`Questionnaire` is an unstyled form primitive for presenting one question at a
time. It manages answers, progress, validation, and navigation.

It works well for agent clarification prompts, onboarding, surveys, intake
forms, and configuration.

The unstyled package gives you full control over markup and styles. For the
styled version and themed examples, see
[Questionnaire](/docs/components/base/questionnaire).

## Installation

```bash
npm install @shadcn/react
```

## Import

```tsx
import { Questionnaire } from "@shadcn/react/questionnaire"
```

`Questionnaire` exports its parts from one namespace. Each part accepts the
native props for its default element.

## Anatomy

```tsx
<Questionnaire.Root>
  <Questionnaire.Progress />
  <Questionnaire.Item name="question">
    <Questionnaire.Title />
    <Questionnaire.Description />
    <Questionnaire.Choices>
      <Questionnaire.Choice>
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel />
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
      <Questionnaire.Input />
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Skip />
  <Questionnaire.Next />
  <Questionnaire.Submit />
</Questionnaire.Root>
```

`Root` renders a form. Each `Item` is a fieldset, with `Title` as its legend.
`ChoiceInput` renders a native radio or checkbox.

## Styled version

The styled registry component uses flat component names:

| Styled component                                                                         | Unstyled part                                                                                |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Questionnaire`                                                                          | `Questionnaire.Root`                                                                         |
| `QuestionnaireProgress`                                                                  | `Questionnaire.Progress`                                                                     |
| `QuestionnaireItem`                                                                      | `Questionnaire.Item`                                                                         |
| `QuestionnaireTitle`                                                                     | `Questionnaire.Title`                                                                        |
| `QuestionnaireDescription`                                                               | `Questionnaire.Description`                                                                  |
| `QuestionnaireChoices`                                                                   | `Questionnaire.Choices`                                                                      |
| `QuestionnaireChoice`                                                                    | `Questionnaire.Choice` with `ChoiceInput`, `ChoiceLabel`, and `ChoiceShortcut`               |
| `QuestionnaireInput`                                                                     | `Questionnaire.Input`                                                                        |
| `QuestionnaireError`                                                                     | `Questionnaire.Error`                                                                        |
| `QuestionnaireActions`                                                                   | None. Layout only; use your own container.                                                   |
| `QuestionnairePrevious`, `QuestionnaireSkip`, `QuestionnaireNext`, `QuestionnaireSubmit` | `Questionnaire.Previous`, `Questionnaire.Skip`, `Questionnaire.Next`, `Questionnaire.Submit` |

The styled `QuestionnaireChoice` composes the input, label, shortcut, and visual
indicator for you. With the unstyled package, compose those parts yourself.

## Basic usage

Each `Item` is one step. Its `name` identifies the step and becomes the form
field name for its answers. `Choice.value` is the submitted answer.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-demo"
  hideCode
  previewClassName="min-h-[560px] p-4 sm:p-8"
/>

```tsx
const items = [
  {
    name: "prototype",
    required: true,
    prompt: "What should we prototype next?",
    description: "Choose a direction or write your own.",
    choices: [
      {
        value: "delegation",
        label: "Delegation",
        description: "Show how work moves to a specialist.",
      },
      {
        value: "questions",
        label: "Question prompts",
        description: "Show choices while the interface waits.",
      },
      { value: "both", label: "Both together" },
    ],
    input: { label: "Another answer", placeholder: "Type another answer…" },
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail should it include?",
    description: "Skip this if you are not sure yet.",
    choices: [
      { value: "focused", label: "Focused" },
      { value: "complete", label: "Complete flow" },
    ],
  },
] as const
```

```tsx showLineNumbers
"use client"

import * as React from "react"
import { Questionnaire } from "@shadcn/react/questionnaire"

export function ProjectQuestionnaire() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    console.log({
      prototype: formData.get("prototype"),
      detail: formData.get("detail"),
    })
  }

  return (
    <Questionnaire.Root items={items} onSubmit={handleSubmit}>
      <Questionnaire.Progress />
      {items.map((question) => (
        <Questionnaire.Item
          key={question.name}
          name={question.name}
          required={question.required}
        >
          <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
          <Questionnaire.Description>
            {question.description}
          </Questionnaire.Description>
          <Questionnaire.Choices>
            {question.choices.map((choice) => (
              <Questionnaire.Choice key={choice.value} value={choice.value}>
                <Questionnaire.ChoiceInput />
                <Questionnaire.ChoiceLabel>
                  <span>{choice.label}</span>
                  {"description" in choice ? (
                    <span>{choice.description}</span>
                  ) : null}
                </Questionnaire.ChoiceLabel>
                <Questionnaire.ChoiceShortcut />
              </Questionnaire.Choice>
            ))}
            {"input" in question ? (
              <Questionnaire.Input
                aria-label={question.input.label}
                placeholder={question.input.placeholder}
              />
            ) : null}
          </Questionnaire.Choices>
          <Questionnaire.Error />
        </Questionnaire.Item>
      ))}
      <Questionnaire.Previous />
      <Questionnaire.Skip />
      <Questionnaire.Next />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )
}
```

Pass the same `items` collection to `Root` that you render as `Item` and
`Choice` parts. This makes item order, progress, action visibility, and answer
shortcuts available in the server-rendered HTML.

## Multiple selection

`multiple` turns an item's fixed choices into native checkboxes. Read the answers with
`FormData.getAll()`. Keep `multiple` in your application data and pass it to
the rendered `Item`.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-multiple"
  hideCode
  previewClassName="min-h-[420px] p-4 sm:p-8"
/>

```tsx
const items = [
  {
    name: "signals",
    required: true,
    multiple: true,
    prompt: "What should every update include?",
    description: "Select all that apply.",
    choices: [
      { value: "progress", label: "Progress" },
      { value: "decisions", label: "Decisions" },
      { value: "risks", label: "Risks" },
    ],
  },
] as const
```

```tsx
items.map((question) => (
  <Questionnaire.Item
    key={question.name}
    name={question.name}
    multiple={question.multiple}
    required={question.required}
  >
    <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
    <Questionnaire.Description>
      {question.description}
    </Questionnaire.Description>
    <Questionnaire.Choices>
      {question.choices.map((choice) => (
        <Questionnaire.Choice key={choice.value} value={choice.value}>
          <Questionnaire.ChoiceInput />
          <Questionnaire.ChoiceLabel>{choice.label}</Questionnaire.ChoiceLabel>
          <Questionnaire.ChoiceShortcut />
        </Questionnaire.Choice>
      ))}
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
))
```

```tsx
const signals = new FormData(form).getAll("signals").map(String)
```

## Freeform answers

`Input` adds a freeform answer and renders a native text input.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-freeform"
  hideCode
  previewClassName="min-h-[420px] p-4 sm:p-8"
/>

```tsx
const items = [
  {
    name: "prototype",
    required: true,
    prompt: "What should we prototype next?",
    choices: [
      { value: "delegation", label: "Delegation" },
      { value: "questions", label: "Question prompts" },
    ],
    input: {
      label: "Another prototype direction",
      placeholder: "Type another direction…",
    },
  },
] as const
```

```tsx
items.map((question) => (
  <Questionnaire.Item
    key={question.name}
    name={question.name}
    required={question.required}
  >
    <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
    <Questionnaire.Choices>
      {question.choices.map((choice) => (
        <Questionnaire.Choice key={choice.value} value={choice.value}>
          <Questionnaire.ChoiceInput />
          <Questionnaire.ChoiceLabel>{choice.label}</Questionnaire.ChoiceLabel>
          <Questionnaire.ChoiceShortcut />
        </Questionnaire.Choice>
      ))}
      <Questionnaire.Input
        aria-label={question.input.label}
        placeholder={question.input.placeholder}
      />
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
))
```

## Explicit skip

`Skip` records that an optional item was intentionally left unanswered. Use
`onStatusChange` when your application needs to distinguish a skipped answer
from a missing one.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-skip"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx showLineNumbers
"use client"

import * as React from "react"
import {
  Questionnaire,
  type QuestionnaireItemStatus,
} from "@shadcn/react/questionnaire"

export function PlanningQuestionnaire() {
  const [timingStatus, setTimingStatus] =
    React.useState<QuestionnaireItemStatus>("unanswered")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    console.log({
      timing:
        timingStatus === "skipped"
          ? { status: "skipped" }
          : {
              status: "answered",
              value: formData.get("timing"),
            },
    })
  }

  return (
    <Questionnaire.Root defaultItem="timing" onSubmit={handleSubmit}>
      <Questionnaire.Item name="timing" onStatusChange={setTimingStatus}>
        <Questionnaire.Title>
          When should this be revisited?
        </Questionnaire.Title>
        <Questionnaire.Description>
          Skip this if timing has not been decided.
        </Questionnaire.Description>
        <Questionnaire.Choices>
          <Questionnaire.Choice value="week">
            <Questionnaire.ChoiceInput />
            <Questionnaire.ChoiceLabel>This week</Questionnaire.ChoiceLabel>
            <Questionnaire.ChoiceShortcut />
          </Questionnaire.Choice>
          <Questionnaire.Choice value="cycle">
            <Questionnaire.ChoiceInput />
            <Questionnaire.ChoiceLabel>Next cycle</Questionnaire.ChoiceLabel>
            <Questionnaire.ChoiceShortcut />
          </Questionnaire.Choice>
        </Questionnaire.Choices>
      </Questionnaire.Item>
      <Questionnaire.Skip />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )
}
```

## Answer shortcuts

Use `shortcuts="letters"` or `shortcuts="numbers"` to assign a key to each
enabled fixed choice, following the `items` order when it is provided. Compose
`ChoiceShortcut` wherever its hint should appear.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-shortcuts"
  hideCode
  previewClassName="min-h-[480px] p-4 sm:p-8"
/>

```tsx
<Questionnaire.Root shortcuts="letters">
  <Questionnaire.Item name="review" required>
    <Questionnaire.Title>What should the agent review?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="api">
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Public API</Questionnaire.ChoiceLabel>
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
      <Questionnaire.Choice value="tests">
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Test coverage</Questionnaire.ChoiceLabel>
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
</Questionnaire.Root>
```

`"letters"` assigns `A` through `Z`; `"numbers"` assigns `1` through `9`.
Disabled choices are skipped. Selecting an answer by shortcut does not advance
to the next item.

## Validation

Questionnaire validates the active item before moving forward and validates all
enabled items when the form submits.

- A required item is valid after it has an answer.
- An optional item is valid after it has an answer or is explicitly skipped.
- Disabled items and answers are ignored.

`required` does not add visible “Required” text. Say it in the `Title` or
`Description`.

When validation fails, Questionnaire keeps or opens the invalid item and
focuses an answer. Add `Error` to show a message.

```tsx
<Questionnaire.Item name="scope" required>
  <Questionnaire.Title>
    What should the project include? (Required)
  </Questionnaire.Title>
  <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
  <Questionnaire.Error />
</Questionnaire.Item>
```

`Error` remains hidden until the item is invalid. Pass children to replace its
default message.

```tsx
<Questionnaire.Error>Please choose a project scope.</Questionnaire.Error>
```

Validation still works without `Error`. When rendered, the message is announced
to screen readers.

For Zod or another external validator, set `Item.invalid`, render the message in
`Error`, and move `Root.item` to the first invalid item.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-validation"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
<Questionnaire.Root item={item} onItemChange={setItem} onSubmit={handleSubmit}>
  <Questionnaire.Item invalid={Boolean(errors.detail)} name="detail" required>
    <Questionnaire.Title>How much detail?</Questionnaire.Title>
    <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
    <Questionnaire.Error>{errors.detail}</Questionnaire.Error>
  </Questionnaire.Item>
</Questionnaire.Root>
```

## Controlled navigation

Pass `item` and `onItemChange` to control the active item.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-controlled"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
const [item, setItem] = React.useState("scope")

<Questionnaire.Root item={item} onItemChange={setItem} onSubmit={handleSubmit}>
  <Questionnaire.Item name="scope" required>
    {/* question and answers */}
  </Questionnaire.Item>
  <Questionnaire.Item name="verification" required>
    {/* question and answers */}
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Next>Next</Questionnaire.Next>
  <Questionnaire.Submit>Submit</Questionnaire.Submit>
</Questionnaire.Root>
```

## Resume with defaults

Restore a saved draft with `defaultItem`, `defaultChecked`, and `defaultValue`.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-resume"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
<Questionnaire.Root defaultItem="verification">
  <Questionnaire.Item name="scope" required>
    <Questionnaire.Title>Which files are in scope?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="component" defaultChecked>
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Component only</Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
  <Questionnaire.Item name="verification" required>
    <Questionnaire.Title>Any extra instructions?</Questionnaire.Title>
    <Questionnaire.Input
      aria-label="Extra instructions"
      defaultValue="Run the package tests."
    />
  </Questionnaire.Item>
  <button type="reset">Reset draft</button>
</Questionnaire.Root>
```

## Conditional items

Set `disabled` to remove an item from the current flow. Disabled items are
excluded from progress, navigation, validation, and submission.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-conditional"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
const [runtime, setRuntime] = React.useState("local")

<Questionnaire.Root>
  <Questionnaire.Item name="runtime" required>
    <Questionnaire.Title>Where should the agent run?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice
        value="local"
        checked={runtime === "local"}
        onChange={() => setRuntime("local")}
      >
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Locally</Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
      <Questionnaire.Choice
        value="remote"
        checked={runtime === "remote"}
        onChange={() => setRuntime("remote")}
      >
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>
          Remote environment
        </Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
  <Questionnaire.Item name="region" disabled={runtime !== "remote"} required>
    {/* remote-only question */}
  </Questionnaire.Item>
</Questionnaire.Root>
```

## Navigation state

Navigation actions stay enabled by default so activating Next or Submit can
show a validation error. Use the render state when you want to disable an
action yourself.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-navigation-state"
  hideCode
  previewClassName="min-h-[480px] p-4 sm:p-8"
/>

```tsx
<Questionnaire.Next
  render={(props, state) => (
    <button {...props} disabled={state.status === "unanswered"} />
  )}
>
  Next
</Questionnaire.Next>
```

The render state contains `visible`, `disabled`, `shortcut`, and the active
item's `status`. To change only the appearance, target `data-status` instead:

```tsx
<Questionnaire.Next data-navigation-action>Next</Questionnaire.Next>
```

```css
[data-navigation-action][data-status="unanswered"] {
  opacity: 0.5;
}
```

## Custom progress

`Progress` renders `Question {current} of {total}` by default. Use `render` to
change its element or format.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-progress"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
<Questionnaire.Progress
  aria-label="Setup progress"
  render={(props, state) => (
    <output {...props}>
      Checkpoint {state.current} of {state.total}
    </output>
  )}
/>
```

The render state contains `current`, `total`, `first`, and `last`. Pass a
localized `aria-label` when needed.

## Animated items

Animate the active item while keeping progress and navigation stationary.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-animated"
  hideCode
  previewClassName="min-h-[520px] p-4 sm:p-8"
/>

```tsx
const itemClassName =
  "data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none"

<Questionnaire.Item
  className={itemClassName}
  name="task"
  required
>
  {/* ... */}
</Questionnaire.Item>
```

Inactive items hide immediately, so animate the entry only.

## Card composition

Place the root around a card and render `Title` and `Description` into the
card header. Give the title an `id` and connect it with the item's
`aria-labelledby` since it replaces the default legend.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-card"
  hideCode
  previewClassName="min-h-[560px] p-4 sm:p-8"
/>

```tsx
const titleId = React.useId()

<Questionnaire.Root onSubmit={handleSubmit}>
  <Card>
    <Questionnaire.Item aria-labelledby={titleId} name="task" required>
      <CardHeader>
        <Questionnaire.Title id={titleId} render={<CardTitle />}>
          What should the agent work on?
        </Questionnaire.Title>
        <Questionnaire.Description render={<CardDescription />}>
          Choose the task that should be handled next.
        </Questionnaire.Description>
        <CardAction>
          <Questionnaire.Progress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
        <Questionnaire.Error />
      </CardContent>
    </Questionnaire.Item>
    <CardFooter>
      <Questionnaire.Next>Next</Questionnaire.Next>
      <Questionnaire.Submit>Submit</Questionnaire.Submit>
    </CardFooter>
  </Card>
</Questionnaire.Root>
```

## Dialog composition

Keep dialog dismissal separate from `Skip`: closing cancels the flow, while
skipping records an intentional unanswered item.

<ComponentPreview
  align="end"
  styleName="base-nova"
  name="questionnaire-dialog"
  hideCode
  previewClassName="min-h-[320px] p-4 sm:p-8"
/>

```tsx
const titleId = React.useId()

<Dialog>
  <DialogTrigger>Open clarification</DialogTrigger>
  <DialogContent>
    <Questionnaire.Root onSubmit={handleSubmit}>
      <Questionnaire.Item aria-labelledby={titleId} name="scope" required>
        <DialogHeader>
          <Questionnaire.Progress />
          <Questionnaire.Title id={titleId} render={<DialogTitle />}>
            Which files are in scope?
          </Questionnaire.Title>
          <Questionnaire.Description render={<DialogDescription />}>
            Choose how broadly the agent can update the workspace.
          </Questionnaire.Description>
        </DialogHeader>
        <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
        <Questionnaire.Error />
      </Questionnaire.Item>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <Questionnaire.Next>Next</Questionnaire.Next>
        <Questionnaire.Submit>Send answer</Questionnaire.Submit>
      </DialogFooter>
    </Questionnaire.Root>
  </DialogContent>
</Dialog>
```

## Custom render targets

Use `render` to replace a part's default element. Pass an element, or use a
function when you need its state.

```tsx
<Questionnaire.Next render={<Button />}>Next</Questionnaire.Next>
```

`Root` and `Item` always render a `form` and `fieldset`. If `Title` no longer
renders a `legend`, give it an `id` and pass that ID to `Item` with
`aria-labelledby`.

The primitive does not emit `data-slot`. Styled wrappers own slots and visual
indicators.

## Native forms

`Root` always renders a native form and supports `onSubmit`, `onReset`, `action`,
and the other form props. Do not nest a Questionnaire inside another form.

Answers serialize through native controls:

- `FormData.get(itemName)` reads a single answer.
- `FormData.getAll(itemName)` reads multiple answers.
- Skipped items are absent from `FormData`.
- Use `Item.onStatusChange` to distinguish a skip from a missing answer.

`Root` sets `noValidate` by default so validation uses `Questionnaire.Error`
instead of the browser's constraint validation UI.

`form.reset()` restores the initial item, default answers, skip state, and
validation state.

## Keyboard navigation

Questionnaire builds on native radio, checkbox, input, and button behavior.

| Key                      | Behavior                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                    | Moves focus between answer controls and visible actions.                                                                        |
| `Shift` + `Tab`          | Moves focus to the previous control or action.                                                                                  |
| `ArrowUp`                | Moves to the previous answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it. |
| `ArrowDown`              | Moves to the next answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it.     |
| `ArrowLeft`              | Moves to the previous item when focus is outside a radio or text entry control.                                                 |
| `ArrowRight`             | Moves to the next item when the active item is answered or skipped and focus is outside a radio or text entry control.          |
| `Space`                  | Selects a radio, toggles a checkbox, or activates a focused action.                                                             |
| `Enter`                  | Continues from a selected choice or selected, filled input; activates a focused action.                                         |
| `Command/Ctrl` + `Enter` | Validates and continues from anywhere inside the questionnaire, or submits the final item.                                      |

Shortcuts and arrow navigation pause while you type in a text field.
Preventing the root `onKeyDown` event turns off questionnaire key handling.

Navigation actions stay enabled by default so an attempted action can reveal
validation feedback. See [Navigation state](#navigation-state) to disable or
restyle an unanswered action.

## Accessibility

- `Item` renders a `fieldset`.
- `Title` renders the fieldset `legend` by default. If it uses a custom render
  target, connect its `id` to the item with `aria-labelledby`.
- `Description` and the active `Error` are connected with
  `aria-describedby`.
- Invalid items and answer controls expose `aria-invalid`.
- `Progress` renders a named progressbar with current, minimum, maximum, and
  text values.
- Fixed choices use native radios and checkboxes.
- Assigned shortcut keys and available navigation are exposed with
  `aria-keyshortcuts`.
- Inactive items and actions are hidden and inert.
- Navigation focuses the newly active fieldset.
- Validation focuses the first available answer control.
- Disabled items are omitted from progress and navigation.

Always give `Input` an accessible name. Use an explicit `id` with a visible
label:

```tsx
<Label htmlFor="other-answer">Other answer</Label>
<Questionnaire.Input
  id="other-answer"
  placeholder="Type another answer…"
/>
```

When the design has no visible label, use `aria-label` or `aria-labelledby`:

```tsx
<Questionnaire.Input
  aria-label="Other answer"
  placeholder="Type another answer…"
/>
```

A placeholder is not a label.

## Data attributes

Use these attributes for styling. Boolean attributes are present when true and
absent when false.

### Root and Progress

| Data attribute   | Value                                            |
| ---------------- | ------------------------------------------------ |
| `data-current`   | One-based active item position.                  |
| `data-total`     | Number of enabled items.                         |
| `data-first`     | Present on the first item.                       |
| `data-last`      | Present on the last item.                        |
| `data-shortcuts` | `"letters"` \| `"numbers"` on Root when enabled. |

### Item

| Data attribute  | Value                                         |
| --------------- | --------------------------------------------- |
| `data-active`   | Present when active.                          |
| `data-status`   | `"unanswered"` \| `"answered"` \| `"skipped"` |
| `data-required` | Present when required.                        |
| `data-multiple` | Present when multiple.                        |
| `data-disabled` | Present when disabled.                        |
| `data-invalid`  | Present after failed validation.              |

### Choice

| Data attribute   | Value                             |
| ---------------- | --------------------------------- |
| `data-type`      | `"radio"` \| `"checkbox"`         |
| `data-checked`   | Present when selected.            |
| `data-unchecked` | Present when not selected.        |
| `data-disabled`  | Present when disabled.            |
| `data-invalid`   | Present when its item is invalid. |
| `data-shortcut`  | Assigned letter or number.        |

### Choices

| Data attribute   | Value                                    |
| ---------------- | ---------------------------------------- |
| `data-shortcuts` | `"letters"` \| `"numbers"` when enabled. |

### Input

| Data attribute  | Value                                      |
| --------------- | ------------------------------------------ |
| `data-filled`   | Present when the input has non-empty text. |
| `data-empty`    | Present when the input has no answer text. |
| `data-disabled` | Present when disabled.                     |
| `data-invalid`  | Present when its item is invalid.          |

### Error

| Data attribute | Value                              |
| -------------- | ---------------------------------- |
| `data-invalid` | Present while the error is active. |

### Previous, Skip, Next, and Submit

| Data attribute  | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| `data-visible`  | Present when the action applies to the active item.        |
| `data-hidden`   | Present when the action does not apply.                    |
| `data-disabled` | Present when disabled.                                     |
| `data-shortcut` | `"Enter"` on an enabled, visible Next or Submit.           |
| `data-status`   | Active item: `"unanswered"`, `"answered"`, or `"skipped"`. |

`Title` and `Description` have no state attributes. The headless parts do not
emit `data-slot`.

## API Reference

### Questionnaire.Root

The form and coordination root.

| Prop           | Type                                     | Default            | Description                                                              |
| -------------- | ---------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| `item`         | `string`                                 | -                  | Controlled active item name.                                             |
| `defaultItem`  | `string`                                 | first enabled item | Initially active item name.                                              |
| `items`        | `readonly QuestionnaireItemDefinition[]` | -                  | Optional item data for server rendering and item order.                  |
| `onItemChange` | `(item: string) => void`                 | -                  | Called when navigation requests a different item.                        |
| `shortcuts`    | `"letters" \| "numbers"`                 | -                  | Assigns scoped answer shortcuts in definition or rendered DOM order.     |
| `noValidate`   | `boolean`                                | `true`             | Disables native constraint UI while preserving questionnaire validation. |
| `onSubmit`     | `FormEventHandler<HTMLFormElement>`      | -                  | Native form submission handler after every item validates.               |
| `onReset`      | `FormEventHandler<HTMLFormElement>`      | -                  | Native reset handler. Prevent default to stop questionnaire reset.       |

Root exposes `current`, `total`, `first`, `last`, and `shortcuts` through data
attributes.

The optional collection types are exported from
`@shadcn/react/questionnaire`:

```ts
type QuestionnaireChoiceDefinition = {
  value: string
  disabled?: boolean
}

type QuestionnaireItemDefinition = {
  name: string
  required?: boolean
  disabled?: boolean
  choices?: readonly QuestionnaireChoiceDefinition[]
}
```

### Questionnaire.Progress

Position within the enabled item collection.

| Prop         | Type                                             | Default                         | Description                               |
| ------------ | ------------------------------------------------ | ------------------------------- | ----------------------------------------- |
| `children`   | `React.ReactNode`                                | `Question {current} of {total}` | Custom progress content.                  |
| `aria-label` | `string`                                         | `Questionnaire progress`        | Accessible progressbar name.              |
| `render`     | `ReactElement \| (props, state) => ReactElement` | `<div>`                         | Custom render target with progress state. |

The render state contains `current`, `total`, `first`, and `last`.

### Questionnaire.Item

One questionnaire step.

| Prop             | Type                                        | Default  | Description                                                     |
| ---------------- | ------------------------------------------- | -------- | --------------------------------------------------------------- |
| `name`           | `string`                                    | required | Unique item identifier and native form field name.              |
| `invalid`        | `boolean`                                   | `false`  | Marks the item invalid from an external validator.              |
| `required`       | `boolean`                                   | `false`  | Requires an answer and prevents Skip.                           |
| `multiple`       | `boolean`                                   | `false`  | Renders fixed choices as checkboxes.                            |
| `disabled`       | `boolean`                                   | `false`  | Omits the item from progress and navigation.                    |
| `onStatusChange` | `(status: QuestionnaireItemStatus) => void` | -        | Observes `"unanswered"`, `"answered"`, and `"skipped"` changes. |

Item exposes `active`, `disabled`, `invalid`, `multiple`, `required`, and
`status` through data attributes.

Item names must be unique within a Root. The name belongs to the answer
controls, not the fieldset.

### Questionnaire.Title

The item title. Renders a semantic `legend` by default.

| Prop     | Type                              | Default    | Description                                                            |
| -------- | --------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `render` | `ReactElement \| render function` | `<legend>` | Custom render target. Pair its `id` with the item’s `aria-labelledby`. |

### Questionnaire.Description

Supporting text connected to the item with `aria-describedby`.

| Prop     | Type                              | Default | Description           |
| -------- | --------------------------------- | ------- | --------------------- |
| `render` | `ReactElement \| render function` | `<p>`   | Custom render target. |

### Questionnaire.Choices

A layout container for fixed and freeform answers.

| Prop     | Type                              | Default | Description           |
| -------- | --------------------------------- | ------- | --------------------- |
| `render` | `ReactElement \| render function` | `<div>` | Custom render target. |

The render state contains `shortcuts`.

### Questionnaire.Choice

A fixed-answer container. Compose one `ChoiceInput`, one `ChoiceLabel`, and an
optional `ChoiceShortcut` inside it. The default `<label>` keeps the whole row
associated with its native control.

| Prop             | Type                                             | Default   | Description                             |
| ---------------- | ------------------------------------------------ | --------- | --------------------------------------- |
| `value`          | `string`                                         | required  | Native answer value.                    |
| `checked`        | `boolean`                                        | -         | Controlled checked state.               |
| `defaultChecked` | `boolean`                                        | `false`   | Initial checked state.                  |
| `disabled`       | `boolean`                                        | `false`   | Disables the native answer control.     |
| `onChange`       | `ChangeEventHandler<HTMLInputElement>`           | -         | Native input change handler.            |
| `render`         | `ReactElement \| (props, state) => ReactElement` | `<label>` | Custom render target with choice state. |

The render state contains `checked`, `disabled`, `invalid`, `shortcut`, and
`type`.

### Questionnaire.ChoiceInput

The native radio or checkbox for its containing `Choice`. Questionnaire supplies
the props needed for selection, form submission, validation, and keyboard
interaction. It also accepts `className`, `id`, `ref`, `render`, and other
non-conflicting native input props.

`ChoiceInput` must be used inside `Choice`. Its render state matches `Choice`.

### Questionnaire.ChoiceLabel

The visible label content for a fixed choice. It renders a `<span>` inside the
`Choice` label and accepts native span props and `render`.

### Questionnaire.ChoiceShortcut

The visible shortcut for a fixed choice. It renders a `<span>` containing the
assigned letter or number and remains hidden when the choice has no shortcut.
It accepts native span props and `render`; its render state contains `shortcut`.

### Questionnaire.Input

A freeform answer. Its native `name` is managed by the containing item.

| Prop           | Type                                             | Default   | Description                                                   |
| -------------- | ------------------------------------------------ | --------- | ------------------------------------------------------------- |
| `value`        | `string \| number \| readonly string[]`          | -         | Controlled native input value.                                |
| `defaultValue` | `string \| number \| readonly string[]`          | -         | Initial native input value.                                   |
| `disabled`     | `boolean`                                        | `false`   | Disables the input.                                           |
| `onChange`     | `ChangeEventHandler<HTMLInputElement>`           | -         | Native input change handler.                                  |
| `type`         | `QuestionnaireInputType`                         | `"text"`  | A text-entry type such as `"email"`, `"number"`, or `"date"`. |
| `render`       | `ReactElement \| (props, state) => ReactElement` | `<input>` | Custom render target with input state.                        |

The render state contains `disabled`, `filled`, and `invalid`.

### Questionnaire.Error

The validation message. It is hidden until its item fails validation.

| Prop       | Type                                             | Default            | Description                              |
| ---------- | ------------------------------------------------ | ------------------ | ---------------------------------------- |
| `children` | `React.ReactNode`                                | contextual message | Custom validation message.               |
| `render`   | `ReactElement \| (props, state) => ReactElement` | `<p>`              | Custom render target with invalid state. |

### Navigation actions

`Previous`, `Skip`, `Next`, and `Submit` render native buttons and stay mounted
while their visibility changes.

| Part       | Default type | Visible when             | Disabled when             |
| ---------- | ------------ | ------------------------ | ------------------------- |
| `Previous` | `"button"`   | Not on the first item.   | Consumer sets `disabled`. |
| `Skip`     | `"button"`   | Active item is optional. | Consumer sets `disabled`. |
| `Next`     | `"button"`   | Not on the last item.    | Consumer sets `disabled`. |
| `Submit`   | `"submit"`   | On the last item.        | Consumer sets `disabled`. |

Each accepts native button props and:

| Prop     | Type                                             | Description                                 |
| -------- | ------------------------------------------------ | ------------------------------------------- |
| `render` | `ReactElement \| (props, state) => ReactElement` | Custom render target with navigation state. |

The render state contains `visible`, `disabled`, `shortcut`, and the active
item's `status`.
