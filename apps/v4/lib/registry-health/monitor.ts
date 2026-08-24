import { registryItemSchema, registrySchema } from "shadcn/schema"

import {
  normalizeRegistryName,
  type RegistryDirectoryEntry,
} from "../registry-directory"
import { fetchRegistryJson, type RegistryJsonResult } from "./network"
import {
  REGISTRY_HEALTH_SCHEMA_VERSION,
  REGISTRY_HEALTH_SCORE_VERSION,
  registryHealthSnapshotSchema,
  registryMonitorRunSchema,
  registryMonitorStateSchema,
  type RegistryDryRunObservation,
  type RegistryHealthDailyBucket,
  type RegistryHealthSnapshot,
  type RegistryIndexObservation,
  type RegistryItemObservation,
  type RegistryMonitorEntryState,
  type RegistryMonitorOutput,
  type RegistryMonitorRun,
  type RegistryMonitorState,
} from "./schema"
import { calculateGlobalMeans, calculateRegistryHealth } from "./score"
import { createRegistryMonitorEntryState } from "./state"

const DAY_MS = 24 * 60 * 60 * 1000
const RECENT_INDEX_RETENTION_MS = 8 * DAY_MS
const DAILY_CHECK_INTERVAL_MS = 20 * 60 * 60 * 1000
const WEEKLY_CHECK_INTERVAL_MS = 6 * DAY_MS
const MAX_DRY_RUN_CONCURRENCY = 4

export type RegistryMonitorMode = RegistryMonitorRun["mode"]

export type RegistryDryRunResult = {
  success: boolean
  failureCode?: string
  durationMs: number
}

function createDailyBucket(date: string) {
  return {
    date,
    availabilitySuccesses: 0,
    availabilityObservations: 0,
    challengeObservations: 0,
    schemaSuccesses: 0,
    schemaObservations: 0,
    itemSuccesses: 0,
    itemObservations: 0,
    dryRunSuccesses: 0,
    dryRunObservations: 0,
  } satisfies RegistryHealthDailyBucket
}

function getDailyBucket(state: RegistryMonitorEntryState, now: Date) {
  const date = now.toISOString().slice(0, 10)
  let bucket = state.daily.find((entry) => entry.date === date)

  if (!bucket) {
    bucket = createDailyBucket(date)
    state.daily.push(bucket)
  }

  return bucket
}

function trimState(state: RegistryMonitorEntryState, now: Date) {
  state.recentIndex = state.recentIndex
    .filter(
      (observation) =>
        now.getTime() - new Date(observation.checkedAt).getTime() <
        RECENT_INDEX_RETENTION_MS
    )
    .slice(-256)
  state.recentDryRuns = state.recentDryRuns.slice(-12)
  state.daily = state.daily
    .filter(
      (bucket) =>
        now.getTime() - new Date(`${bucket.date}T00:00:00.000Z`).getTime() <
        31 * DAY_MS
    )
    .toSorted((a, b) => a.date.localeCompare(b.date))
}

function isJsonMediaType(contentType: string) {
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase()
  return (
    mediaType === "application/json" ||
    mediaType === "text/json" ||
    mediaType.endsWith("+json")
  )
}

function getIndexObservation(
  result: RegistryJsonResult,
  entry: RegistryDirectoryEntry,
  now: Date
) {
  if (!result.ok) {
    return {
      observation: {
        checkedAt: now.toISOString(),
        outcome: result.botChallenge
          ? ("bot_challenge" as const)
          : result.reachable
            ? ("reachable" as const)
            : ("unreachable" as const),
        status: result.status,
        failureCode: result.failureCode,
        durationMs: result.durationMs,
        responseSize: result.responseSize,
        redirectCount: result.redirectCount,
        schemaValid: result.reachable ? false : undefined,
        contentTypeJson: result.contentType
          ? isJsonMediaType(result.contentType)
          : undefined,
      } satisfies RegistryIndexObservation,
      itemNames: null,
    }
  }

  const parsed = registrySchema.safeParse(result.json)
  const itemNames = parsed.success
    ? parsed.data.items.map((item) => item.name)
    : null
  const duplicateNames = itemNames
    ? new Set(itemNames).size !== itemNames.length
    : undefined
  const nameMatches = parsed.success
    ? normalizeRegistryName(parsed.data.name) ===
      normalizeRegistryName(entry.name)
    : undefined

  return {
    observation: {
      checkedAt: now.toISOString(),
      outcome: "reachable" as const,
      status: result.status,
      failureCode: parsed.success ? undefined : "invalid_schema",
      durationMs: result.durationMs,
      responseSize: result.responseSize,
      redirectCount: result.redirectCount,
      schemaValid: parsed.success,
      contentTypeJson: isJsonMediaType(result.contentType),
      duplicateNames,
      nameMatches,
      itemCount: itemNames?.length,
    } satisfies RegistryIndexObservation,
    itemNames,
  }
}

