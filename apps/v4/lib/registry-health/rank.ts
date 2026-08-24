import { registryHealthOverlaySchema, type RegistryHealth } from "./schema"

const DAY_MS = 24 * 60 * 60 * 1000

const STATUS_ORDER: Record<RegistryHealth["status"], number> = {
  healthy: 0,
  observing: 1,
  degraded: 2,
  unavailable: 3,
}

export type DirectoryRegistry = {
  name: string
  description: string
  homepage: string
  url: string
  logo: string
  health?: RegistryHealth
}

export function normalizeRegistryQuery(value: string) {
  return value.toLowerCase().replaceAll(" ", "").replace(/^@/, "")
}

export function mergeRegistryHealthOverlay<T extends DirectoryRegistry>(
  directory: readonly T[],
  payload: unknown
) {
  const result = registryHealthOverlaySchema.safeParse(payload)

  if (!result.success) {
    return {
      registries: directory.map((registry) => ({ ...registry })),
      hasHealth: false,
    }
  }

  const healthByName = new Map<string, RegistryHealth>()
  const directoryNames = new Set(
    directory.map((registry) => `@${normalizeRegistryQuery(registry.name)}`)
  )
  const seenNames = new Set<string>()

  for (const entry of result.data) {
    const name = `@${normalizeRegistryQuery(entry.name)}`

    if (seenNames.has(name) || !directoryNames.has(name)) {
      return {
        registries: directory.map((registry) => ({ ...registry })),
        hasHealth: false,
      }
    }
    seenNames.add(name)

    if (entry.health) {
      healthByName.set(name, entry.health)
    }
  }

  return {
    registries: directory.map((registry) => {
      const health = healthByName.get(
        `@${normalizeRegistryQuery(registry.name)}`
      )

      return health ? { ...registry, health } : { ...registry }
    }),
    hasHealth: healthByName.size > 0,
  }
}

function getTextRank(registry: DirectoryRegistry, query: string) {
  const normalizedQuery = normalizeRegistryQuery(query)
  const normalizedName = normalizeRegistryQuery(registry.name)
  const normalizedDescription = normalizeRegistryQuery(registry.description)

  if (normalizedName === normalizedQuery) return 0
  if (normalizedName.startsWith(normalizedQuery)) return 1
  if (normalizedName.includes(normalizedQuery)) return 2
  if (normalizedDescription.includes(normalizedQuery)) return 3

  return null
}

function compareHealth(a: DirectoryRegistry, b: DirectoryRegistry) {
  if (!a.health && !b.health) return 0
  if (!a.health) return 1
  if (!b.health) return -1

  const status = STATUS_ORDER[a.health.status] - STATUS_ORDER[b.health.status]
  if (status !== 0) return status

  const score = b.health.score - a.health.score
  if (score !== 0) return score

  const availability7d = b.health.availability7d - a.health.availability7d
  if (availability7d !== 0) return availability7d

  const availability30d = b.health.availability30d - a.health.availability30d
  if (availability30d !== 0) return availability30d

  const correctness =
    b.health.breakdown.correctness - a.health.breakdown.correctness
  if (correctness !== 0) return correctness

  return a.name.localeCompare(b.name)
}

function isExactNamespaceMatch(registry: DirectoryRegistry, query: string) {
  return normalizeRegistryQuery(registry.name) === normalizeRegistryQuery(query)
}

function isRecentlyAdded(registry: DirectoryRegistry, now: Date) {
  if (!registry.health?.firstObservedAt || registry.health.hidden) {
    return false
  }

  const age =
    now.getTime() - new Date(registry.health.firstObservedAt).getTime()
  return age >= 0 && age < 7 * DAY_MS
}

export function rankRegistryDirectory({
  registries,
  query,
  hasHealth,
  now,
}: {
  registries: DirectoryRegistry[]
  query: string
  hasHealth: boolean
  now: Date
}) {
  const normalizedQuery = normalizeRegistryQuery(query)
  let filtered = registries.filter((registry) => {
    if (registry.health?.hidden && !isExactNamespaceMatch(registry, query)) {
      return false
    }

    return !normalizedQuery || getTextRank(registry, query) !== null
  })

  if (normalizedQuery) {
    filtered = filtered.toSorted((a, b) => {
      const textRank = getTextRank(a, query)! - getTextRank(b, query)!
      return textRank || compareHealth(a, b)
    })

    return { recentRegistries: [], registries: filtered }
  }

  if (!hasHealth) {
    return { recentRegistries: [], registries: filtered }
  }

  const recentRegistries = filtered
    .filter((registry) => isRecentlyAdded(registry, now))
    .toSorted(
      (a, b) =>
        new Date(b.health!.firstObservedAt!).getTime() -
        new Date(a.health!.firstObservedAt!).getTime()
    )
    .slice(0, 6)
  const recentNames = new Set(recentRegistries.map((registry) => registry.name))

  return {
    recentRegistries,
    registries: filtered
      .filter((registry) => !recentNames.has(registry.name))
      .toSorted(compareHealth),
  }
}

export function paginateRegistryDirectory<T>(
  registries: T[],
  requestedPage: number,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(registries.length / pageSize))
  const page = Math.max(1, Math.min(requestedPage, totalPages))

  return {
    page,
    totalPages,
    registries: registries.slice((page - 1) * pageSize, page * pageSize),
  }
}
