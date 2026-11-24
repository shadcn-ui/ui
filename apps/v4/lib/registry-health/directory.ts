import type { RegistryDirectoryEntry } from "../registry-directory"
import {
  registryHealthSchema,
  registryRankingSchema,
  type RegistryHealth,
  type RegistryRanking,
} from "./schema"

const HEALTH_MAX_AGE_MS = 6 * 60 * 60 * 1000

type DirectoryRegistry = RegistryDirectoryEntry & {
  health?: RegistryHealth
  ranking?: RegistryRanking
}

function compareNames(a: { name: string }, b: { name: string }) {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "en")
}

function getRankingGroup(registry: DirectoryRegistry, useRanking: boolean) {
  if (registry.health?.status === "unavailable") {
    return 2
  }
  if (
    !registry.health ||
    registry.health.status === "observing" ||
    registry.health.monitoringLimited ||
    (useRanking && !registry.ranking) ||
    registry.ranking?.itemCount === 0
  ) {
    return 1
  }
  return 0
}

export function createRegistryDirectoryView(
  directory: readonly RegistryDirectoryEntry[],
  payload: unknown,
  now: number
) {
  const names = new Set(directory.map((registry) => registry.name))
  const metadata = new Map<
    string,
    { health: RegistryHealth; ranking?: RegistryRanking }
  >()

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      if (!entry || typeof entry !== "object" || !names.has(entry.name)) {
        continue
      }
      const health = registryHealthSchema.safeParse(entry.health)
      if (!health.success) {
        continue
      }
      const age = now - new Date(health.data.checkedAt).getTime()
      if (age < 0 || age > HEALTH_MAX_AGE_MS) {
        continue
      }
      const ranking = registryRankingSchema.safeParse(entry.ranking)
      metadata.set(entry.name, {
        health: health.data,
        ...(ranking.success ? { ranking: ranking.data } : {}),
      })
    }
  }

  const useRanking = [...metadata.values()].some((entry) => entry.ranking)
  const registries = directory
    .map((registry) => ({ ...registry, ...metadata.get(registry.name) }))
    .toSorted((a, b) => {
      const group =
        getRankingGroup(a, useRanking) - getRankingGroup(b, useRanking)
      if (group !== 0) {
        return group
      }
      if (getRankingGroup(a, useRanking) === 0 && a.health && b.health) {
        const score = useRanking
          ? (b.ranking?.score ?? 0) - (a.ranking?.score ?? 0)
          : b.health.score - a.health.score
        if (score !== 0) {
          return score
        }
      }
      return compareNames(a, b)
    })

  return { registries }
}

export function getRegistryDirectoryPage(
  view: ReturnType<typeof createRegistryDirectoryView>,
  {
    query,
    page,
    pageSize = 10,
  }: { query: string; page: number; pageSize?: number }
) {
  const normalizedQuery = query
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("@", "")
  const registries = normalizedQuery
    ? view.registries.filter((registry) =>
        [registry.name, registry.description].some((value) =>
          value
            .toLowerCase()
            .replaceAll(" ", "")
            .replaceAll("@", "")
            .includes(normalizedQuery)
        )
      )
    : view.registries
  const totalPages = Math.max(1, Math.ceil(registries.length / pageSize))
  const currentPage = Math.max(1, Math.min(page, totalPages))

  return {
    registries,
    paginatedRegistries: registries.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ),
    page: currentPage,
    totalPages,
  }
}
