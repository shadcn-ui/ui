import { afterEach, describe, expect, it } from "vitest"

import {
  clearRegistryContext,
  getRegistryEnvFromContext,
  getRegistryHeadersFromContext,
  setRegistryHeaders,
  withRegistryContext,
} from "./context"

afterEach(() => {
  clearRegistryContext()
})

describe("registry context", () => {
  it("isolates headers between concurrent operations", async () => {
    const url = "https://example.com/item.json"
    const results = await runConcurrently(
      ["first", "second"],
      async (token, waitForOtherOperations) => {
        setRegistryHeaders({
          [url]: {
            Authorization: `Bearer ${token}`,
          },
        })
        await waitForOtherOperations()

        return getRegistryHeadersFromContext(url).Authorization
      }
    )

    expect(results).toEqual(["Bearer first", "Bearer second"])
  })

  it("isolates environment variables between concurrent operations", async () => {
    const results = await runConcurrently(
      ["first", "second"],
      async (_token, waitForOtherOperations) => {
        await waitForOtherOperations()

        return getRegistryEnvFromContext("REGISTRY_TOKEN")
      }
    )

    expect(results).toEqual(["first", "second"])
  })
})

async function runConcurrently<T>(
  values: string[],
  callback: (
    value: string,
    waitForOtherOperations: () => Promise<void>
  ) => Promise<T>
) {
  let ready = 0
  let release!: () => void
  const barrier = new Promise<void>((resolve) => {
    release = resolve
  })

  return Promise.all(
    values.map((value) =>
      withRegistryContext(
        () =>
          callback(value, async () => {
            ready++
            if (ready === values.length) {
              release()
            }
            await barrier
          }),
        {
          env: {
            REGISTRY_TOKEN: value,
          },
        }
      )
    )
  )
}
