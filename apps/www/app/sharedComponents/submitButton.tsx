"use client"

import { useFormStatus } from "react-dom"

import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"

interface SubmitButtonProps {
  label?: string
}

export function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  const displayedLabel = label ?? "Submit"

  return (
    <Button disabled={pending}>
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {displayedLabel}
    </Button>
  )
}
