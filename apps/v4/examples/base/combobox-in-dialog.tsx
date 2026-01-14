"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/base/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import { Field, FieldLabel } from "@/examples/base/ui/field"
import { Select } from "@/examples/base/ui/select"
import { toast } from "sonner"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const items = [
  {
    label: "Select a framework",
    value: null,
  },
  {
    label: "React",
    value: "react",
  },
  {
    label: "Vue",
    value: "vue",
  },
  {
    label: "Angular",
    value: "angular",
  },
  {
    label: "Svelte",
    value: "svelte",
  },
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Preact",
    value: "preact",
  },
  {
    label: "Next.js",
    value: "next.js",
  },
]

export function ComboboxInDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Framework</DialogTitle>
            <DialogDescription>
              Choose your preferred framework from the list below.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="framework-dialog" className="sr-only">
              Framework
            </FieldLabel>
            <Combobox items={frameworks}>
              <ComboboxInput
                id="framework-dialog"
                placeholder="Select a framework"
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                toast("Framework selected.")
                setOpen(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
