import { z } from "zod"

import { registryNamespaceSchema } from "../registry-directory"

export const REGISTRY_HEALTH_SCHEMA_VERSION = 1 as const
export const REGISTRY_HEALTH_SCORE_VERSION = 1 as const

export const registryHealthStatusSchema = z.enum([
  "healthy",
  "observing",
  "degraded",
  "unavailable",
])

export const registryHealthStatusReasonCodeSchema = z.enum([
  "healthy_thresholds",
  "collecting_baseline",
  "index_unavailable",
  "recovery_pending",
  "consecutive_index_failures",
  "index_schema_invalid",
  "item_validation_failures",
  "dry_run_failures",
])

export const registryHealthBreakdownSchema = z
  .object({
    reliability: z.number().min(0).max(45),
    correctness: z.number().min(0).max(25),
    installability: z.number().min(0).max(20),
    hygiene: z.number().min(0).max(10),
  })
  .strict()

export const registryHealthSchema = z
  .object({
    schemaVersion: z.literal(REGISTRY_HEALTH_SCHEMA_VERSION),
    scoreVersion: z.literal(REGISTRY_HEALTH_SCORE_VERSION),
    status: registryHealthStatusSchema,
    statusReason: z
      .object({
        code: registryHealthStatusReasonCodeSchema,
        message: z.string().min(1),
      })
      .strict()
      .optional(),
    score: z.number().min(0).max(100),
    breakdown: registryHealthBreakdownSchema,
    availability7d: z.number().min(0).max(1),
    availability30d: z.number().min(0).max(1),
    monitoringLimited: z.boolean(),
    firstObservedAt: z.string().datetime().optional(),
    checkedAt: z.string().datetime(),
    lastSuccessfulCheck: z.string().datetime().optional(),
    hidden: z.boolean(),
  })
  .strict()

export const registryHealthGlobalMeansSchema = z
  .object({
    availability7d: z.number().min(0).max(1),
    availability30d: z.number().min(0).max(1),
    indexSchema: z.number().min(0).max(1),
    itemValidity: z.number().min(0).max(1),
    dryRun: z.number().min(0).max(1),
  })
  .strict()

export const registryHealthSnapshotSchema = z
  .object({
    schemaVersion: z.literal(REGISTRY_HEALTH_SCHEMA_VERSION),
    scoreVersion: z.literal(REGISTRY_HEALTH_SCORE_VERSION),
    generatedAt: z.string().datetime(),
    globalMeans: registryHealthGlobalMeansSchema,
    registries: z.record(registryNamespaceSchema, registryHealthSchema),
  })
  .strict()

export const registryIndexObservationSchema = z
  .object({
    checkedAt: z.string().datetime(),
    outcome: z.enum(["reachable", "unreachable", "bot_challenge"]),
    status: z.number().int().min(100).max(599).optional(),
    failureCode: z.string().optional(),
    durationMs: z.number().int().nonnegative(),
    responseSize: z.number().int().nonnegative().optional(),
    redirectCount: z.number().int().nonnegative(),
    schemaValid: z.boolean().optional(),
    contentTypeJson: z.boolean().optional(),
    duplicateNames: z.boolean().optional(),
    nameMatches: z.boolean().optional(),
    itemCount: z.number().int().nonnegative().optional(),
  })
  .strict()

export const registryItemObservationSchema = z
  .object({
    checkedAt: z.string().datetime(),
    item: z.string(),
    success: z.boolean(),
    failureCode: z.string().optional(),
    durationMs: z.number().int().nonnegative(),
  })
  .strict()

export const registryDryRunObservationSchema = z
  .object({
    checkedAt: z.string().datetime(),
    item: z.string(),
    success: z.boolean(),
    failureCode: z.string().optional(),
    durationMs: z.number().int().nonnegative(),
  })
  .strict()

export const registryHealthDailyBucketSchema = z
  .object({
    date: z.string().date(),
    availabilitySuccesses: z.number().int().nonnegative(),
    availabilityObservations: z.number().int().nonnegative(),
    challengeObservations: z.number().int().nonnegative(),
    schemaSuccesses: z.number().int().nonnegative(),
    schemaObservations: z.number().int().nonnegative(),
    itemSuccesses: z.number().int().nonnegative(),
    itemObservations: z.number().int().nonnegative(),
    dryRunSuccesses: z.number().int().nonnegative(),
    dryRunObservations: z.number().int().nonnegative(),
  })
  .strict()

const registryMonitorEntryStateInputSchema = z
  .object({
    firstObservedAt: z.string().datetime(),
    lastSuccessfulCheck: z.string().datetime().optional(),
    status: registryHealthStatusSchema,
    consecutiveSuccessfulIndexes: z.number().int().nonnegative().optional(),
    consecutiveIndexFailures: z.number().int().nonnegative().optional(),
    availabilityOutageSince: z.string().datetime().optional(),
    availabilityRecoveryRequired: z.boolean().optional(),
    itemCursor: z.number().int().nonnegative(),
    itemNames: z.array(z.string()),
    recentIndex: z.array(registryIndexObservationSchema),
    recentDryRuns: z.array(registryDryRunObservationSchema),
    daily: z.array(registryHealthDailyBucketSchema),
    latestHygiene: z
      .object({
        contentTypeJson: z.boolean().nullable(),
        noDuplicateNames: z.boolean().nullable(),
        nameMatches: z.boolean().nullable(),
      })
      .strict(),
  })
  .strict()

