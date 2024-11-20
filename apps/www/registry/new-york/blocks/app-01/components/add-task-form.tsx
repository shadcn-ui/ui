"use client"

import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import { SubmitButton } from "@/registry/new-york/blocks/app-01/components/submit-button"
import { useTasks } from "@/registry/new-york/blocks/app-01/hooks/use-tasks"
import { saveTask } from "@/registry/new-york/blocks/app-01/lib/actions"
import { Input } from "@/registry/new-york/ui/input"

export function AddTaskForm() {
  const { mutate } = useTasks()
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <form
      action={async (formData) => {
        await saveTask(formData)
        void mutate()
        formRef.current?.reset()
      }}
      className="w-full"
      ref={formRef}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="sr-only">
          Task Name
        </Label>
        <Input
          type="text"
          name="name"
          required
          autoComplete="off"
          placeholder="Remember the milk"
        />
        <SubmitButton className="w-full">Add Task</SubmitButton>
      </div>
    </form>
  )
}