function recordIndexObservation(
  state: RegistryMonitorEntryState,
  observation: RegistryIndexObservation,
  itemNames: string[] | null,
  now: Date
) {
  state.recentIndex.push(observation)
  const bucket = getDailyBucket(state, now)

  if (observation.outcome !== "bot_challenge") {
    if (observation.outcome === "unreachable") {
      state.consecutiveSuccessfulIndexes = 0
      state.consecutiveIndexFailures += 1
      state.availabilityOutageSince ??=
        state.lastSuccessfulCheck ?? observation.checkedAt
      const outageDuration =
        new Date(observation.checkedAt).getTime() -
        new Date(state.availabilityOutageSince).getTime()
      const outageRequiresRecovery = outageDuration >= DAY_MS
      if (state.consecutiveIndexFailures >= 3 || outageRequiresRecovery) {
        state.availabilityRecoveryRequired = true
      }
    } else {
      const outageDuration = state.availabilityOutageSince
        ? new Date(observation.checkedAt).getTime() -
          new Date(state.availabilityOutageSince).getTime()
        : 0
      const outageRequiresRecovery = outageDuration >= DAY_MS
      state.consecutiveIndexFailures = 0

      if (observation.schemaValid) {
        state.consecutiveSuccessfulIndexes += 1
        if (
          (state.availabilityRecoveryRequired || outageRequiresRecovery) &&
          state.consecutiveSuccessfulIndexes < 2
        ) {
          state.availabilityRecoveryRequired = true
        } else {
          state.availabilityRecoveryRequired = false
          delete state.availabilityOutageSince
        }
      } else {
        state.consecutiveSuccessfulIndexes = 0
        if (state.availabilityRecoveryRequired || outageRequiresRecovery) {
          state.availabilityRecoveryRequired = true
        } else {
          delete state.availabilityOutageSince
        }
      }
    }
  }

  if (observation.outcome === "bot_challenge") {
    bucket.challengeObservations += 1
  } else {
    bucket.availabilityObservations += 1
    bucket.availabilitySuccesses += observation.outcome === "reachable" ? 1 : 0
  }

  if (observation.outcome === "reachable") {
    bucket.schemaObservations += 1
    bucket.schemaSuccesses += observation.schemaValid ? 1 : 0
  }

  if (observation.outcome === "reachable") {
    state.latestHygiene = {
      contentTypeJson: observation.contentTypeJson ?? false,
      noDuplicateNames:
        observation.duplicateNames === undefined
          ? null
          : !observation.duplicateNames,
      nameMatches: observation.nameMatches ?? null,
    }
  }

  if (observation.schemaValid && itemNames) {
    state.itemNames = itemNames
    state.lastSuccessfulCheck = observation.checkedAt
  }
}

function getItemNamesForDailyCheck(state: RegistryMonitorEntryState) {
  if (state.itemNames.length === 0) return []

  const count = Math.max(1, Math.ceil(state.itemNames.length / 30))
  const selected = Array.from({ length: count }, (_, offset) => {
    const index = (state.itemCursor + offset) % state.itemNames.length
    return state.itemNames[index]
  })
  state.itemCursor = (state.itemCursor + count) % state.itemNames.length
  return selected
}

function recordItemObservation(
  state: RegistryMonitorEntryState,
  observation: RegistryItemObservation,
  now: Date
) {
  if (observation.failureCode === "bot_challenge") return

  const bucket = getDailyBucket(state, now)
  bucket.itemObservations += 1
  bucket.itemSuccesses += observation.success ? 1 : 0
}

