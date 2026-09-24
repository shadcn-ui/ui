import { describe, expect, it, vi } from "vitest"

import type { RegistryDirectoryEntry } from "../registry-directory"
import { runRegistryMonitor } from "./monitor"
import {
  REGISTRY_DRY_RUN_VERSION,
  type RegistryMonitorEntryState,
  type RegistryMonitorState,
} from "./schema"

const NOW = new Date("2026-08-24T12:00:00.000Z")
const DIRECTORY: RegistryDirectoryEntry[] = [
  {
    name: "@acme",
    homepage: "https://acme.example.com",
    url: "https://acme.example.com/r/{name}.json",
    description: "Acme components",
    logo: "https://acme.example.com/logo.svg",
  },
]
function createEntryState(overrides: Partial<RegistryMonitorEntryState> = {}) {
  return {
    firstObservedAt: "2026-08-01T00:00:00.000Z",
    lastSuccessfulCheck: "2026-08-24T10:00:00.000Z",
    status: "healthy",
    consecutiveSuccessfulIndexes: 0,
    consecutiveIndexFailures: 0,
    availabilityRecoveryRequired: false,
    itemCursor: 0,
    itemNames: [],
    recentIndex: [],
    recentDryRuns: [],
    daily: [],
    latestHygiene: {
      contentTypeJson: null,
      noDuplicateNames: null,
      nameMatches: null,
    },
    ...overrides,
  } satisfies RegistryMonitorEntryState
}

function createState(entry = createEntryState()) {
  return {
    schemaVersion: 1,
    scoreVersion: 1,
    dryRunVersion: REGISTRY_DRY_RUN_VERSION,
    updatedAt: "2026-08-24T10:00:00.000Z",
    registries: { "@acme": entry },
  } satisfies RegistryMonitorState
}

function createSuccessfulFetch(itemCount = 1) {
  return {
    ok: true as const,
    json: {
      name: "acme",
      homepage: "https://acme.example.com",
      items: Array.from({ length: itemCount }, (_, index) => ({
        name: `item-${index}`,
        type: "registry:ui",
        files: [],
      })),
    },
    status: 200,
    durationMs: 120,
    responseSize: 500,
    contentType: "application/json; charset=utf-8",
    redirectCount: 0,
    finalUrl: "https://acme.example.com/r/registry.json",
  }
}

