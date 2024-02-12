"use client"

import { useFormState, useFormStatus } from "react-dom"

import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

export function Signup() {
  const { pending } = useFormStatus()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Don&apos;t have an account? Sign up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign up</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form>
            <div className="grid gap-1">
              <div className="grid gap-1">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  name="email"
                />
              </div>
              <div className="grid gap-1">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  name="password"
                />
              </div>

              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