function getNextDryRunItem(state: RegistryMonitorEntryState) {
  if (state.itemNames.length === 0) return null

  const previousItem = state.recentDryRuns.at(-1)?.item
  const previousIndex = previousItem
    ? state.itemNames.indexOf(previousItem)
    : -1

  return state.itemNames[(previousIndex + 1) % state.itemNames.length]
}

function recordDryRunObservation(
  state: RegistryMonitorEntryState,
  observation: RegistryDryRunObservation,
  now: Date
) {
  state.recentDryRuns.push(observation)
  const bucket = getDailyBucket(state, now)
  bucket.dryRunObservations += 1
  bucket.dryRunSuccesses += observation.success ? 1 : 0
}

function replaceRegistryItem(url: string, item: string) {
  return url.replace("{name}", item)
}

function hasIntervalElapsed(
  lastRunAt: string | undefined,
  now: Date,
  intervalMs: number
) {
  if (!lastRunAt) return true

  const elapsed = now.getTime() - new Date(lastRunAt).getTime()
  return elapsed < 0 || elapsed >= intervalMs
}

function getChecks(
  mode: RegistryMonitorMode,
  now: Date,
  previousState?: RegistryMonitorState | null
) {
  if (mode === "all") {
    return { index: true, items: true, dryRun: true }
  }

  if (mode !== "auto") {
    return {
      index: mode === "hourly",
      items: mode === "daily",
      dryRun: mode === "weekly",
    }
  }

  return {
    index: true,
    items: hasIntervalElapsed(
      previousState?.lastDailyRunAt,
      now,
      DAILY_CHECK_INTERVAL_MS
    ),
    dryRun: hasIntervalElapsed(
      previousState?.lastWeeklyRunAt,
      now,
      WEEKLY_CHECK_INTERVAL_MS
    ),
  }
}

function createConcurrencyLimit(concurrency: number) {
  let active = 0
  const waiting: Array<() => void> = []

  return async function limit<T>(task: () => Promise<T>) {
    while (active >= concurrency) {
      await new Promise<void>((resolve) => waiting.push(resolve))
    }

    active += 1
    try {
      return await task()
    } finally {
      active -= 1
      waiting.shift()?.()
    }
  }
}

async function mapWithConcurrency<T>(
  values: T[],
  concurrency: number,
  task: (value: T) => Promise<void>
) {
  let cursor = 0

  async function worker() {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      await task(values[index])
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () => worker())
  )
}

function groupByHost(directory: RegistryDirectoryEntry[]) {
  const groups = new Map<string, RegistryDirectoryEntry[]>()

  for (const entry of directory) {
    let host = entry.name
    try {
      host = new URL(entry.url).host
    } catch {
      host = entry.name
    }

    const group = groups.get(host) ?? []
    group.push(entry)
    groups.set(host, group)
  }

  return [...groups.values()]
}

