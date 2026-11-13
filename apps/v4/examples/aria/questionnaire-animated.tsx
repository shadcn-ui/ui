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
} from "@/styles/aria-nova/ui/questionnaire"

const items = [
  { name: "task", required: true },
  { name: "review", required: true },
  { name: "delivery", required: true },
] as const

const itemClassName =
  "data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none"

export function QuestionnaireAnimated() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Agent workflow saved", {
      description: `Task: ${formData.get("task") ?? "None"} · Review: ${formData.get("review") ?? "None"} · Delivery: ${formData.get("delivery") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem className={itemClassName} name="task" required>
        <QuestionnaireTitle>What should the agent do?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the task for this run.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="implement">
            Implement the requested change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="debug">
            Debug the current behavior
          </QuestionnaireChoice>
          <QuestionnaireChoice value="review">
            Review the implementation
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem className={itemClassName} name="review" required>
        <QuestionnaireTitle>
          How should the work be reviewed?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select the verification depth.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="targeted">
            Targeted checks
          </QuestionnaireChoice>
          <QuestionnaireChoice value="complete">
            Complete test suite
          </QuestionnaireChoice>
          <QuestionnaireChoice value="manual">
            Tests and manual QA
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem className={itemClassName} name="delivery" required>
        <QuestionnaireTitle>
          How should the result be delivered?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the final handoff format.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="summary">
            Concise summary
          </QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Summary and changed files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="handoff">
            Detailed review handoff
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}
