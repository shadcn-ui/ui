# Questionnaire

An unstyled, multi-step questionnaire for React. `Root` renders a native form,
and answers are read with `FormData`.

Questionnaire supports server rendering. Pass `Root.items` to include complete
collection-derived state in the initial HTML.

## Usage

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
      { value: "questions", label: "Question prompts" },
    ],
    input: { label: "Another answer", placeholder: "Type another answer…" },
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail?",
    description: "Skip this if you are not sure yet.",
    choices: [
      { value: "focused", label: "Focused" },
      { value: "complete", label: "Complete flow" },
    ],
  },
] as const
```

```tsx
import { Questionnaire } from "@shadcn/react/questionnaire"

export function ProjectQuestionnaire() {
  return (
    <Questionnaire.Root
      items={items}
      onSubmit={(event) => {
        event.preventDefault()
        const answers = new FormData(event.currentTarget)
      }}
    >
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

## Documentation

Read the full docs at [ui.shadcn.com/docs/react/questionnaire](https://ui.shadcn.com/docs/react/questionnaire).
