"use client"

import { useFormState } from "react-dom"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

import { signIn } from "../lib/actions"
import { ActionResult } from "../sharedTypes"

export function SignInForm() {
  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    signIn,
    undefined
  )
  return (
    <form action={action}>
      <div className="grid gap-4">
        <div>
          <Input id="email" placeholder="Email" type="email" name="email" />
        </div>
        <div>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
          />
        </div>

        <Button>Sign in</Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {result?.errorMessage && (
            <>
              <p className="text-sm text-red-500">{result.errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
