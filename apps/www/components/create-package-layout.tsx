"use client"

import { useMemo } from "react"
import { AsciiTree } from "oo-ascii-tree"

import { PackageFile, useFolder } from "@/hooks/use-folder-structure"

type Folder = {
  files: string[]
  last?: string[]
  children: {
    [key: string]: Folder
  }
}

type EasyFolder = Pick<Folder, "children" | "files">

const getASCII = (folder: Folder, rootName: string) => {
  const tree = new AsciiTree(rootName)
  tree.add(...folder.files.map((f) => new AsciiTree(f)))
  Object.entries(folder.children).forEach(([key, value]) => {
    tree.add(getASCII(value, key))
  })
  folder.last && tree.add(...folder.last.map((f) => new AsciiTree(f)))
  return tree
}

const root = (packages: Folder, packageName: string): Folder => ({
  files: [],
  last: [
    "component.config.json",
    "package.json",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.json",
  ],
  children: {
    app: {
      files: ["layout.tsx", "page.tsx"],
      children: {},
    },
    components: {
      files: [],
      children: {
        ui: {
          files: ["alert-dialog.tsx", "button.tsx", "dropdown-menu.tsx", "..."],
          children: {},
        },
        addons: {
          files: [],
          children: {
            [packageName]: packages,
          },
        },
      },
    },
    lib: {
      files: ["utils.ts"],
      children: {},
    },
    styles: {
      files: ["globals.css"],
      children: {},
    },
  },
})

const packageToFolderProcess = (files: PackageFile["files"]): EasyFolder => {
  if (!files.length)
    return { children: {}, files: ["index.tsx", "README.md"] } as EasyFolder

  let tempRoot = {
    children: {},
    files: [],
  } as EasyFolder

  for (const file of files) {
    const dirs = file.dir.split("/")

    const iterator = (tempRoot: any, index: number, fileName: string) => {
      if (dirs[index + 1]) {
        tempRoot.children[dirs[index + 1]] = iterator(
          tempRoot.children[dirs[index]] || {
            children: {},
            files: [],
          },
          index + 1,
          fileName
        )
      } else tempRoot.files.push(fileName)
      return tempRoot
    }

    if (dirs.length === 1) tempRoot.files.push(file.name)
    else tempRoot = iterator(tempRoot, 1, file.name)
  }

  return tempRoot as EasyFolder
}

export const PackageFolderStructure = () => {
  const [packages] = useFolder()
  const tree = new AsciiTree()

  const treeData = useMemo(
    () =>
      getASCII(
        root(
          {
            ...packageToFolderProcess(packages.files || []),
            last: [],
          },
          packages.name || "your-component-name"
        ),
        "root"
      ),
    [packages]
  )
  tree.add(treeData)
  return (
    <div className="xl:absolute xl:right-[-100px] xl:mt-5 xl:w-[400px]">
      <pre className="mt-2 w-full rounded-md bg-zinc-950 p-4 dark:bg-zinc-900">
        <code className="text-white">
          {tree.toString()}
          <div className="w-full bg-white/20 text-white"></div>
        </code>
      </pre>
    </div>
  )
}
