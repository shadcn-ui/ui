import fs from "fs"
import path, { basename } from "path"

import { registry, registrySchema } from "./registry"

const result = registrySchema.safeParse(registry)

if (!result.success) {
  console.error(result.error)
  process.exit(1)
}

const payload = result.data
  .map((entry) => {
    const files = entry.files?.map((file) => {
      const content = fs.readFileSync(path.join(process.cwd(), file), "utf8")

      return {
        name: basename(file),
        content,
      }
    })

    return {
      ...entry,
      files,
    }
  })
  .sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })

fs.writeFileSync(
  path.join(process.cwd(), "app/api/registry/registry.json"),
  JSON.stringify(payload, null, 2)
)

console.log("Done!")
