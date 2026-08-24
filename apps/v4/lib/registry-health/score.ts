import {
  REGISTRY_HEALTH_SCHEMA_VERSION,
  REGISTRY_HEALTH_SCORE_VERSION,
  type RegistryHealth,
  type RegistryHealthGlobalMeans,
  type RegistryMonitorEntryState,
  type RegistryMonitorState,
} from "./schema"

const DAY_MS = 24 * 60 * 60 * 1000

const DEFAULT_GLOBAL_MEANS: RegistryHealthGlobalMeans = {
  availability7d: 0.85,
  availability30d: 0.85,
  indexSchema: 0.9,
  itemValidity: 0.9,
  dryRun: 0.9,
}

const PRIOR_WEIGHTS = {
  availability7d: 24,
  availability30d: 24,
  indexSchema: 12,
  itemValidity: 10,
  dryRun: 3,
} as const

type RateSignal = {
  successes: number
  observations: number
}

export type RegistryHealthSignals = {
  availability7d: RateSignal
  availability30d: RateSignal
  indexSchema: RateSignal
  itemValidity: RateSignal
  dryRun: RateSignal
  hygiene: {
    https: boolean
    contentTypeJson: boolean | null
    noDuplicateNames: boolean | null
    nameMatches: boolean | null
  }
}

function round(value: number, digits: number) {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

function isWithinWindow(timestamp: string, now: Date, days: number) {
  const age = now.getTime() - new Date(timestamp).getTime()
  return age >= 0 && age < days * DAY_MS
}

function isBucketWithinWindow(date: string, now: Date, days: number) {
  return isWithinWindow(`${date}T00:00:00.000Z`, now, days)
}

function sumDailySignal(
  state: RegistryMonitorEntryState,
  now: Date,
  days: number,
  successesKey:
    | "availabilitySuccesses"
    | "schemaSuccesses"
    | "itemSuccesses"
    | "dryRunSuccesses",
  observationsKey:
    | "availabilityObservations"
    | "schemaObservations"
    | "itemObservations"
    | "dryRunObservations"
) {
  return state.daily.reduce<RateSignal>(
    (signal, bucket) => {
      if (!isBucketWithinWindow(bucket.date, now, days)) {
        return signal
      }

      signal.successes += bucket[successesKey]
      signal.observations += bucket[observationsKey]
      return signal
    },
    { successes: 0, observations: 0 }
  )
}

export function getRegistryHealthSignals(
  state: RegistryMonitorEntryState,
  registryUrl: string,
  now: Date
): RegistryHealthSignals {
  const availability7d = state.recentIndex.reduce<RateSignal>(
    (signal, observation) => {
      if (
        observation.outcome === "bot_challenge" ||
        !isWithinWindow(observation.checkedAt, now, 7)
      ) {
        return signal
      }

      signal.observations += 1
      signal.successes += observation.outcome === "reachable" ? 1 : 0
      return signal
    },
    { successes: 0, observations: 0 }
  )

  return {
    availability7d,
    availability30d: sumDailySignal(
      state,
      now,
      30,
      "availabilitySuccesses",
      "availabilityObservations"
    ),
    indexSchema: sumDailySignal(
      state,
      now,
      30,
      "schemaSuccesses",
      "schemaObservations"
    ),
    itemValidity: sumDailySignal(
      state,
      now,
      30,
      "itemSuccesses",
      "itemObservations"
    ),
    dryRun: sumDailySignal(
      state,
      now,
      30,
      "dryRunSuccesses",
      "dryRunObservations"
    ),
    hygiene: {
      https: registryUrl.startsWith("https://"),
      contentTypeJson: state.latestHygiene.contentTypeJson,
      noDuplicateNames: state.latestHygiene.noDuplicateNames,
      nameMatches: state.latestHygiene.nameMatches,
    },
  }
}

function getObservedMean(
  signals: RateSignal[],
  minimumObservations: number,
  fallback: number
) {
  const eligible = signals.filter(
    (signal) => signal.observations >= minimumObservations
  )
  const observations = eligible.reduce(
    (total, signal) => total + signal.observations,
    0
  )

  if (observations === 0) {
    return fallback
  }

  const successes = eligible.reduce(
    (total, signal) => total + signal.successes,
    0
  )
  return successes / observations
}

export function calculateGlobalMeans(
  state: RegistryMonitorState,
  registryUrls: Record<string, string>,
  now: Date
): RegistryHealthGlobalMeans {
  const signals = Object.entries(state.registries).map(([name, entry]) =>
    getRegistryHealthSignals(entry, registryUrls[name] ?? "http://invalid", now)
  )

  return {
    availability7d: getObservedMean(
      signals.map((signal) => signal.availability7d),
      24,
      DEFAULT_GLOBAL_MEANS.availability7d
    ),
    availability30d: getObservedMean(
      signals.map((signal) => signal.availability30d),
      24,
      DEFAULT_GLOBAL_MEANS.availability30d
    ),
    indexSchema: getObservedMean(
      signals.map((signal) => signal.indexSchema),
      12,
      DEFAULT_GLOBAL_MEANS.indexSchema
    ),
    itemValidity: getObservedMean(
      signals.map((signal) => signal.itemValidity),
      10,
      DEFAULT_GLOBAL_MEANS.itemValidity
    ),
    dryRun: getObservedMean(
      signals.map((signal) => signal.dryRun),
      3,
      DEFAULT_GLOBAL_MEANS.dryRun
    ),
  }
}

function smooth(signal: RateSignal, globalMean: number, priorWeight: number) {
  return (
    (signal.successes + globalMean * priorWeight) /
    (signal.observations + priorWeight)
  )
}

function getHygienePoints(value: boolean | null) {
  if (value === null) {
    return 1.25
  }

  return value ? 2.5 : 0
}

function getNonChallengeObservations(state: RegistryMonitorEntryState) {
  return state.recentIndex.filter(
    (observation) => observation.outcome !== "bot_challenge"
  )
}

function countTrailingFailures(state: RegistryMonitorEntryState) {
  const observations = getNonChallengeObservations(state)
  let failures = 0

  for (let index = observations.length - 1; index >= 0; index -= 1) {
    if (observations[index].outcome !== "unreachable") {
      break
    }
    failures += 1
  }

  return failures
}

function countTrailingSuccessfulIndexes(state: RegistryMonitorEntryState) {
  const observations = getNonChallengeObservations(state)
  let successes = 0

  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index]
    if (observation.outcome !== "reachable" || !observation.schemaValid) {
      break
    }
    successes += 1
  }

  return successes
}

