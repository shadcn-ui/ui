import { describe, expect, it } from "vitest"

import { calculateRegistryRanking } from "./rank"
import { registryRankingSchema } from "./schema"

describe("calculateRegistryRanking", () => {
  it.each([
    [0, 78.4],
    [1, 80.63],
    [100, 93.248],
    [500, 98.4],
    [1000, 98.4],
  ])("ranks a health score of 98 with %i unique items", (itemCount, score) => {
    expect(calculateRegistryRanking(98, itemCount)).toEqual({
      version: 1,
      score,
      itemCount,
    })
  })

  it("gives larger catalogs diminishing returns", () => {
    function score(count: number) {
      return calculateRegistryRanking(90, count).score
    }
    expect(score(11) - score(1)).toBeGreaterThan(score(21) - score(11))
    expect(score(21) - score(11)).toBeGreaterThan(score(31) - score(21))
  })

  it("still rewards better health at the same catalog size", () => {
    expect(calculateRegistryRanking(95, 100).score).toBeGreaterThan(
      calculateRegistryRanking(85, 100).score
    )
  })

  it("keeps the published score between zero and 100", () => {
    expect(calculateRegistryRanking(0, 0).score).toBe(0)
    expect(calculateRegistryRanking(100, 500).score).toBe(100)
    expect(calculateRegistryRanking(100, 10000).score).toBe(100)
  })

  it.each([
    { version: 2, score: 90, itemCount: 100 },
    { version: 1, score: 101, itemCount: 100 },
    { version: 1, score: NaN, itemCount: 100 },
    { version: 1, score: 90, itemCount: -1 },
    { version: 1, score: 90, itemCount: 1.5 },
    { version: 1, score: 90, itemCount: 100, homepage: "https://example.com" },
  ])("rejects invalid ranking metadata: %j", (ranking) => {
    expect(registryRankingSchema.safeParse(ranking).success).toBe(false)
  })
})
