"use client"

import { useSearchParams } from "next/navigation"
import { useFormState } from "react-dom"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

import { signIn } from "../lib/actions"
import { SubmitButton } from "../sharedComponents/submitButton"
import { ActionResult } from "../sharedTypes"

export function SignInForm() {
  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    signIn,
    undefined
  )
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl")

  return (
    <form action={action}>
      <Input
        id="callbackUrl"
        type="hidden"
        name="callbackUrl"
        value={callbackUrl!}
      />
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

        <SubmitButton label="Sign in"></SubmitButton>
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