function isRecoveringFromAvailabilityDegradation(
  state: RegistryMonitorEntryState
) {
  const observations = getNonChallengeObservations(state)
  let index = observations.length - 1
  let successfulIndexes = 0

  while (index >= 0) {
    const observation = observations[index]
    if (observation.outcome !== "reachable" || !observation.schemaValid) {
      break
    }
    successfulIndexes += 1
    index -= 1
  }

  if (successfulIndexes >= 2) {
    return false
  }

  let failures = 0
  while (index >= 0 && observations[index].outcome === "unreachable") {
    failures += 1
    index -= 1
  }

  return failures >= 3
}

function getUnavailableSince(state: RegistryMonitorEntryState) {
  return state.lastSuccessfulCheck ?? state.firstObservedAt
}

function deriveStatus(
  state: RegistryMonitorEntryState,
  signals: RegistryHealthSignals,
  now: Date
) {
  const observations = getNonChallengeObservations(state)
  const latest = observations.at(-1)
  const unavailableFor =
    now.getTime() - new Date(getUnavailableSince(state)).getTime()
  const unavailable =
    latest?.outcome === "unreachable" && unavailableFor >= DAY_MS
  const successfulIndexes = countTrailingSuccessfulIndexes(state)

  if (
    unavailable ||
    (state.status === "unavailable" && successfulIndexes < 2)
  ) {
    if (latest?.outcome === "reachable") {
      return {
        status: "unavailable" as const,
        statusReason: {
          code: "recovery_pending" as const,
          message: "Waiting for a second successful recovery check",
        },
      }
    }

    return {
      status: "unavailable" as const,
      statusReason: {
        code: "index_unavailable" as const,
        message: "No successful index check in the last 24 hours",
      },
    }
  }

  const observationSpan = latest
    ? new Date(latest.checkedAt).getTime() -
      new Date(state.firstObservedAt).getTime()
    : 0

  if (observations.length < 24 || observationSpan < DAY_MS) {
    return {
      status: "observing" as const,
      statusReason: {
        code: "collecting_baseline" as const,
        message:
          observations.length < 24
            ? `Collecting baseline data (${observations.length} of 24 checks)`
            : "Collecting a full day of baseline data",
      },
    }
  }

  const trailingFailures = countTrailingFailures(state)
  const latestSchemaInvalid =
    latest?.outcome === "reachable" && latest.schemaValid === false
  const itemDegraded =
    signals.itemValidity.observations >= 10 &&
    signals.itemValidity.successes / signals.itemValidity.observations < 0.9
  const recentDryRuns = state.recentDryRuns.slice(-2)
  const dryRunDegraded =
    recentDryRuns.length === 2 &&
    recentDryRuns.every((observation) => !observation.success)

  if (trailingFailures >= 3) {
    return {
      status: "degraded" as const,
      statusReason: {
        code: "consecutive_index_failures" as const,
        message: `The registry index failed ${trailingFailures} consecutive checks`,
      },
    }
  }

  if (latestSchemaInvalid) {
    return {
      status: "degraded" as const,
      statusReason: {
        code: "index_schema_invalid" as const,
        message: "The registry index failed schema validation",
      },
    }
  }

  if (itemDegraded) {
    return {
      status: "degraded" as const,
      statusReason: {
        code: "item_validation_failures" as const,
        message: "Sampled registry items are failing validation",
      },
    }
  }

  if (dryRunDegraded) {
    return {
      status: "degraded" as const,
      statusReason: {
        code: "dry_run_failures" as const,
        message: "The last two CLI dry-run checks failed",
      },
    }
  }

  if (
    state.status === "degraded" &&
    isRecoveringFromAvailabilityDegradation(state)
  ) {
    return {
      status: "degraded" as const,
      statusReason: {
        code: "recovery_pending" as const,
        message: "Waiting for a second successful recovery check",
      },
    }
  }

  return {
    status: "healthy" as const,
    statusReason: {
      code: "healthy_thresholds" as const,
      message: "Recent checks are within healthy thresholds",
    },
  }
}

