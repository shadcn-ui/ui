"use client"

import { useFormState } from "react-dom"

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

import { requestResetPasswordEmail } from "../lib/actions"
import { applicationName } from "../sharedLabels"
import { ActionResult } from "../sharedTypes"

export function ForgotPasswordForm() {
  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    requestResetPasswordEmail,
    undefined
  )
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <p className="cursor-pointer  text-center text-sm text-muted-foreground">
            Forgot password?
          </p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot password?</DialogTitle>
            <DialogDescription>
              Enter your email and we&apos;ll send you a link to get back to
              your account.
            </DialogDescription>
          </DialogHeader>
          <form>
            <div className="grid gap-4">
              <div>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  name="email"
                />
              </div>

              <Button>Submit</Button>
              {/* <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {errorMessage && (
                  <>
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </div> */}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
