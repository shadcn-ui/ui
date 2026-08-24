import { describe, expect, it } from "vitest"

import type {
  RegistryHealthDailyBucket,
  RegistryIndexObservation,
  RegistryMonitorEntryState,
} from "./schema"
import {
  calculateRegistryHealth,
  DEFAULT_GLOBAL_MEANS,
  getRegistryHealthSignals,
} from "./score"

const NOW = new Date("2026-08-24T12:00:00.000Z")

function createDailyBucket(overrides: Partial<RegistryHealthDailyBucket> = {}) {
  return {
    date: "2026-08-24",
    availabilitySuccesses: 0,
    availabilityObservations: 0,
    challengeObservations: 0,
    schemaSuccesses: 0,
    schemaObservations: 0,
    itemSuccesses: 0,
    itemObservations: 0,
    dryRunSuccesses: 0,
    dryRunObservations: 0,
    ...overrides,
  } satisfies RegistryHealthDailyBucket
}

function createIndexObservations(
  count = 25,
  outcome: RegistryIndexObservation["outcome"] = "reachable"
) {
  return Array.from({ length: count }, (_, index) => ({
    checkedAt: new Date(
      NOW.getTime() - (count - index) * 60 * 60 * 1000
    ).toISOString(),
    outcome,
    durationMs: 100,
    redirectCount: 0,
    schemaValid: outcome === "reachable",
  })) satisfies RegistryIndexObservation[]
}

function createState(overrides: Partial<RegistryMonitorEntryState> = {}) {
  return {
    firstObservedAt: "2026-08-22T10:00:00.000Z",
    lastSuccessfulCheck: "2026-08-24T11:00:00.000Z",
    status: "healthy",
    itemCursor: 0,
    itemNames: [],
    recentIndex: createIndexObservations(),
    recentDryRuns: [],
    daily: [
      createDailyBucket({
        availabilitySuccesses: 25,
        availabilityObservations: 25,
        schemaSuccesses: 25,
        schemaObservations: 25,
      }),
    ],
    latestHygiene: {
      contentTypeJson: null,
      noDuplicateNames: null,
      nameMatches: null,
    },
    ...overrides,
  } satisfies RegistryMonitorEntryState
}

