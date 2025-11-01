import path from "path"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"
import fsExtra from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

const generateOptionsSchema = z.object({
  cwd: z.string(),
  name: z.string().optional(),
  path: z.string().optional(),
})

type GenerateType =
  | "component"
  | "hook"
  | "util"
  | "context"
  | "page"
  | "layout"
  | "api"

const GENERATE_TYPES: GenerateType[] = [
  "component",
  "hook",
  "util",
  "context",
  "page",
  "layout",
  "api",
]

const templates = {
  component: (name: string) => `import * as React from "react"

import { cn } from "@/lib/utils"

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {/* Add your component content here */}
      </div>
    )
  }
)
${name}.displayName = "${name}"

export { ${name} }
`,

  hook: (name: string) => `import * as React from "react"

export function ${name}() {
  // Add your hook logic here
  
  return {
    // Return your hook values here
  }
}
`,

  util: (name: string) => `/**
 * ${name}
 * 
 * @description Add your utility function description here
 */
export function ${name}() {
  // Add your utility logic here
}
`,

  context: (name: string) => `import * as React from "react"

interface ${name}ContextValue {
  // Add your context value type here
}

const ${name}Context = React.createContext<${name}ContextValue | undefined>(
  undefined
)

export interface ${name}ProviderProps {
  children: React.ReactNode
}

export function ${name}Provider({ children }: ${name}ProviderProps) {
  const value: ${name}ContextValue = {
    // Add your context value here
  }

  return (
    <${name}Context.Provider value={value}>
      {children}
    </${name}Context.Provider>
  )
}

export function use${name}() {
  const context = React.useContext(${name}Context)
  if (context === undefined) {
    throw new Error("use${name} must be used within a ${name}Provider")
  }
  return context
}
`,

  page: (name: string) => `import { Metadata } from "next"

export const metadata: Metadata = {
  title: "${name}",
  description: "Description for ${name} page",
}

export default function ${name}Page() {
  return (
    <div className="container">
      <h1>${name}</h1>
      {/* Add your page content here */}
    </div>
  )
}
`,

  layout: (name: string) => `import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "${name}",
    template: \`%s | ${name}\`,
  },
  description: "Description for ${name} layout",
}

export default function ${name}Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {/* Add your layout wrapper here */}
      {children}
    </div>
  )
}
`,

  api: (name: string) => `import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Add your GET logic here
    return NextResponse.json({ message: "Success" })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Add your POST logic here
    return NextResponse.json({ message: "Success", data: body })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
`,
}

const fileExtensions: Record<GenerateType, string> = {
  component: ".tsx",
  hook: ".tsx",
  util: ".ts",
  context: ".tsx",
  page: ".tsx",
  layout: ".tsx",
  api: ".ts",
}

