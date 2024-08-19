import { Config } from "@/src/utils/get-config"
import { fetchTree, getRegistryIndex, resolveTree } from "@/src/utils/registry"
import { RegistryItem } from "@/src/utils/registry/schema"
import { z } from "zod"

export async function updateRegistryDependencies(
  registryDependencies: RegistryItem["registryDependencies"],
  config: Config
) {
  if (!registryDependencies?.length) {
    return
  }

  const registryIndex = await getRegistryIndex()
  if (!registryIndex) {
    return null
  }

  const tree = await resolveTree(registryIndex, registryDependencies)
  const payload = await fetchTree(config.style, tree)

  if (!payload?.length) {
    return
  }

  await Promise.all(
    payload.map(async (dependency) => {
      console.log(dependency)
      // const targetPath = await getRegistryItemFileTargetPath(file, config)

      // if (!targetPath) {
      //   return
      // }

      // console.log(targetPath)
    })
  )
}
