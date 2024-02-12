"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { pending } = useFormStatus()

  return (
    <div {...props}>
      <form>
        <div className="grid gap-1">
          <div className="grid gap-1">
            <Input id="email" placeholder="Email" type="email" name="email" />
          </div>
          <div className="grid gap-1">
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
            />
          </div>
          <Button disabled={pending}>
            {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          ></div>
        </div>
      </form>
      <div className="mb-4 cursor-pointer px-8 text-center text-sm text-muted-foreground hover:text-primary">
        Forgot password?
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  )
}
