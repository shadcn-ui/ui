import { Index } from "@/__registry__"
import { registryItemSchema } from "shadcn/registry"

const memoizedIndex: typeof Index = Object.fromEntries(
  Object.entries(Index).map(([style, items]) => [style, { ...items }])
)

export function getRegistryComponent(name: string) {
  return memoizedIndex[name]?.component
}

export async function getRegistryItem(name: string) {
  const item = memoizedIndex[name]

  if (!item) {
    return null
  }

  // Convert all file paths to object.
  // TODO: remove when we migrate to new registry.
  item.files = item.files.map((file: unknown) =>
    typeof file === "string" ? { path: file } : file
  )

  // Fail early before doing expensive file operations.
  const result = registryItemSchema.safeParse(item)
  if (!result.success) {
    return null
  }

  const files: typeof result.data.files = []
  // for (const file of item.files) {
  //   const content = await getFileContent(file)
  //   const relativePath = path.relative(process.cwd(), file.path)

  //   files.push({
  //     ...file,
  //     path: relativePath,
  //     content,
  //   })
  // }

  // Get meta.
  // Assume the first file is the main file.
  // const meta = await getFileMeta(files[0].path)

  // Fix file paths.
  // files = fixFilePaths(files)

  const parsed = registryItemSchema.safeParse({
    ...result.data,
    files,
    // meta,
  })

  if (!parsed.success) {
    console.error(parsed.error.message)
    return null
  }

  return parsed.data
}

export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (
    match: string,
    path: string,
    type: string,
    component: string
  ) => {
    if (type.endsWith("components")) {
      return `@/components/${component}`
    } else if (type.endsWith("ui")) {
      return `@/components/ui/${component}`
    } else if (type.endsWith("hooks")) {
      return `@/hooks/${component}`
    } else if (type.endsWith("lib")) {
      return `@/lib/${component}`
    }

    return match
  }

  return content.replace(regex, replacement)
}

export type FileTree = {
  name: string
  path?: string
  children?: FileTree[]
}

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>
) {
  const root: FileTree[] = []

  for (const file of files) {
    const path = file.target ?? file.path
    const parts = path.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          // Update existing file node with full path
          existingNode.path = path
        } else {
          // Move to next level in the tree
          currentLevel = existingNode.children!
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path }
          : { name: part, children: [] }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    }
  }

  return root
}
