"use client"

import * as React from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LABELS = ["Bug", "Documentation", "Duplicate", "Question"]

export function DropdownMenuCheckboxesDialog() {
  const [newLabel, setNewLabel] = React.useState<string>("")
  const [labels, setLabels] = React.useState<string[]>(LABELS)
  const [values, setValues] = React.useState<string[]>([])

  React.useEffect(() => {
    if (labels.includes(newLabel)) {
      setValues((prev) => [...prev, newLabel])
      setNewLabel("")
    }
  }, [newLabel, labels])

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Labels</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {labels.map((label) => {
            const checked = values.includes(label)
            return (
              <DropdownMenuCheckboxItem
                key={label}
                checked={checked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValues((prev) => [...prev, label])
                  } else {
                    setValues((prev) => prev.filter((l) => l !== label))
                  }
                }}
                onSelect={(event) => {
                  event.preventDefault()
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
              }}
              className="appearance-none"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Label</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
          <DialogDescription>
            Missing a label? Create one now!
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="name" className="sr-only">
            Name
          </Label>
          <Input
            id="name"
            value={newLabel}
            placeholder="Enhancement"
            onChange={(e) => {
              setNewLabel(e.target.value)
            }}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={newLabel.trim() === ""}
              onClick={() => {
                setLabels((prev) => [...prev, newLabel])
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
