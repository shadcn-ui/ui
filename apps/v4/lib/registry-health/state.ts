import type { RegistryMonitorEntryState } from "./schema"

function createRegistryMonitorEntryState(now: Date) {
  return {
    firstObservedAt: now.toISOString(),
    status: "observing",
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
  } satisfies RegistryMonitorEntryState
}

export { createRegistryMonitorEntryState }
