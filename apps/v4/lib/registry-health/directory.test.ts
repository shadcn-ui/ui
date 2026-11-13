import { describe, expect, it } from "vitest"

import type { RegistryDirectoryEntry } from "../registry-directory"
import {
  createRegistryDirectoryView,
  getRegistryDirectoryPage,
} from "./directory"
import type { RegistryHealth } from "./schema"

const NOW = new Date("2026-09-30T12:00:00.000Z").getTime()

function createRegistry(name: string) {
  return {
    name,
    homepage: "https://example.com",
    url: "https://example.com/r/{name}.json",
    description: "Components and blocks",
    logo: "<svg></svg>",
  } satisfies RegistryDirectoryEntry
}

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
    checkedAt: new Date(NOW).toISOString(),
    lastSuccessfulCheck: new Date(NOW).toISOString(),
    hidden: false,
    ...overrides,
  } satisfies RegistryHealth
}

function createMetadata(name: string, score = 90, health = createHealth()) {
  return { name, health, ranking: { version: 1, score, itemCount: 100 } }
}

function getNames(view: ReturnType<typeof createRegistryDirectoryView>) {
  return view.registries.map((registry) => registry.name)
}

describe("createRegistryDirectoryView", () => {
  it("sorts old snapshots by health score before ranking metadata is published", () => {
    const directory = ["@alpha", "@beta", "@down", "@new"].map(createRegistry)
    const view = createRegistryDirectoryView(
      directory,
      [
        { name: "@alpha", health: createHealth({ score: 85 }) },
        { name: "@beta", health: createHealth({ score: 95 }) },
        {
          name: "@down",
          health: createHealth({ score: 100, status: "unavailable" }),
        },
        {
          name: "@new",
          health: createHealth({ score: 100, status: "observing" }),
        },
      ],
      NOW
    )
    expect(getNames(view)).toEqual(["@beta", "@alpha", "@new", "@down"])
    expect(
      getRegistryDirectoryPage(view, { query: "", page: 1, pageSize: 1 })
        .paginatedRegistries[0].name
    ).toBe("@beta")
  })

  it("does not mix raw health scores with size-adjusted rankings", () => {
    const view = createRegistryDirectoryView(
      ["@alpha", "@beta"].map(createRegistry),
      [
        { name: "@alpha", health: createHealth({ score: 100 }) },
        createMetadata("@beta", 80, createHealth({ score: 90 })),
      ],
      NOW
    )
    expect(getNames(view)).toEqual(["@beta", "@alpha"])
  })

  it("uses health scores when all ranking metadata has an unknown version", () => {
    const view = createRegistryDirectoryView(
      ["@alpha", "@beta"].map(createRegistry),
      [
        {
          ...createMetadata("@alpha"),
          health: createHealth({ score: 85 }),
          ranking: { version: 2, score: 100, itemCount: 100 },
        },
        {
          ...createMetadata("@beta"),
          health: createHealth({ score: 95 }),
          ranking: { version: 2, score: 70, itemCount: 100 },
        },
      ],
      NOW
    )
    expect(getNames(view)).toEqual(["@beta", "@alpha"])
  })
  it("sorts by exact ranking scores rather than rounded health scores", () => {
    const directory = [createRegistry("@alpha"), createRegistry("@beta")]
    const view = createRegistryDirectoryView(
      directory,
      [createMetadata("@alpha", 90.001), createMetadata("@beta", 90.002)],
      NOW
    )
    expect(getNames(view)).toEqual(["@beta", "@alpha"])
    expect(directory.map((registry) => registry.name)).toEqual([
      "@alpha",
      "@beta",
    ])
  })

  it("breaks ranking ties alphabetically", () => {
    const directory = [createRegistry("@beta"), createRegistry("@alpha")]
    const view = createRegistryDirectoryView(
      directory,
      directory.map(({ name }) => createMetadata(name)),
      NOW
    )
    expect(getNames(view)).toEqual(["@alpha", "@beta"])
  })

  it("does not apply a second penalty to degraded registries", () => {
    const view = createRegistryDirectoryView(
      [createRegistry("@alpha"), createRegistry("@beta")],
      [
        createMetadata("@alpha", 85),
        createMetadata("@beta", 90, createHealth({ status: "degraded" })),
      ],
      NOW
    )
    expect(getNames(view)).toEqual(["@beta", "@alpha"])
  })

  it("keeps provisional registries in a neutral alphabetical group", () => {
    const directory = ["@empty", "@limited", "@new", "@unknown", "@ranked"].map(
      createRegistry
    )
    const view = createRegistryDirectoryView(
      directory,
      [
        {
          ...createMetadata("@empty", 100),
          ranking: { version: 1, score: 100, itemCount: 0 },
        },
        createMetadata(
          "@limited",
          100,
          createHealth({ monitoringLimited: true })
        ),
        createMetadata("@new", 100, createHealth({ status: "observing" })),
        createMetadata("@ranked", 70),
      ],
      NOW
    )
    expect(getNames(view)).toEqual([
      "@ranked",
      "@empty",
      "@limited",
      "@new",
      "@unknown",
    ])
    expect(
      view.registries.find(({ name }) => name === "@new")?.ranking?.score
    ).toBe(100)
  })

  it("keeps unavailable registries searchable at the end, even when hidden is true", () => {
    const view = createRegistryDirectoryView(
      [
        createRegistry("@down"),
        createRegistry("@new"),
        createRegistry("@ranked"),
      ],
      [
        createMetadata(
          "@down",
          100,
          createHealth({
            status: "unavailable",
            monitoringLimited: true,
            hidden: true,
          })
        ),
        createMetadata("@ranked", 70),
      ],
      NOW
    )
    expect(getNames(view)).toEqual(["@ranked", "@new", "@down"])
    expect(
      getRegistryDirectoryPage(view, { query: "@down", page: 1 })
        .paginatedRegistries[0].name
    ).toBe("@down")
  })

  it("merges only health and ranking metadata from exact known namespaces", () => {
    const authored = createRegistry("@alpha")
    const view = createRegistryDirectoryView(
      [authored],
      [
        {
          ...createMetadata("@ALPHA", 100),
          homepage: "https://other.example.com",
        },
        { ...createMetadata("@unknown", 100), logo: "<script>bad()</script>" },
        {
          ...createMetadata("@alpha", 80),
          homepage: "javascript:bad()",
          url: "https://other.example.com",
          description: "Fetched description",
          logo: "<script>bad()</script>",
        },
      ],
      NOW
    )
    expect(view.registries).toEqual([
      {
        ...authored,
        health: createHealth(),
        ranking: { version: 1, score: 80, itemCount: 100 },
      },
    ])
  })

  it.each([
    undefined,
    null,
    {},
    "bad",
    [null, false, {}, { name: "@unknown" }],
  ])(
    "falls back to alphabetical order for unusable metadata: %j",
    (payload) => {
      const directory = [createRegistry("@beta"), createRegistry("@alpha")]
      expect(
        getNames(createRegistryDirectoryView(directory, payload, NOW))
      ).toEqual(["@alpha", "@beta"])
    }
  )

  it.each([
    { checkedAt: "2026-09-30T05:59:59.999Z" },
    { checkedAt: "2026-09-30T12:00:00.001Z" },
    { score: 101 },
    { scoreVersion: 2 },
    { hidden: "true" },
  ])("ignores stale, future, or invalid health: %j", (overrides) => {
    const view = createRegistryDirectoryView(
      [createRegistry("@alpha")],
      [
        {
          ...createMetadata("@alpha"),
          health: { ...createHealth(), ...overrides },
        },
      ],
      NOW
    )
    expect(view.registries[0]).not.toHaveProperty("health")
    expect(view.registries[0]).not.toHaveProperty("ranking")
  })

  it("accepts health at the six-hour freshness boundary", () => {
    const health = createHealth({ checkedAt: "2026-09-30T06:00:00.000Z" })
    const view = createRegistryDirectoryView(
      [createRegistry("@alpha")],
      [createMetadata("@alpha", 90, health)],
      NOW
    )
    expect(view.registries[0].health).toEqual(health)
  })

  it.each([
    undefined,
    { version: 2, score: 90, itemCount: 100 },
    { version: 1, score: 101, itemCount: 100 },
  ])("retains valid health without usable ranking: %j", (ranking) => {
    const view = createRegistryDirectoryView(
      [createRegistry("@alpha")],
      [{ ...createMetadata("@alpha"), ranking }],
      NOW
    )
    expect(view.registries[0].health).toEqual(createHealth())
    expect(view.registries[0]).not.toHaveProperty("ranking")
  })
})

