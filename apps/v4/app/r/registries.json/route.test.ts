import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { loadRegistryHealthSnapshot } from "@/lib/registry-health/blob"
import type {
  RegistryHealth,
  RegistryHealthSnapshot,
} from "@/lib/registry-health/schema"
import directory from "@/registry/directory.json"

import { dynamic, GET, revalidate } from "./route"

vi.mock("@/lib/registry-health/blob", () => ({
  loadRegistryHealthSnapshot: vi.fn(),
}))

const GENERATED_AT = "2026-08-24T12:00:00.000Z"
const loadSnapshot = vi.mocked(loadRegistryHealthSnapshot)

function createHealth(overrides: Partial<RegistryHealth> = {}) {
  return {
    schemaVersion: 1,
    scoreVersion: 1,
    status: "healthy",
    statusReason: {
      code: "healthy_thresholds",
      message: "Recent checks are within healthy thresholds",
    },
    score: 90,
    breakdown: {
      reliability: 40,
      correctness: 23,
      installability: 18,
      hygiene: 9,
    },
    availability7d: 0.99,
    availability30d: 0.98,
    monitoringLimited: false,
    firstObservedAt: "2026-08-01T00:00:00.000Z",
    checkedAt: GENERATED_AT,
    lastSuccessfulCheck: GENERATED_AT,
    hidden: false,
    ...overrides,
  } satisfies RegistryHealth
}

function createSnapshot(registries: RegistryHealthSnapshot["registries"]) {
  return {
    schemaVersion: 1,
    scoreVersion: 1,
    generatedAt: GENERATED_AT,
    globalMeans: {
      availability7d: 0.85,
      availability30d: 0.85,
      indexSchema: 0.9,
      itemValidity: 0.9,
      dryRun: 0.9,
    },
    registries,
  } satisfies RegistryHealthSnapshot
}

describe("GET /r/registries.json", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-24T13:00:00.000Z"))
    vi.stubEnv("REGISTRY_HEALTH_ENABLED", "1")
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-token")
    loadSnapshot.mockReset()
    vi.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("uses static ISR so requests do not read Blob directly", () => {
    expect(dynamic).toBe("force-static")
    expect(revalidate).toBe(300)
  })

  it("merges fresh health by exact namespace", async () => {
    const first = directory[0]
    loadSnapshot.mockResolvedValue(
      createSnapshot({ [first.name]: createHealth() })
    )

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload[0]).toMatchObject({
      name: first.name,
      homepage: first.homepage,
      url: first.url,
      description: first.description,
      health: {
        score: 90,
        statusReason: {
          code: "healthy_thresholds",
          message: "Recent checks are within healthy thresholds",
        },
      },
    })
    expect(loadSnapshot).toHaveBeenCalledWith({
      token: "test-token",
      abortSignal: expect.any(AbortSignal),
    })
  })

  it("synthesizes observing health without firstObservedAt", async () => {
    loadSnapshot.mockResolvedValue(createSnapshot({}))

    const response = await GET()
    const payload = await response.json()

    expect(payload[0].health).toMatchObject({
      status: "observing",
      statusReason: {
        code: "collecting_baseline",
        message: "Collecting baseline data (0 of 24 checks)",
      },
      checkedAt: GENERATED_AT,
      hidden: false,
    })
    expect(payload[0].health).not.toHaveProperty("firstObservedAt")
  })

  it("returns the original payload when health is disabled", async () => {
    vi.stubEnv("REGISTRY_HEALTH_ENABLED", "0")

    const response = await GET()
    const payload = await response.json()

    expect(loadSnapshot).not.toHaveBeenCalled()
    expect(payload[0]).toEqual({
      name: directory[0].name,
      homepage: directory[0].homepage,
      url: directory[0].url,
      description: directory[0].description,
    })
  })

  it("fails open for a stale snapshot", async () => {
    vi.setSystemTime(new Date("2026-08-25T00:00:00.000Z"))
    loadSnapshot.mockResolvedValue(createSnapshot({}))

    const response = await GET()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload[0]).not.toHaveProperty("health")
  })

  it.each(["a malformed snapshot", "an unknown version", "a Blob 500"])(
    "fails open for %s",
    async (failure) => {
      loadSnapshot.mockRejectedValue(new Error(failure))

      const response = await GET()
      const payload = await response.json()

      expect(response.status).toBe(200)
      expect(payload[0]).not.toHaveProperty("health")
    }
  )

  it("fails open when the snapshot request times out", async () => {
    loadSnapshot.mockImplementation(
      ({ abortSignal }) =>
        new Promise((_resolve, reject) => {
          abortSignal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"))
          })
        })
    )

    const responsePromise = GET()
    await vi.advanceTimersByTimeAsync(2500)
    const response = await responsePromise
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload[0]).not.toHaveProperty("health")
  })

  it("fails open when the snapshot is missing", async () => {
    loadSnapshot.mockResolvedValue(null)

    const response = await GET()
    const payload = await response.json()

    expect(payload[0]).not.toHaveProperty("health")
  })
})
