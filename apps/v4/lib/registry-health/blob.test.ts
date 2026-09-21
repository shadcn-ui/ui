import { describe, expect, it, vi } from "vitest"

import {
  cleanRegistryHealthHistory,
  loadRegistryHealthSnapshot,
  loadRegistryMonitorState,
  publishRegistryHealth,
  type BlobOperations,
} from "./blob"
import type {
  RegistryHealthSnapshot,
  RegistryMonitorRun,
  RegistryMonitorState,
} from "./schema"

function streamJson(value: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  })
}

function createOperations(overrides: Partial<BlobOperations> = {}) {
  return {
    get: vi.fn(async () => null),
    put: vi.fn(async (pathname) => ({
      url: `https://blob.example.com/${pathname}`,
    })),
    list: vi.fn(async () => ({ blobs: [], hasMore: false })),
    del: vi.fn(async () => {}),
    ...overrides,
  } satisfies BlobOperations
}

const STATE: RegistryMonitorState = {
  schemaVersion: 1,
  scoreVersion: 1,
  updatedAt: "2026-08-24T12:00:00.000Z",
  registries: {},
}

const SNAPSHOT: RegistryHealthSnapshot = {
  schemaVersion: 1,
  scoreVersion: 1,
  generatedAt: "2026-08-24T12:00:00.000Z",
  globalMeans: {
    availability7d: 0.85,
    availability30d: 0.85,
    indexSchema: 0.9,
    itemValidity: 0.9,
    dryRun: 0.9,
  },
  registries: {},
}

const RUN: RegistryMonitorRun = {
  schemaVersion: 1,
  startedAt: "2026-08-24T12:00:00.000Z",
  completedAt: "2026-08-24T12:01:00.000Z",
  mode: "hourly",
  totals: {
    registries: 0,
    reachable: 0,
    unavailable: 0,
    challenges: 0,
    itemChecks: 0,
    dryRuns: 0,
  },
  results: {},
  diagnostics: [],
}

describe("loadRegistryMonitorState", () => {
  it("returns null on the first run", async () => {
    const state = await loadRegistryMonitorState({
      token: "test-token",
      operations: createOperations(),
    })

    expect(state).toBeNull()
  })

  it("validates stored state before using it", async () => {
    const operations = createOperations({
      get: vi.fn(async () => ({ stream: streamJson(STATE) })),
    })

    await expect(
      loadRegistryMonitorState({ token: "test-token", operations })
    ).resolves.toEqual(STATE)
    expect(operations.get).toHaveBeenCalledWith(
      "registry-health/v1/state.json",
      {
        access: "private",
        token: "test-token",
        useCache: false,
      }
    )
  })
})

describe("loadRegistryHealthSnapshot", () => {
  it("reads and validates the private latest snapshot", async () => {
    const abortController = new AbortController()
    const operations = createOperations({
      get: vi.fn(async () => ({ stream: streamJson(SNAPSHOT) })),
    })

    await expect(
      loadRegistryHealthSnapshot({
        token: "test-token",
        storeId: "test-store-id",
        abortSignal: abortController.signal,
        operations,
      })
    ).resolves.toEqual(SNAPSHOT)
    expect(operations.get).toHaveBeenCalledWith(
      "registry-health/v1/latest.json",
      {
        access: "private",
        token: "test-token",
        storeId: "test-store-id",
        useCache: false,
        abortSignal: abortController.signal,
      }
    )
  })

  it("rejects an invalid latest snapshot", async () => {
    const operations = createOperations({
      get: vi.fn(async () => ({
        stream: streamJson({ ...SNAPSHOT, schemaVersion: 2 }),
      })),
    })

    await expect(
      loadRegistryHealthSnapshot({ token: "test-token", operations })
    ).rejects.toThrow()
  })
})

describe("publishRegistryHealth", () => {
  it("publishes immutable history before overwriting state and latest", async () => {
    const operations = createOperations()
    const result = await publishRegistryHealth({
      state: STATE,
      snapshot: SNAPSHOT,
      run: RUN,
      token: "test-token",
      operations,
    })
    const calls = vi.mocked(operations.put).mock.calls

    expect(calls.map(([pathname]) => pathname)).toEqual([
      "registry-health/v1/runs/2026-08-24T12-00-00-000Z.json",
      "registry-health/v1/daily/2026-08-24.json",
      "registry-health/v1/state.json",
      "registry-health/v1/latest.json",
    ])
    expect(calls[0][2].allowOverwrite).toBe(false)
    expect(calls[2][2].allowOverwrite).toBe(true)
    expect(calls[3][2].allowOverwrite).toBe(true)
    expect(calls.every(([, , options]) => options.access === "private")).toBe(
      true
    )
    expect(result.latestPath).toBe("registry-health/v1/latest.json")
  })
})

describe("cleanRegistryHealthHistory", () => {
  it("paginates listings and deletes expired history", async () => {
    const list = vi
      .fn()
      .mockResolvedValueOnce({
        blobs: [
          {
            pathname: "registry-health/v1/runs/old.json",
            uploadedAt: new Date("2026-08-01T00:00:00.000Z"),
          },
        ],
        cursor: "next",
        hasMore: true,
      })
      .mockResolvedValueOnce({ blobs: [], hasMore: false })
      .mockResolvedValueOnce({ blobs: [], hasMore: false })
    const operations = createOperations({ list })

    const result = await cleanRegistryHealthHistory({
      token: "test-token",
      now: new Date("2026-08-24T12:00:00.000Z"),
      operations,
    })

    expect(list).toHaveBeenCalledTimes(3)
    expect(operations.del).toHaveBeenCalledWith(
      ["registry-health/v1/runs/old.json"],
      { token: "test-token" }
    )
    expect(result.deleted).toBe(1)
  })
})