const defaultPaths: Record<GenerateType, string> = {
  component: "components",
  hook: "hooks",
  util: "lib",
  context: "contexts",
  page: "app",
  layout: "app",
  api: "app/api",
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

export const generate = new Command()
  .name("generate")
  .alias("gen")
  .description("generate boilerplate code for various types")
  .argument("<type>", `type of code to generate (${GENERATE_TYPES.join(", ")})`)
  .argument("[name]", "name of the file/component to generate")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-p, --path <path>", "custom path for the generated file")
  .action(async (type: string, name: string | undefined, opts) => {
    try {
      const options = generateOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        name,
        path: opts.path,
      })

      if (!GENERATE_TYPES.includes(type as GenerateType)) {
        logger.error(
          `Invalid type "${type}". Must be one of: ${GENERATE_TYPES.join(", ")}`
        )
        process.exit(1)
      }

      const generateType = type as GenerateType

      let fileName = options.name
      if (!fileName) {
        const response = await prompts({
          type: "text",
          name: "name",
          message: `What is the name of the ${generateType}?`,
          validate: (value) =>
            value.length > 0 ? true : "Name is required",
        })

        if (!response.name) {
          logger.error("Name is required")
          process.exit(1)
        }

        fileName = response.name
      }

      if (!fileName) {
        logger.error("Name is required")
        process.exit(1)
      }

      let formattedName = fileName
      let fileNameForPath = fileName

      if (generateType === "component" || generateType === "context") {
        formattedName = toPascalCase(fileName)
        fileNameForPath = toKebabCase(fileName)
      } else if (generateType === "hook") {
        formattedName = toCamelCase(fileName)
        formattedName = formattedName.replace(/^use/, "")
        formattedName = "use" + formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
        fileNameForPath = toKebabCase(fileName)
      } else if (generateType === "page" || generateType === "layout") {
        formattedName = toPascalCase(fileName)
        fileNameForPath = toKebabCase(fileName)
      } else {
        formattedName = toCamelCase(fileName)
        fileNameForPath = toKebabCase(fileName)
      }

      const defaultPath = defaultPaths[generateType]
      const customPath = options.path
      const targetDir = customPath
        ? path.resolve(options.cwd, customPath)
        : path.resolve(options.cwd, defaultPath)

      const extension = fileExtensions[generateType]
      let targetFile: string

      if (generateType === "page") {
        targetFile = path.join(targetDir, fileNameForPath, "page" + extension)
      } else if (generateType === "layout") {
        targetFile = path.join(targetDir, fileNameForPath, "layout" + extension)
      } else if (generateType === "api") {
        targetFile = path.join(targetDir, fileNameForPath, "route" + extension)
      } else {
        targetFile = path.join(targetDir, fileNameForPath + extension)
      }

      if (fsExtra.existsSync(targetFile)) {
        const response = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `File ${path.relative(options.cwd, targetFile)} already exists. Overwrite?`,
          initial: false,
        })

        if (!response.overwrite) {
          logger.info("Operation cancelled")
          process.exit(0)
        }
      }

      
      const template = templates[generateType]
      const content = template(formattedName)

      await fsExtra.ensureDir(path.dirname(targetFile))


      await fsExtra.writeFile(targetFile, content, "utf-8")

      logger.success(
        `✓ Generated ${highlighter.info(generateType)} at ${highlighter.info(path.relative(options.cwd, targetFile))}`
      )

      logger.break()
      logger.info("Next steps:")
      if (generateType === "component") {
        logger.log(
          `  - Import: ${highlighter.info(`import { ${formattedName} } from "@/components/${fileNameForPath}"`)}`
        )
        logger.log(`  - Use: ${highlighter.info(`<${formattedName} />`)}\n`)
      } else if (generateType === "hook") {
        logger.log(
          `  - Import: ${highlighter.info(`import { ${formattedName} } from "@/hooks/${fileNameForPath}"`)}`
        )
        logger.log(`  - Use: ${highlighter.info(`const data = ${formattedName}()`)}\n`)
      } else if (generateType === "context") {
        logger.log(
          `  - Import: ${highlighter.info(`import { ${formattedName}Provider, use${formattedName} } from "@/contexts/${fileNameForPath}"`)}`
        )
        logger.log(`  - Wrap: ${highlighter.info(`<${formattedName}Provider>...</${formattedName}Provider>`)}\n`)
      } else if (generateType === "util") {
        logger.log(
          `  - Import: ${highlighter.info(`import { ${formattedName} } from "@/lib/${fileNameForPath}"`)}`
        )
        logger.log(`  - Use: ${highlighter.info(`${formattedName}()`)}\n`)
      } else if (generateType === "page") {
        logger.log(`  - Navigate to: ${highlighter.info(`/${fileNameForPath}`)}\n`)
      } else if (generateType === "api") {
        logger.log(`  - Endpoint: ${highlighter.info(`/api/${fileNameForPath}`)}\n`)
      }
    } catch (error) {
      handleError(error)
    }
  })