describe("calculateRegistryHealth", () => {
  it("derives the published total from rounded components", () => {
    const health = calculateRegistryHealth({
      state: createState(),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.score).toBe(
      health.breakdown.reliability +
        health.breakdown.correctness +
        health.breakdown.installability +
        health.breakdown.hygiene
    )
    expect(health.score).toBeGreaterThanOrEqual(0)
    expect(health.score).toBeLessThanOrEqual(100)
    expect(health.statusReason).toEqual({
      code: "healthy_thresholds",
      message: "Recent checks are within healthy thresholds",
    })
  })

  it("explains when baseline observations are still being collected", () => {
    const health = calculateRegistryHealth({
      state: createState({ recentIndex: createIndexObservations(3) }),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.status).toBe("observing")
    expect(health.statusReason).toEqual({
      code: "collecting_baseline",
      message: "Collecting baseline data (3 of 24 checks)",
    })
  })

  it("gives unknown hygiene signals half credit", () => {
    const health = calculateRegistryHealth({
      state: createState(),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.breakdown.hygiene).toBe(6.25)
  })

  it("uses a cadence-scaled prior for weekly dry runs", () => {
    const state = createState({
      daily: [
        createDailyBucket({
          availabilitySuccesses: 25,
          availabilityObservations: 25,
          schemaSuccesses: 25,
          schemaObservations: 25,
          dryRunSuccesses: 1,
          dryRunObservations: 1,
        }),
      ],
    })
    const health = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.breakdown.installability).toBe(18.5)
  })

  it("excludes challenge observations from availability", () => {
    const state = createState({
      recentIndex: [
        ...createIndexObservations(),
        {
          checkedAt: NOW.toISOString(),
          outcome: "bot_challenge",
          durationMs: 100,
          redirectCount: 0,
        },
      ],
    })
    const signals = getRegistryHealthSignals(
      state,
      "https://example.com/{name}.json",
      NOW
    )
    const health = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(signals.availability7d).toEqual({
      successes: 25,
      observations: 25,
    })
    expect(health.monitoringLimited).toBe(true)
    expect(health.status).toBe("healthy")
  })

  it("hides a registry only after seven days unavailable", () => {
    const state = createState({
      firstObservedAt: "2026-08-01T00:00:00.000Z",
      lastSuccessfulCheck: "2026-08-16T00:00:00.000Z",
      status: "unavailable",
      recentIndex: createIndexObservations(8, "unreachable"),
    })
    const health = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.status).toBe("unavailable")
    expect(health.statusReason).toEqual({
      code: "index_unavailable",
      message: "No successful index check in the last 24 hours",
    })
    expect(health.hidden).toBe(true)
  })

  it("keeps an unavailable registry visible before seven days", () => {
    const state = createState({
      firstObservedAt: "2026-08-01T00:00:00.000Z",
      lastSuccessfulCheck: "2026-08-20T00:00:00.000Z",
      status: "unavailable",
      recentIndex: createIndexObservations(8, "unreachable"),
    })
    const health = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.status).toBe("unavailable")
    expect(health.hidden).toBe(false)
  })

  it("requires two successful checks to recover from availability degradation", () => {
    const history = createIndexObservations()
    const failures = createIndexObservations(3, "unreachable")
    const successes = createIndexObservations(2)
    const state = createState({
      status: "degraded",
      recentIndex: [...history, ...failures, successes[0]],
    })

    const recovering = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })
    const recovered = calculateRegistryHealth({
      state: { ...state, recentIndex: [...state.recentIndex, successes[1]] },
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(recovering.status).toBe("degraded")
    expect(recovering.statusReason).toEqual({
      code: "recovery_pending",
      message: "Waiting for a second successful recovery check",
    })
    expect(recovered.status).toBe("healthy")
  })

  it("explains each degraded status condition", () => {
    const failures = calculateRegistryHealth({
      state: createState({
        recentIndex: [
          ...createIndexObservations(),
          ...createIndexObservations(3, "unreachable"),
        ],
      }),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })
    const observations = createIndexObservations()
    const invalidSchema = calculateRegistryHealth({
      state: createState({
        recentIndex: [
          ...observations.slice(0, -1),
          { ...observations.at(-1)!, schemaValid: false },
        ],
      }),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })
    const invalidItems = calculateRegistryHealth({
      state: createState({
        daily: [
          createDailyBucket({
            availabilitySuccesses: 25,
            availabilityObservations: 25,
            schemaSuccesses: 25,
            schemaObservations: 25,
            itemSuccesses: 8,
            itemObservations: 10,
          }),
        ],
      }),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })
    const dryRuns = calculateRegistryHealth({
      state: createState({
        recentDryRuns: [
          {
            checkedAt: "2026-08-17T12:00:00.000Z",
            item: "button",
            success: false,
            durationMs: 100,
          },
          {
            checkedAt: "2026-08-24T12:00:00.000Z",
            item: "button",
            success: false,
            durationMs: 100,
          },
        ],
      }),
      registryUrl: "https://example.com/r/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(failures.statusReason).toEqual({
      code: "consecutive_index_failures",
      message: "The registry index failed 3 consecutive checks",
    })
    expect(invalidSchema.statusReason).toEqual({
      code: "index_schema_invalid",
      message: "The registry index failed schema validation",
    })
    expect(invalidItems.statusReason).toEqual({
      code: "item_validation_failures",
      message: "Sampled registry items are failing validation",
    })
    expect(dryRuns.statusReason).toEqual({
      code: "dry_run_failures",
      message: "The last two CLI dry-run checks failed",
    })
  })

  it("recovers correctness degradation when its condition clears", () => {
    const state = createState({
      status: "degraded",
      recentIndex: createIndexObservations(),
    })

    const health = calculateRegistryHealth({
      state,
      registryUrl: "https://example.com/{name}.json",
      globalMeans: DEFAULT_GLOBAL_MEANS,
      now: NOW,
    })

    expect(health.status).toBe("healthy")
  })
})
