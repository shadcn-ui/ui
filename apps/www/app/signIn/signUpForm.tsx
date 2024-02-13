"use client"

import { useFormState } from "react-dom"

import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import { Input } from "@/registry/new-york/ui/input"

import { signUp } from "../lib/actions"
import { GeneralConditions } from "../sharedComponents/generalConditions"
import { applicationName } from "../sharedLabels"
import { ActionResult } from "../sharedTypes"

export function SignUpForm() {
  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    signUp,
    undefined
  )
  return (
    <>
      <Dialog>
        <Button variant="outline" type="button" asChild>
          <DialogTrigger>Don&apos;t have an account? Sign up</DialogTrigger>
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up</DialogTitle>
            <DialogDescription>
              Enter your email and a password and we&apos;ll send you a link to
              finalise your account creation.
            </DialogDescription>
          </DialogHeader>
          <form action={action}>
            <div className="grid gap-4">
              <div>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  name="email"
                />
              </div>
              <div>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  name="password"
                />
              </div>

              <Button>Submit</Button>
              <GeneralConditions callToAction="Submit" />
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {result?.errorMessage && (
                  <>
                    <p className="text-sm text-red-500">
                      {result.errorMessage}
                    </p>
                  </>
                )}
                {result?.successMessage && (
                  <>
                    <p className="text-sm text-green-500">
                      {result.successMessage}
                    </p>
                  </>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
