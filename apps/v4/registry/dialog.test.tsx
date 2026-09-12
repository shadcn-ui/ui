// @vitest-environment jsdom

import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./bases/base/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./bases/base/ui/dialog"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe("Base UI dialog registry item", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await React.act(async () => root.unmount())
    container.remove()
  })

  it("forwards forceRender to a nested dialog overlay", async () => {
    await React.act(async () => {
      root.render(
        <Dialog open>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Parent dialog</DialogTitle>
            <DialogDescription>Parent dialog description</DialogDescription>
            <Dialog open>
              <DialogContent
                showCloseButton={false}
                overlayProps={{ forceRender: true }}
              >
                <DialogTitle>Nested dialog</DialogTitle>
                <DialogDescription>Nested dialog description</DialogDescription>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      )
    })

    expect(
      document.querySelectorAll('[data-slot="dialog-overlay"]')
    ).toHaveLength(2)
  })

  it("forwards forceRender to a nested alert dialog overlay", async () => {
    await React.act(async () => {
      root.render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Parent alert dialog</AlertDialogTitle>
            <AlertDialogDescription>
              Parent alert dialog description
            </AlertDialogDescription>
            <AlertDialog open>
              <AlertDialogContent overlayProps={{ forceRender: true }}>
                <AlertDialogTitle>Nested alert dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  Nested alert dialog description
                </AlertDialogDescription>
              </AlertDialogContent>
            </AlertDialog>
          </AlertDialogContent>
        </AlertDialog>
      )
    })

    expect(
      document.querySelectorAll('[data-slot="alert-dialog-overlay"]')
    ).toHaveLength(2)
  })
})