describe("getRegistryDirectoryPage", () => {
  const directory = Array.from({ length: 25 }, (_, index) =>
    createRegistry(`@registry-${String(index).padStart(2, "0")}`)
  )
  const view = createRegistryDirectoryView(
    directory,
    directory.map(({ name }, index) => createMetadata(name, 70 + index)),
    NOW
  )

  it("sorts before pagination and includes every registry exactly once", () => {
    const pages = [1, 2, 3].map((page) =>
      getRegistryDirectoryPage(view, { query: "", page })
    )
    const names = pages.flatMap(({ paginatedRegistries }) =>
      paginatedRegistries.map(({ name }) => name)
    )
    expect(names).toEqual(directory.map(({ name }) => name).reverse())
    expect(new Set(names).size).toBe(25)
    expect(pages[0].registries).toHaveLength(25)
    expect(pages[0]).not.toHaveProperty("recentlyAdded")
    expect(
      pages.map(({ paginatedRegistries }) => paginatedRegistries.length)
    ).toEqual([10, 10, 5])
  })

  it("searches authored names and descriptions without losing ranked order", () => {
    const result = getRegistryDirectoryPage(view, {
      query: " Components ",
      page: 1,
    })
    expect(result.registries).toHaveLength(25)
    expect(result.paginatedRegistries[0].name).toBe("@registry-24")
    expect(
      getRegistryDirectoryPage(view, { query: "@registry-03", page: 2 })
    ).toMatchObject({
      page: 1,
      totalPages: 1,
      paginatedRegistries: [{ name: "@registry-03" }],
    })
  })

  it("clamps invalid pages and keeps an empty search on page one", () => {
    expect(getRegistryDirectoryPage(view, { query: "", page: -1 }).page).toBe(1)
    expect(getRegistryDirectoryPage(view, { query: "", page: 100 }).page).toBe(
      3
    )
    expect(
      getRegistryDirectoryPage(view, { query: "not-a-registry", page: 100 })
    ).toMatchObject({
      page: 1,
      totalPages: 1,
      registries: [],
      paginatedRegistries: [],
    })
  })

  it("does not give newly observed registries a separate section or duplicate them", () => {
    const health = createHealth({
      status: "observing",
      firstObservedAt: new Date(NOW).toISOString(),
    })
    const result = getRegistryDirectoryPage(
      createRegistryDirectoryView(
        [createRegistry("@new")],
        [createMetadata("@new", 90, health)],
        NOW
      ),
      { query: "", page: 1 }
    )
    expect(result.paginatedRegistries).toHaveLength(1)
    expect(result).not.toHaveProperty("recentlyAdded")
  })
})