export function calculateRegistryHealth({
  state,
  registryUrl,
  globalMeans,
  now,
}: {
  state: RegistryMonitorEntryState
  registryUrl: string
  globalMeans: RegistryHealthGlobalMeans
  now: Date
}): RegistryHealth {
  const signals = getRegistryHealthSignals(state, registryUrl, now)
  const availability7d = smooth(
    signals.availability7d,
    globalMeans.availability7d,
    PRIOR_WEIGHTS.availability7d
  )
  const availability30d = smooth(
    signals.availability30d,
    globalMeans.availability30d,
    PRIOR_WEIGHTS.availability30d
  )
  const indexSchema = smooth(
    signals.indexSchema,
    globalMeans.indexSchema,
    PRIOR_WEIGHTS.indexSchema
  )
  const itemValidity = smooth(
    signals.itemValidity,
    globalMeans.itemValidity,
    PRIOR_WEIGHTS.itemValidity
  )
  const dryRun = smooth(
    signals.dryRun,
    globalMeans.dryRun,
    PRIOR_WEIGHTS.dryRun
  )

  const breakdown = {
    reliability: round(
      45 * (0.65 * availability7d + 0.35 * availability30d),
      3
    ),
    correctness: round(10 * indexSchema + 15 * itemValidity, 3),
    installability: round(20 * dryRun, 3),
    hygiene: round(
      (signals.hygiene.https ? 2.5 : 0) +
        getHygienePoints(signals.hygiene.contentTypeJson) +
        getHygienePoints(signals.hygiene.noDuplicateNames) +
        getHygienePoints(signals.hygiene.nameMatches),
      3
    ),
  }
  const score = round(
    breakdown.reliability +
      breakdown.correctness +
      breakdown.installability +
      breakdown.hygiene,
    3
  )
  const { status, statusReason } = deriveStatus(state, signals, now)
  const unavailableFor =
    now.getTime() - new Date(getUnavailableSince(state)).getTime()
  const hidden = status === "unavailable" && unavailableFor >= 7 * DAY_MS
  const latestObservation = state.recentIndex.at(-1)
  const checkedAt = latestObservation?.checkedAt ?? state.firstObservedAt

  return {
    schemaVersion: REGISTRY_HEALTH_SCHEMA_VERSION,
    scoreVersion: REGISTRY_HEALTH_SCORE_VERSION,
    status,
    statusReason,
    score,
    breakdown,
    availability7d: round(availability7d, 6),
    availability30d: round(availability30d, 6),
    monitoringLimited: latestObservation?.outcome === "bot_challenge",
    firstObservedAt: state.firstObservedAt,
    checkedAt,
    lastSuccessfulCheck: state.lastSuccessfulCheck,
    hidden,
  }
}

export function createObservingRegistryHealth({
  registryUrl,
  checkedAt,
  globalMeans,
}: {
  registryUrl: string
  checkedAt: string
  globalMeans: RegistryHealthGlobalMeans
}) {
  const health = calculateRegistryHealth({
    state: {
      firstObservedAt: checkedAt,
      status: "observing",
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
    },
    registryUrl,
    globalMeans,
    now: new Date(checkedAt),
  })
  const { firstObservedAt: _, ...observing } = health

  return observing
}

export { DEFAULT_GLOBAL_MEANS, PRIOR_WEIGHTS }
