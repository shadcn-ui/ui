import { describe, expect, it } from "vitest"

import { registryMonitorEntryStateSchema } from "./schema"

describe("registryMonitorEntryStateSchema", () => {
  it("migrates legacy availability recovery state from retained history", () => {
    const failures = Array.from({ length: 3 }, (_, index) => ({
      checkedAt: `2026-08-16T0${index}:00:00.000Z`,
      outcome: "unreachable" as const,
      durationMs: 100,
      redirectCount: 0,
    }))
    const recovery = {
      checkedAt: "2026-08-24T11:00:00.000Z",
      outcome: "reachable" as const,
      durationMs: 100,
      redirectCount: 0,
      schemaValid: true,
    }

    const state = registryMonitorEntryStateSchema.parse({
      firstObservedAt: "2026-08-01T00:00:00.000Z",
      lastSuccessfulCheck: recovery.checkedAt,
      status: "unavailable",
      itemCursor: 0,
      itemNames: [],
      recentIndex: [...failures, recovery],
      recentDryRuns: [],
      daily: [],
      latestHygiene: {
        contentTypeJson: true,
        noDuplicateNames: true,
        nameMatches: true,
      },
    })

    expect(state).toMatchObject({
      consecutiveSuccessfulIndexes: 1,
      consecutiveIndexFailures: 0,
      availabilityOutageSince: failures[0].checkedAt,
      availabilityRecoveryRequired: true,
    })
  })

  it("preserves the last success as the start of a legacy outage", () => {
    const lastSuccessfulCheck = "2026-08-23T08:00:00.000Z"
    const state = registryMonitorEntryStateSchema.parse({
      firstObservedAt: "2026-08-01T00:00:00.000Z",
      lastSuccessfulCheck,
      status: "degraded",
      itemCursor: 0,
      itemNames: [],
      recentIndex: Array.from({ length: 3 }, (_, index) => ({
        checkedAt: `2026-08-24T0${index}:00:00.000Z`,
        outcome: "unreachable" as const,
        durationMs: 100,
        redirectCount: 0,
      })),
      recentDryRuns: [],
      daily: [],
      latestHygiene: {
        contentTypeJson: true,
        noDuplicateNames: true,
        nameMatches: true,
      },
    })

    expect(state).toMatchObject({
      consecutiveSuccessfulIndexes: 0,
      consecutiveIndexFailures: 3,
      availabilityOutageSince: lastSuccessfulCheck,
      availabilityRecoveryRequired: true,
    })
  })
})