export async function runRegistryMonitor({
  directory,
  previousState,
  mode = "auto",
  now = new Date(),
  fetchJson = fetchRegistryJson,
  runDryRun,
  concurrency = 12,
}: {
  directory: RegistryDirectoryEntry[]
  previousState?: RegistryMonitorState | null
  mode?: RegistryMonitorMode
  now?: Date
  fetchJson?: typeof fetchRegistryJson
  runDryRun: (options: {
    namespace: string
    item: string
    registryUrl: string
  }) => Promise<RegistryDryRunResult>
  concurrency?: number
}): Promise<RegistryMonitorOutput> {
  const startedAt = now.toISOString()
  const checks = getChecks(mode, now, previousState)
  const state: RegistryMonitorState = {
    schemaVersion: REGISTRY_HEALTH_SCHEMA_VERSION,
    scoreVersion: REGISTRY_HEALTH_SCORE_VERSION,
    updatedAt: now.toISOString(),
    ...(previousState?.lastDailyRunAt
      ? { lastDailyRunAt: previousState.lastDailyRunAt }
      : {}),
    ...(previousState?.lastWeeklyRunAt
      ? { lastWeeklyRunAt: previousState.lastWeeklyRunAt }
      : {}),
    registries: {},
  }
  const limitDryRun = createConcurrencyLimit(MAX_DRY_RUN_CONCURRENCY)
  const runResults: RegistryMonitorRun["results"] = {}
  const totals = {
    registries: directory.length,
    reachable: 0,
    unavailable: 0,
    challenges: 0,
    itemChecks: 0,
    dryRuns: 0,
  }

  for (const entry of directory) {
    state.registries[entry.name] = structuredClone(
      previousState?.registries[entry.name] ??
        createRegistryMonitorEntryState(now)
    )
    runResults[entry.name] = { items: [] }
  }

  await mapWithConcurrency(
    groupByHost(directory),
    concurrency,
    async (group) => {
      for (const entry of group) {
        const entryState = state.registries[entry.name]
        const result = runResults[entry.name]

        if (checks.index) {
          const indexResult = await fetchJson(
            replaceRegistryItem(entry.url, "registry")
          )
          const { observation, itemNames } = getIndexObservation(
            indexResult,
            entry,
            now
          )
          recordIndexObservation(entryState, observation, itemNames, now)
          result.index = observation

          if (observation.outcome === "reachable") totals.reachable += 1
          if (observation.outcome === "unreachable") totals.unavailable += 1
          if (observation.outcome === "bot_challenge") totals.challenges += 1
        }

        if (checks.items) {
          for (const item of getItemNamesForDailyCheck(entryState)) {
            const itemResult = await fetchJson(
              replaceRegistryItem(entry.url, item)
            )
            const parsed = itemResult.ok
              ? registryItemSchema.safeParse(itemResult.json)
              : null
            const success = !!(parsed?.success && parsed.data.name === item)
            const observation: RegistryItemObservation = {
              checkedAt: now.toISOString(),
              item,
              success,
              failureCode: success
                ? undefined
                : itemResult.ok
                  ? parsed?.success
                    ? "name_mismatch"
                    : "invalid_schema"
                  : itemResult.failureCode,
              durationMs: itemResult.durationMs,
            }
            recordItemObservation(entryState, observation, now)
            result.items.push(observation)
            totals.itemChecks += 1
            if (!itemResult.ok && itemResult.botChallenge) {
              totals.challenges += 1
            }
          }
        }

        const dryRunItem = checks.dryRun ? getNextDryRunItem(entryState) : null
        if (dryRunItem) {
          const dryRunResult = await limitDryRun(() =>
            runDryRun({
              namespace: entry.name,
              item: dryRunItem,
              registryUrl: entry.url,
            })
          )
          const observation: RegistryDryRunObservation = {
            checkedAt: now.toISOString(),
            item: dryRunItem,
            ...dryRunResult,
          }
          recordDryRunObservation(entryState, observation, now)
          result.dryRun = observation
          totals.dryRuns += 1
        }

        trimState(entryState, now)
      }
    }
  )

  if (checks.items) {
    state.lastDailyRunAt = now.toISOString()
  }
  if (checks.dryRun) {
    state.lastWeeklyRunAt = now.toISOString()
  }

  const registryUrls = Object.fromEntries(
    directory.map((entry) => [entry.name, entry.url])
  )
  const globalMeans = calculateGlobalMeans(state, registryUrls, now)
  const snapshot: RegistryHealthSnapshot = {
    schemaVersion: REGISTRY_HEALTH_SCHEMA_VERSION,
    scoreVersion: REGISTRY_HEALTH_SCORE_VERSION,
    generatedAt: now.toISOString(),
    globalMeans,
    registries: {},
  }

  for (const entry of directory) {
    const entryState = state.registries[entry.name]
    const health = calculateRegistryHealth({
      state: entryState,
      registryUrl: entry.url,
      globalMeans,
      now,
    })
    entryState.status = health.status
    snapshot.registries[entry.name] = health
  }

  const run: RegistryMonitorRun = {
    schemaVersion: REGISTRY_HEALTH_SCHEMA_VERSION,
    startedAt,
    completedAt: new Date().toISOString(),
    mode,
    totals,
    results: runResults,
    diagnostics: [],
  }

  return {
    state: registryMonitorStateSchema.parse(state),
    snapshot: registryHealthSnapshotSchema.parse(snapshot),
    run: registryMonitorRunSchema.parse(run),
  }
}