describe("runRegistryMonitor", () => {
  it("records completion separately from the observation time", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-24T12:05:00.000Z"))

    try {
      const result = await runRegistryMonitor({
        directory: DIRECTORY,
        mode: "hourly",
        now: NOW,
        fetchJson: vi.fn(async () => createSuccessfulFetch()),
        runDryRun: vi.fn(),
      })

      expect(result.run.startedAt).toBe(NOW.toISOString())
      expect(result.run.completedAt).toBe("2026-08-24T12:05:00.000Z")
    } finally {
      vi.useRealTimers()
    }
  })

  it("records a successful hourly index observation", async () => {
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => createSuccessfulFetch(2)),
      runDryRun: vi.fn(),
    })

    expect(result.run.totals).toMatchObject({
      registries: 1,
      reachable: 1,
      unavailable: 0,
      challenges: 0,
    })
    expect(result.state.registries["@acme"].itemNames).toEqual([
      "item-0",
      "item-1",
    ])
    expect(result.snapshot.registries["@acme"]).toMatchObject({
      status: "observing",
      monitoringLimited: false,
      checkedAt: NOW.toISOString(),
    })
  })

  it("starts an outage from the last successful index check", async () => {
    const lastSuccessfulCheck = "2026-08-23T11:00:00.000Z"
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(
        createEntryState({
          firstObservedAt: "2026-08-01T00:00:00.000Z",
          lastSuccessfulCheck,
          consecutiveSuccessfulIndexes: 24,
        })
      ),
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => ({
        ok: false as const,
        failureCode: "timeout",
        reachable: false,
        botChallenge: false,
        durationMs: 100,
        redirectCount: 0,
        finalUrl: "https://acme.example.com/r/registry.json",
      })),
      runDryRun: vi.fn(),
    })

    expect(result.state.registries["@acme"]).toMatchObject({
      consecutiveSuccessfulIndexes: 0,
      consecutiveIndexFailures: 1,
      availabilityOutageSince: lastSuccessfulCheck,
      availabilityRecoveryRequired: true,
    })
    expect(result.snapshot.registries["@acme"].status).toBe("unavailable")
  })

  it("clears availability recovery after two valid index checks", async () => {
    const outageSince = "2026-08-16T00:00:00.000Z"
    const recentIndex = Array.from({ length: 24 }, (_, index) => ({
      checkedAt: new Date(
        NOW.getTime() - (24 - index) * 60 * 60 * 1000
      ).toISOString(),
      outcome: "unreachable" as const,
      durationMs: 100,
      redirectCount: 0,
    }))
    const previousState = createState(
      createEntryState({
        firstObservedAt: "2026-08-01T00:00:00.000Z",
        lastSuccessfulCheck: "2026-08-15T23:00:00.000Z",
        status: "unavailable",
        consecutiveSuccessfulIndexes: 0,
        consecutiveIndexFailures: 24,
        availabilityOutageSince: outageSince,
        availabilityRecoveryRequired: true,
        recentIndex,
      })
    )

    const first = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => createSuccessfulFetch()),
      runDryRun: vi.fn(),
    })
    const recovering = first.state.registries["@acme"]

    expect(recovering).toMatchObject({
      consecutiveSuccessfulIndexes: 1,
      consecutiveIndexFailures: 0,
      availabilityOutageSince: outageSince,
      availabilityRecoveryRequired: true,
    })
    expect(first.snapshot.registries["@acme"]).toMatchObject({
      status: "unavailable",
      hidden: true,
    })

    const second = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: first.state,
      mode: "hourly",
      now: new Date("2026-08-24T13:00:00.000Z"),
      fetchJson: vi.fn(async () => createSuccessfulFetch()),
      runDryRun: vi.fn(),
    })
    const recovered = second.state.registries["@acme"]

    expect(recovered).toMatchObject({
      consecutiveSuccessfulIndexes: 2,
      consecutiveIndexFailures: 0,
      availabilityRecoveryRequired: false,
    })
    expect(recovered).not.toHaveProperty("availabilityOutageSince")
    expect(second.snapshot.registries["@acme"].status).toBe("healthy")
  })

  it("records a challenge without lowering availability", async () => {
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(),
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => ({
        ok: false as const,
        failureCode: "bot_challenge",
        reachable: false,
        botChallenge: true,
        status: 403,
        durationMs: 80,
        responseSize: 200,
        contentType: "text/html",
        redirectCount: 0,
        finalUrl: "https://acme.example.com/r/registry.json",
      })),
      runDryRun: vi.fn(),
    })

    const bucket = result.state.registries["@acme"].daily[0]
    const state = result.state.registries["@acme"]
    expect(bucket.challengeObservations).toBe(1)
    expect(bucket.availabilityObservations).toBe(0)
    expect(state).toMatchObject({
      consecutiveSuccessfulIndexes: 0,
      consecutiveIndexFailures: 0,
      availabilityRecoveryRequired: false,
    })
    expect(state).not.toHaveProperty("availabilityOutageSince")
    expect(result.snapshot.registries["@acme"].monitoringLimited).toBe(true)
  })

  it("allows an existing outage to become unavailable during a challenge", async () => {
    const outageSince = "2026-08-23T11:00:00.000Z"
    const previousState = createState(
      createEntryState({
        firstObservedAt: "2026-08-01T00:00:00.000Z",
        lastSuccessfulCheck: outageSince,
        consecutiveIndexFailures: 1,
        availabilityOutageSince: outageSince,
        recentIndex: [
          {
            checkedAt: outageSince,
            outcome: "unreachable",
            durationMs: 100,
            redirectCount: 0,
          },
        ],
      })
    )
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => ({
        ok: false as const,
        failureCode: "bot_challenge",
        reachable: false,
        botChallenge: true,
        status: 403,
        durationMs: 80,
        responseSize: 200,
        contentType: "text/html",
        redirectCount: 0,
        finalUrl: "https://acme.example.com/r/registry.json",
      })),
      runDryRun: vi.fn(),
    })

    expect(result.state.registries["@acme"]).toMatchObject({
      consecutiveIndexFailures: 1,
      availabilityOutageSince: outageSince,
      availabilityRecoveryRequired: false,
    })
    expect(result.snapshot.registries["@acme"]).toMatchObject({
      status: "unavailable",
      monitoringLimited: true,
    })
  })

  it("refreshes hygiene after a reachable invalid index", async () => {
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(
        createEntryState({
          latestHygiene: {
            contentTypeJson: true,
            noDuplicateNames: true,
            nameMatches: true,
          },
        })
      ),
      mode: "hourly",
      now: NOW,
      fetchJson: vi.fn(async () => ({
        ...createSuccessfulFetch(),
        json: { invalid: true },
        contentType: "text/plain",
      })),
      runDryRun: vi.fn(),
    })

    expect(result.state.registries["@acme"].latestHygiene).toEqual({
      contentTypeJson: false,
      noDuplicateNames: null,
      nameMatches: null,
    })
  })

  it("rotates enough daily items to cover a catalog in thirty days", async () => {
    const itemNames = Array.from({ length: 61 }, (_, index) => `item-${index}`)
    const fetchJson = vi.fn(async (url: string) => {
      const item = url.match(/item-\d+/)?.[0] ?? "item-0"
      return {
        ...createSuccessfulFetch(),
        json: { name: item, type: "registry:ui", files: [] },
        finalUrl: url,
      }
    })
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(createEntryState({ itemNames })),
      mode: "daily",
      now: NOW,
      fetchJson,
      runDryRun: vi.fn(),
    })

    expect(fetchJson).toHaveBeenCalledTimes(3)
    expect(result.state.registries["@acme"].itemCursor).toBe(3)
    expect(result.run.totals.itemChecks).toBe(3)
    expect(result.run.results["@acme"].items).toHaveLength(3)
    expect(result.state.lastDailyRunAt).toBe(NOW.toISOString())
  })

  it("excludes item challenges from validation rates", async () => {
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(
        createEntryState({
          itemNames: ["button"],
          daily: [
            {
              date: "2026-08-24",
              availabilitySuccesses: 0,
              availabilityObservations: 0,
              challengeObservations: 0,
              schemaSuccesses: 0,
              schemaObservations: 0,
              itemSuccesses: 8,
              itemObservations: 9,
              dryRunSuccesses: 0,
              dryRunObservations: 0,
            },
          ],
        })
      ),
      mode: "daily",
      now: NOW,
      fetchJson: vi.fn(async () => ({
        ok: false as const,
        failureCode: "bot_challenge",
        reachable: false,
        botChallenge: true,
        status: 403,
        durationMs: 80,
        responseSize: 200,
        contentType: "text/html",
        redirectCount: 0,
        finalUrl: "https://acme.example.com/r/button.json",
      })),
      runDryRun: vi.fn(),
    })

    const bucket = result.state.registries["@acme"].daily[0]
    expect(bucket.itemObservations).toBe(9)
    expect(bucket.itemSuccesses).toBe(8)
    expect(result.run.totals).toMatchObject({
      challenges: 1,
      itemChecks: 1,
    })
  })

  it("runs one rotating weekly dry-run item", async () => {
    const runDryRun = vi.fn(async () => ({
      success: true,
      durationMs: 250,
    }))
    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(
        createEntryState({ itemNames: ["button", "dialog"] })
      ),
      mode: "weekly",
      now: NOW,
      fetchJson: vi.fn(),
      runDryRun,
    })

    expect(runDryRun).toHaveBeenCalledWith({
      namespace: "@acme",
      item: "button",
      registryUrl: DIRECTORY[0].url,
    })
    expect(result.run.totals.dryRuns).toBe(1)
    expect(result.state.registries["@acme"].recentDryRuns).toHaveLength(1)
    expect(result.state.lastWeeklyRunAt).toBe(NOW.toISOString())
  })

  it("discards invalid pre-tsconfig dry runs and reruns the weekly check", async () => {
    const now = new Date("2026-09-02T12:00:00.000Z")
    const recentIndex = Array.from({ length: 24 }, (_, index) => ({
      checkedAt: new Date(
        now.getTime() - (24 - index) * 60 * 60 * 1000
      ).toISOString(),
      outcome: "reachable" as const,
      status: 200,
      durationMs: 100,
      redirectCount: 0,
      schemaValid: true,
    }))
    const previousState = {
      ...createState(
        createEntryState({
          itemNames: ["button"],
          recentIndex,
          recentDryRuns: [
            {
              checkedAt: "2026-08-25T12:04:27.443Z",
              item: "button",
              success: false,
              failureCode: "exit_1",
              durationMs: 1500,
            },
            {
              checkedAt: "2026-08-31T12:38:36.084Z",
              item: "dialog",
              success: false,
              failureCode: "exit_1",
              durationMs: 1700,
            },
          ],
          daily: [
            {
              date: "2026-08-25",
              availabilitySuccesses: 0,
              availabilityObservations: 0,
              challengeObservations: 0,
              schemaSuccesses: 0,
              schemaObservations: 0,
              itemSuccesses: 0,
              itemObservations: 0,
              dryRunSuccesses: 0,
              dryRunObservations: 1,
            },
            {
              date: "2026-08-31",
              availabilitySuccesses: 0,
              availabilityObservations: 0,
              challengeObservations: 0,
              schemaSuccesses: 0,
              schemaObservations: 0,
              itemSuccesses: 0,
              itemObservations: 0,
              dryRunSuccesses: 0,
              dryRunObservations: 1,
            },
          ],
          latestHygiene: {
            contentTypeJson: true,
            noDuplicateNames: true,
            nameMatches: true,
          },
        })
      ),
      dryRunVersion: 0,
      lastDailyRunAt: "2026-09-02T11:00:00.000Z",
      lastWeeklyRunAt: "2026-08-31T12:38:36.084Z",
    }
    const runDryRun = vi.fn(async () => ({
      success: true,
      durationMs: 250,
    }))

    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "auto",
      now,
      fetchJson: vi.fn(async () => createSuccessfulFetch()),
      runDryRun,
    })

    expect(runDryRun).toHaveBeenCalledOnce()
    expect(result.state.registries["@acme"].recentDryRuns).toEqual([
      {
        checkedAt: now.toISOString(),
        item: "item-0",
        success: true,
        durationMs: 250,
      },
    ])
    expect(result.state.registries["@acme"].daily.slice(0, 2)).toMatchObject([
      { date: "2026-08-25", dryRunSuccesses: 0, dryRunObservations: 0 },
      { date: "2026-08-31", dryRunSuccesses: 0, dryRunObservations: 0 },
    ])
    expect(result.state.lastWeeklyRunAt).toBe(now.toISOString())
    expect(result.run.diagnostics).toEqual([
      "Discarded 2 invalid CLI dry-run observations from the pre-tsconfig scaffold.",
    ])
    expect(result.snapshot.registries["@acme"]).toMatchObject({
      status: "healthy",
      breakdown: { installability: 18.5 },
    })
  })

  it("continues weekly rotation after dry-run history is trimmed", async () => {
    const runDryRun = vi.fn(async () => ({
      success: true,
      durationMs: 250,
    }))
    const recentDryRuns = Array.from({ length: 12 }, (_, index) => ({
      checkedAt: `2026-08-${String(index + 1).padStart(2, "0")}T12:00:00.000Z`,
      item: index === 11 ? "dialog" : "button",
      success: true,
      durationMs: 250,
    }))

    await runRegistryMonitor({
      directory: DIRECTORY,
      previousState: createState(
        createEntryState({
          itemNames: ["button", "dialog", "tooltip"],
          recentDryRuns,
        })
      ),
      mode: "weekly",
      now: NOW,
      fetchJson: vi.fn(),
      runDryRun,
    })

    expect(runDryRun).toHaveBeenCalledWith({
      namespace: "@acme",
      item: "tooltip",
      registryUrl: DIRECTORY[0].url,
    })
  })

  it("runs delayed auto checks using their last run timestamps", async () => {
    const previousState = {
      ...createState(createEntryState({ itemNames: ["button"] })),
      lastDailyRunAt: "2026-08-23T15:00:00.000Z",
      lastWeeklyRunAt: "2026-08-18T12:00:00.000Z",
    }
    const fetchJson = vi.fn(async (url: string) =>
      url.endsWith("/registry.json")
        ? createSuccessfulFetch()
        : {
            ...createSuccessfulFetch(),
            json: { name: "item-0", type: "registry:ui", files: [] },
            finalUrl: url,
          }
    )
    const runDryRun = vi.fn(async () => ({
      success: true,
      durationMs: 250,
    }))

    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "auto",
      now: NOW,
      fetchJson,
      runDryRun,
    })

    expect(result.run.totals.itemChecks).toBe(1)
    expect(result.run.totals.dryRuns).toBe(1)
    expect(result.state.lastDailyRunAt).toBe(NOW.toISOString())
    expect(result.state.lastWeeklyRunAt).toBe(NOW.toISOString())
  })

  it("skips auto checks until their elapsed intervals", async () => {
    const previousState = {
      ...createState(createEntryState({ itemNames: ["button"] })),
      lastDailyRunAt: "2026-08-23T17:00:00.000Z",
      lastWeeklyRunAt: "2026-08-19T12:00:00.000Z",
    }

    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "auto",
      now: NOW,
      fetchJson: vi.fn(async () => createSuccessfulFetch()),
      runDryRun: vi.fn(),
    })

    expect(result.run.totals.itemChecks).toBe(0)
    expect(result.run.totals.dryRuns).toBe(0)
    expect(result.state.lastDailyRunAt).toBe(previousState.lastDailyRunAt)
    expect(result.state.lastWeeklyRunAt).toBe(previousState.lastWeeklyRunAt)
  })

  it("runs auto checks for state without last run timestamps", async () => {
    const previousState = createState(
      createEntryState({ itemNames: ["button"] })
    )
    const fetchJson = vi.fn(async (url: string) =>
      url.endsWith("/registry.json")
        ? createSuccessfulFetch()
        : {
            ...createSuccessfulFetch(),
            json: { name: "item-0", type: "registry:ui", files: [] },
            finalUrl: url,
          }
    )

    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "auto",
      now: NOW,
      fetchJson,
      runDryRun: vi.fn(async () => ({
        success: true,
        durationMs: 250,
      })),
    })

    expect(result.run.totals.itemChecks).toBe(1)
    expect(result.run.totals.dryRuns).toBe(1)
    expect(result.state.lastDailyRunAt).toBe(NOW.toISOString())
    expect(result.state.lastWeeklyRunAt).toBe(NOW.toISOString())
  })

  it("runs auto checks when last run timestamps are in the future", async () => {
    const previousState = {
      ...createState(createEntryState({ itemNames: ["button"] })),
      lastDailyRunAt: "2026-08-25T12:00:00.000Z",
      lastWeeklyRunAt: "2026-08-25T12:00:00.000Z",
    }

    const result = await runRegistryMonitor({
      directory: DIRECTORY,
      previousState,
      mode: "auto",
      now: NOW,
      fetchJson: vi.fn(async () => createSuccessfulFetch()),
      runDryRun: vi.fn(async () => ({
        success: true,
        durationMs: 250,
      })),
    })

    expect(result.run.totals.itemChecks).toBe(1)
    expect(result.run.totals.dryRuns).toBe(1)
    expect(result.state.lastDailyRunAt).toBe(NOW.toISOString())
    expect(result.state.lastWeeklyRunAt).toBe(NOW.toISOString())
  })

  it("limits concurrent CLI dry runs to four", async () => {
    const directory = Array.from({ length: 6 }, (_, index) => ({
      name: `@registry${index}`,
      homepage: `https://registry${index}.example.com`,
      url: `https://registry${index}.example.com/r/{name}.json`,
      description: `Registry ${index}`,
      logo: `https://registry${index}.example.com/logo.svg`,
    }))
    const previousState: RegistryMonitorState = {
      schemaVersion: 1,
      scoreVersion: 1,
      updatedAt: "2026-08-24T10:00:00.000Z",
      registries: Object.fromEntries(
        directory.map((entry) => [
          entry.name,
          createEntryState({ itemNames: ["button"] }),
        ])
      ),
    }
    let active = 0
    let maximumActive = 0
    const runDryRun = vi.fn(async () => {
      active += 1
      maximumActive = Math.max(maximumActive, active)
      await new Promise((resolve) => setTimeout(resolve, 20))
      active -= 1
      return { success: true, durationMs: 20 }
    })

    const result = await runRegistryMonitor({
      directory,
      previousState,
      mode: "weekly",
      now: NOW,
      fetchJson: vi.fn(),
      runDryRun,
    })

    expect(result.run.totals.dryRuns).toBe(6)
    expect(maximumActive).toBe(4)
  })

  it("resolves {style} urls with the default style", async () => {
    const fetchJson = vi.fn(async () => createSuccessfulFetch())
    await runRegistryMonitor({
      directory: [
        {
          ...DIRECTORY[0],
          url: "https://acme.example.com/r/{style}/{name}.json",
        },
      ],
      mode: "daily",
      now: NOW,
      previousState: createState(createEntryState({ itemNames: ["button"] })),
      fetchJson,
      runDryRun: vi.fn(),
    })

    expect(fetchJson).toHaveBeenCalledWith(
      "https://acme.example.com/r/radix-vega/button.json"
    )
  })
})
