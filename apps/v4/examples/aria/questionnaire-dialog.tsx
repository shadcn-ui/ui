"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/styles/aria-nova/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/styles/aria-nova/ui/dialog"
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
  { name: "scope", required: true },
  { name: "tests", required: true },
] as const

export function QuestionnaireDialog() {
  const [open, setOpen] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setOpen(false)
    toast("Clarification sent", {
      description: `Scope: ${formData.get("scope") ?? "None"} · Verification: ${formData.get("tests") ?? "None"}`,
    })
  }

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Button variant="outline">Open clarification</Button>
      <Dialog>
        <Questionnaire
          defaultItem="scope"
          items={items}
          onSubmit={handleSubmit}
        >
          <QuestionnaireItem name="scope" required>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>
                Which files are in scope?
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Choose how broadly the agent can update the workspace.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="component">
                Component only
              </QuestionnaireChoice>
              <QuestionnaireChoice value="feature">
                Complete feature directory
              </QuestionnaireChoice>
              <QuestionnaireChoice value="workspace">
                Any related workspace file
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>

          <QuestionnaireItem name="tests" required>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>
                How much verification is needed?
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Choose the checks the agent should run before handoff.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="targeted">
                Targeted tests
              </QuestionnaireChoice>
              <QuestionnaireChoice value="package">
                Package tests
              </QuestionnaireChoice>
              <QuestionnaireChoice value="full">
                Full workspace verification
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>

          <DialogFooter>
            <DialogClose type="button" variant="outline">
              Cancel
            </DialogClose>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext>Next</QuestionnaireNext>
              <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </Dialog>
    </DialogTrigger>
  )
}
