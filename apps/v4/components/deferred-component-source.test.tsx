// @vitest-environment jsdom

import * as React from "react"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DeferredComponentSource } from "./deferred-component-source"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("DeferredComponentSource", () => {
  it("loads a registry item once for multiple source files", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        files: [
          { path: "registry/test/ui/alpha.ts", content: "const alpha = 1" },
          { path: "registry/test/ui/beta.ts", content: "const beta = 2" },
        ],
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    render(
      <>
        <DeferredComponentSource
          name="deferred-source-test"
          file="alpha.ts"
          styleName="test"
        />
        <DeferredComponentSource
          name="deferred-source-test"
          file="beta.ts"
          styleName="test"
        />
      </>
    )

    expect(await screen.findByText("const alpha = 1")).toBeTruthy()
    expect(await screen.findByText("const beta = 2")).toBeTruthy()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("offers a retry when the registry request fails", async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Registry unavailable"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          files: [
            {
              path: "registry/test/ui/retry.ts",
              content: "const retried = true",
            },
          ],
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    render(
      <DeferredComponentSource
        name="deferred-source-retry-test"
        file="retry.ts"
        styleName="test"
      />
    )

    expect(await screen.findByText("Registry unavailable")).toBeTruthy()
    await user.click(screen.getByRole("button", { name: "Retry" }))

    expect(await screen.findByText("const retried = true")).toBeTruthy()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })
})
