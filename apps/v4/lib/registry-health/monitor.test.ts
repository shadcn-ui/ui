import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, it, vi } from "vitest"

import {
  getDryRunEnvironment,
  runLocalCliDryRun,
  runRegistryMonitor,
  type RegistryDirectoryEntry,
} from "./monitor"
import type { RegistryMonitorEntryState, RegistryMonitorState } from "./schema"

const NOW = new Date("2026-08-24T12:00:00.000Z")
const DIRECTORY: RegistryDirectoryEntry[] = [
  {
    name: "@acme",
    homepage: "https://acme.example.com",
    url: "https://acme.example.com/r/{name}.json",
    description: "Acme components",
  },
]
function createEntryState(overrides: Partial<RegistryMonitorEntryState> = {}) {
  return {
    firstObservedAt: "2026-08-01T00:00:00.000Z",
    lastSuccessfulCheck: "2026-08-24T10:00:00.000Z",
    status: "healthy",
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
    expect(bucket.challengeObservations).toBe(1)
    expect(bucket.availabilityObservations).toBe(0)
    expect(result.snapshot.registries["@acme"].monitoringLimited).toBe(true)
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
})

describe("getDryRunEnvironment", () => {
  it("allowlists process variables and excludes credentials", () => {
    const environment = getDryRunEnvironment("/tmp/registry-health-test")

    expect(environment).toMatchObject({
      CI: "1",
      NO_COLOR: "1",
      XDG_CACHE_HOME: "/tmp/registry-health-test",
      XDG_CONFIG_HOME: "/tmp/registry-health-test",
    })
    expect(environment).not.toHaveProperty("BLOB_READ_WRITE_TOKEN")
    expect(environment).not.toHaveProperty("GITHUB_TOKEN")
    expect(environment).not.toHaveProperty("GH_TOKEN")
  })
})

describe("runLocalCliDryRun", () => {
  it("force kills a CLI process that ignores SIGTERM", async () => {
    const directory = await fs.mkdtemp(
      path.join(os.tmpdir(), "registry-health-cli-test-")
    )
    const cliPath = path.join(directory, "cli.mjs")
    await fs.writeFile(
      cliPath,
      'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000)'
    )

    try {
      const result = await runLocalCliDryRun({
        namespace: "@acme",
        item: "button",
        registryUrl: DIRECTORY[0].url,
        cliPath,
        timeoutMs: 25,
        killGraceMs: 25,
      })

      expect(result).toMatchObject({
        success: false,
        failureCode: "timeout",
      })
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })
})
