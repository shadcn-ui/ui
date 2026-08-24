import { describe, expect, it } from "vitest"

import {
  mergeRegistryHealthOverlay,
  paginateRegistryDirectory,
  rankRegistryDirectory,
  type DirectoryRegistry,
} from "./rank"
import type { RegistryHealth } from "./schema"

const NOW = new Date("2026-08-24T12:00:00.000Z")

function createHealth(overrides: Partial<RegistryHealth> = {}) {
  return {
    schemaVersion: 1,
    scoreVersion: 1,
    status: "healthy",
    score: 90,
    breakdown: {
      reliability: 40,
      correctness: 23,
      installability: 18,
      hygiene: 9,
    },
    availability7d: 0.99,
    availability30d: 0.98,
    monitoringLimited: false,
    firstObservedAt: "2026-08-01T00:00:00.000Z",
    checkedAt: "2026-08-24T11:00:00.000Z",
    lastSuccessfulCheck: "2026-08-24T11:00:00.000Z",
    hidden: false,
    ...overrides,
  } satisfies RegistryHealth
}

function createRegistry(
  name: string,
  overrides: Partial<DirectoryRegistry> = {}
) {
  return {
    name,
    description: `${name} components`,
    homepage: `https://${name.slice(1)}.example.com`,
    url: `https://${name.slice(1)}.example.com/{name}.json`,
    logo: `<svg data-logo="${name}" />`,
    health: createHealth(),
    ...overrides,
  } satisfies DirectoryRegistry
}

describe("mergeRegistryHealthOverlay", () => {
  it("only overlays validated health onto static metadata", () => {
    const registry = createRegistry("@safe", { health: undefined })
    const result = mergeRegistryHealthOverlay(
      [registry],
      [
        {
          name: "@safe",
          homepage: "https://attacker.example.com",
          description: "Replaced",
          logo: "<script>bad()</script>",
          health: createHealth({ score: 75 }),
        },
      ]
    )

    expect(result.hasHealth).toBe(true)
    expect(result.registries[0]).toMatchObject({
      homepage: registry.homepage,
      description: registry.description,
      logo: registry.logo,
      health: { score: 75 },
    })
  })

  it("discards the complete overlay when namespaces are duplicated", () => {
    const registry = createRegistry("@safe", { health: undefined })
    const payload = [
      { name: "@safe", health: createHealth() },
      { name: "@safe", health: createHealth({ score: 70 }) },
    ]
    const result = mergeRegistryHealthOverlay([registry], payload)

    expect(result.hasHealth).toBe(false)
    expect(result.registries[0].health).toBeUndefined()
  })

  it("discards the complete overlay when a namespace is invalid", () => {
    const registry = createRegistry("@safe", { health: undefined })
    const result = mergeRegistryHealthOverlay(
      [registry],
      [{ name: "@safe@other", health: createHealth() }]
    )

    expect(result.hasHealth).toBe(false)
    expect(result.registries[0].health).toBeUndefined()
  })
})

describe("rankRegistryDirectory", () => {
  it("uses continuous health signals before the name tie-breaker", () => {
    const lowerAvailability = createRegistry("@alpha", {
      health: createHealth({ availability7d: 0.9 }),
    })
    const higherAvailability = createRegistry("@zulu", {
      health: createHealth({ availability7d: 0.99 }),
    })
    const result = rankRegistryDirectory({
      registries: [lowerAvailability, higherAvailability],
      query: "",
      hasHealth: true,
      now: NOW,
    })

    expect(result.registries.map((registry) => registry.name)).toEqual([
      "@zulu",
      "@alpha",
    ])
  })

  it("reveals an exact hidden namespace search", () => {
    const hidden = createRegistry("@hidden", {
      health: createHealth({ status: "unavailable", hidden: true }),
    })
    const result = rankRegistryDirectory({
      registries: [hidden],
      query: "hidden",
      hasHealth: true,
      now: NOW,
    })

    expect(result.registries).toHaveLength(1)
  })

  it("hides unavailable registries from browsing and non-exact search", () => {
    const hidden = createRegistry("@hidden", {
      health: createHealth({ status: "unavailable", hidden: true }),
    })

    const browsing = rankRegistryDirectory({
      registries: [hidden],
      query: "",
      hasHealth: true,
      now: NOW,
    })
    const searching = rankRegistryDirectory({
      registries: [hidden],
      query: "components",
      hasHealth: true,
      now: NOW,
    })

    expect(browsing.registries).toHaveLength(0)
    expect(searching.registries).toHaveLength(0)
  })

  it("surfaces up to six recent registries without duplicating them", () => {
    const recent = Array.from({ length: 7 }, (_, index) =>
      createRegistry(`@recent-${index}`, {
        health: createHealth({
          firstObservedAt: new Date(
            NOW.getTime() - index * 60 * 60 * 1000
          ).toISOString(),
        }),
      })
    )
    const result = rankRegistryDirectory({
      registries: recent,
      query: "",
      hasHealth: true,
      now: NOW,
    })

    expect(result.recentRegistries).toHaveLength(6)
    expect(result.recentRegistries[0].name).toBe("@recent-0")
    expect(result.registries.map((registry) => registry.name)).toEqual([
      "@recent-6",
    ])
  })

  it("does not create a recent section while searching", () => {
    const result = rankRegistryDirectory({
      registries: [
        createRegistry("@recent", {
          health: createHealth({ firstObservedAt: NOW.toISOString() }),
        }),
      ],
      query: "recent",
      hasHealth: true,
      now: NOW,
    })

    expect(result.recentRegistries).toEqual([])
    expect(result.registries).toHaveLength(1)
  })
})

describe("paginateRegistryDirectory", () => {
  it("clamps the requested page after filtering", () => {
    const result = paginateRegistryDirectory(["one", "two"], 10, 1)

    expect(result).toEqual({
      page: 2,
      totalPages: 2,
      registries: ["two"],
    })
  })
})
