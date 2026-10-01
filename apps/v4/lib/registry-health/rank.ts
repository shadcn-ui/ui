import { REGISTRY_RANKING_VERSION } from "./schema"

export const REGISTRY_RANKING_ITEM_CAP = 500

export function calculateRegistryRanking(
  healthScore: number,
  itemCount: number
) {
  const breadth =
    Math.log1p(Math.min(itemCount, REGISTRY_RANKING_ITEM_CAP)) /
    Math.log1p(REGISTRY_RANKING_ITEM_CAP)

  return {
    version: REGISTRY_RANKING_VERSION,
    score: Math.round((0.8 * healthScore + 20 * breadth) * 1000) / 1000,
    itemCount,
  }
}
