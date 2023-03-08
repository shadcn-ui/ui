import fs from "fs"
import path, { basename, dirname } from "path"

import { components } from "../config/components"

const payload = components
  .map((component) => {
    const files = component.files?.map((file) => {
      const content = fs.readFileSync(
        path.join(process.cwd(), file.dir, file.name),
        "utf8"
      )

      return {
        ...file,
        content,
      }
    })

    return {
      ...component,
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
  path.join(process.cwd(), "pages/api/components.json"),
  JSON.stringify(payload, null, 2)
)
