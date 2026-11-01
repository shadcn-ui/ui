"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/styles/radix-nova/ui/questionnaire"

const items = [
  {
    choices: [{ value: "inspect" }, { value: "implement" }, { value: "review" }],
    name: "task",
    required: true,
  },
  {
    choices: [
      { value: "source" },
      { value: "tests" },
      { value: "docs" },
      { value: "history" },
    ],
    name: "context",
    required: true,
  },
] as const

export function QuestionnaireAutoSubmit() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const answers = {
      task: formData.get("task"),
      context: formData.getAll("context"),
    }

    toast("Plan saved", {
      description: `Task: ${answers.task ?? "None"} · Context: ${answers.context.join(", ") || "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem autoSubmit name="task" required>
        <QuestionnaireTitle>
          What should the agent do next?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choosing an answer continues automatically.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="inspect">
            Inspect the codebase
          </QuestionnaireChoice>
          <QuestionnaireChoice value="implement">
            Implement the change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="review">
            Review the result
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem
        autoSubmit={(value) => value.length > 1}
        multiple
        name="context"
        required
      >
        <QuestionnaireTitle>
          What context should the agent inspect?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Continues after two sources are selected.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="source">
            Relevant source files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tests">Existing tests</QuestionnaireChoice>
          <QuestionnaireChoice value="docs">
            Architecture documentation
          </QuestionnaireChoice>
          <QuestionnaireChoice value="history">
            Recent commit history
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}
