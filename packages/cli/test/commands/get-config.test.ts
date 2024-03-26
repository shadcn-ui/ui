import { expect, test, vi } from "vitest"
import { getRegistryBaseColor } from "../../src/utils/registry"

test("should throw error when baseColor not found in the registry", async () => {
  const baseColor = "not-found"
  await expect(getRegistryBaseColor(baseColor)).rejects.toThrow(
    `Base color ${baseColor} is not found.`
  )
});
