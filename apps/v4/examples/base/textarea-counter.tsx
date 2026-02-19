"use client"

import { useState } from "react"
import { Field, FieldDescription, FieldLabel } from "@/examples/base/ui/field"
import { Textarea } from "@/examples/base/ui/textarea"

import { cn } from "@/lib/utils"

export function TextareaWithCounterExample() {
  const maxLength = 50
  const [value, setValue] = useState("")

  return (
    <Field>
      <FieldLabel htmlFor="textarea-counter">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>

      <div className="space-y-1">
        <Textarea
          id="textarea-counter"
          placeholder="Type your message here."
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div
          className={cn(
            "text-muted-foreground text-right text-xs",
            value.length >= maxLength && "text-red-500"
          )}
        >
          {value.length}/{maxLength}
        </div>
      </div>
    </Field>
  )
}