function getLegacyAvailabilityState(
  entry: z.infer<typeof registryMonitorEntryStateInputSchema>
) {
  const observations = entry.recentIndex.filter(
    (observation) => observation.outcome !== "bot_challenge"
  )
  let cursor = observations.length - 1
  let consecutiveSuccessfulIndexes = 0

  while (cursor >= 0) {
    const observation = observations[cursor]
    if (observation.outcome !== "reachable" || !observation.schemaValid) {
      break
    }
    consecutiveSuccessfulIndexes += 1
    cursor -= 1
  }

  const failureEnd = cursor
  let precedingFailures = 0
  while (cursor >= 0 && observations[cursor].outcome === "unreachable") {
    precedingFailures += 1
    cursor -= 1
  }

  const consecutiveIndexFailures =
    consecutiveSuccessfulIndexes === 0 ? precedingFailures : 0
  const recoveryRequired =
    entry.status === "unavailable" ||
    (entry.status === "degraded" && precedingFailures >= 3)
  const failureStart =
    precedingFailures > 0
      ? observations[failureEnd - precedingFailures + 1]
      : undefined
  const outageStart =
    consecutiveSuccessfulIndexes > 0
      ? failureStart?.checkedAt
      : (entry.lastSuccessfulCheck ?? failureStart?.checkedAt)
  const availabilityOutageSince =
    recoveryRequired || consecutiveIndexFailures > 0
      ? (outageStart ?? entry.firstObservedAt)
      : undefined

  return {
    consecutiveSuccessfulIndexes,
    consecutiveIndexFailures,
    availabilityOutageSince,
    availabilityRecoveryRequired: recoveryRequired,
  }
}

export const registryMonitorEntryStateSchema =
  registryMonitorEntryStateInputSchema.transform((entry) => {
    if (
      entry.consecutiveSuccessfulIndexes !== undefined &&
      entry.consecutiveIndexFailures !== undefined &&
      entry.availabilityRecoveryRequired !== undefined
    ) {
      return entry as typeof entry & {
        consecutiveSuccessfulIndexes: number
        consecutiveIndexFailures: number
        availabilityRecoveryRequired: boolean
      }
    }

    return {
      ...entry,
      ...getLegacyAvailabilityState(entry),
    }
  })

export const registryMonitorStateSchema = z
  .object({
    schemaVersion: z.literal(REGISTRY_HEALTH_SCHEMA_VERSION),
    scoreVersion: z.literal(REGISTRY_HEALTH_SCORE_VERSION),
    updatedAt: z.string().datetime(),
    lastDailyRunAt: z.string().datetime().optional(),
    lastWeeklyRunAt: z.string().datetime().optional(),
    registries: z.record(
      registryNamespaceSchema,
      registryMonitorEntryStateSchema
    ),
  })
  .strict()

export const registryMonitorRunSchema = z
  .object({
    schemaVersion: z.literal(REGISTRY_HEALTH_SCHEMA_VERSION),
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime(),
    mode: z.enum(["auto", "hourly", "daily", "weekly", "all"]),
    totals: z
      .object({
        registries: z.number().int().nonnegative(),
        reachable: z.number().int().nonnegative(),
        unavailable: z.number().int().nonnegative(),
        challenges: z.number().int().nonnegative(),
        itemChecks: z.number().int().nonnegative(),
        dryRuns: z.number().int().nonnegative(),
      })
      .strict(),
    results: z.record(
      registryNamespaceSchema,
      z
        .object({
          index: registryIndexObservationSchema.optional(),
          items: z.array(registryItemObservationSchema),
          dryRun: registryDryRunObservationSchema.optional(),
        })
        .strict()
    ),
    diagnostics: z.array(z.string()),
  })
  .strict()

export const registryMonitorOutputSchema = z
  .object({
    state: registryMonitorStateSchema,
    snapshot: registryHealthSnapshotSchema,
    run: registryMonitorRunSchema,
  })
  .strict()

export type RegistryHealth = z.infer<typeof registryHealthSchema>
export type RegistryHealthStatusReasonCode = z.infer<
  typeof registryHealthStatusReasonCodeSchema
>
export type RegistryHealthBreakdown = z.infer<
  typeof registryHealthBreakdownSchema
>
export type RegistryHealthGlobalMeans = z.infer<
  typeof registryHealthGlobalMeansSchema
>
export type RegistryHealthSnapshot = z.infer<
  typeof registryHealthSnapshotSchema
>
export type RegistryIndexObservation = z.infer<
  typeof registryIndexObservationSchema
>
export type RegistryItemObservation = z.infer<
  typeof registryItemObservationSchema
>
export type RegistryDryRunObservation = z.infer<
  typeof registryDryRunObservationSchema
>
export type RegistryHealthDailyBucket = z.infer<
  typeof registryHealthDailyBucketSchema
>
export type RegistryMonitorEntryState = z.infer<
  typeof registryMonitorEntryStateSchema
>
export type RegistryMonitorState = z.infer<typeof registryMonitorStateSchema>
export type RegistryMonitorRun = z.infer<typeof registryMonitorRunSchema>
export type RegistryMonitorOutput = z.infer<typeof registryMonitorOutputSchema>
