import { spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"

import {
  cleanRegistryHealthHistory,
  loadRegistryMonitorState,
  publishRegistryHealth,
} from "../lib/registry-health/blob"
import {
  runLocalCliDryRun,
  runRegistryMonitor,
  type RegistryMonitorMode,
} from "../lib/registry-health/monitor"
import {
  registryDirectorySchema,
  registryMonitorOutputSchema,
  registryMonitorStateSchema,
} from "../lib/registry-health/schema"
import directory from "../registry/directory.json"

const PHASES = new Set(["prepare", "check", "publish"] as const)
const MODES = new Set<RegistryMonitorMode>([
  "auto",
  "hourly",
  "daily",
  "weekly",
  "all",
])
const WORK_DIRECTORY = path.resolve(process.cwd(), ".registry-health")
const PREVIOUS_STATE_PATH = path.join(WORK_DIRECTORY, "previous-state.json")
const MONITOR_OUTPUT_PATH = path.join(WORK_DIRECTORY, "monitor-output.json")
const BLOB_ENVIRONMENT_VARIABLES = [
  "BLOB_READ_WRITE_TOKEN",
  "VERCEL_OIDC_TOKEN",
  "BLOB_STORE_ID",
] as const

type MonitorPhase = "prepare" | "check" | "publish"

function getArgument(name: string) {
  const index = process.argv.indexOf(name)
  if (index >= 0) return process.argv[index + 1]

  return process.argv
    .find((argument) => argument.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

function getPhase() {
  const value = getArgument("--phase")
  if (!value) return null

  if (!PHASES.has(value as MonitorPhase)) {
    throw new Error(`Invalid monitor phase: ${value}`)
  }

  return value as MonitorPhase
}

function getMode() {
  const value = getArgument("--mode") ?? process.env.MONITOR_MODE
  const mode = (value ?? "auto") as RegistryMonitorMode

  if (!MODES.has(mode)) {
    throw new Error(`Invalid monitor mode: ${value}`)
  }

  return mode
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const hasVercelOidc =
    process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID

  if (!token && !hasVercelOidc) {
    throw new Error(
      "Blob authentication is missing. Configure BLOB_READ_WRITE_TOKEN outside Vercel or Vercel Blob OIDC inside a linked project."
    )
  }

  return token
}

function assertCredentialFreeCheck() {
  const exposed = BLOB_ENVIRONMENT_VARIABLES.filter((name) => process.env[name])

  if (exposed.length > 0) {
    throw new Error(
      `The check phase must not receive Blob credentials: ${exposed.join(", ")}`
    )
  }
}

async function readJson(pathname: string) {
  return JSON.parse(await fs.readFile(pathname, "utf8")) as unknown
}

async function writeJson(pathname: string, value: unknown) {
  await fs.mkdir(path.dirname(pathname), { recursive: true })
  const temporaryPath = `${pathname}.${process.pid}.tmp`
  await fs.writeFile(temporaryPath, JSON.stringify(value))
  await fs.rename(temporaryPath, pathname)
}

async function writeStepSummary({
  latestPath,
  mode,
  totals,
  diagnostics,
  deleted,
}: {
  latestPath: string
  mode: RegistryMonitorMode
  totals: {
    registries: number
    reachable: number
    unavailable: number
    challenges: number
    itemChecks: number
    dryRuns: number
  }
  diagnostics: string[]
  deleted: number
}) {
  if (!process.env.GITHUB_STEP_SUMMARY) return

  const rows = [
    "## Registry health monitor",
    "",
    `- Mode: \`${mode}\``,
    `- Registries: ${totals.registries}`,
    `- Reachable indexes: ${totals.reachable}`,
    `- Unavailable indexes: ${totals.unavailable}`,
    `- Bot challenges: ${totals.challenges}`,
    `- Item checks: ${totals.itemChecks}`,
    `- Dry runs: ${totals.dryRuns}`,
    `- Expired history deleted: ${deleted}`,
    `- Latest snapshot: ${latestPath}`,
  ]

  if (diagnostics.length > 0) {
    rows.push("", "### Diagnostics", "")
    rows.push(...diagnostics.map((diagnostic) => `- ${diagnostic}`))
  }

  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `${rows.join("\n")}\n`)
}

async function prepareMonitor() {
  const token = getBlobToken()
  const previousState = await loadRegistryMonitorState({ token })

  await fs.rm(MONITOR_OUTPUT_PATH, { force: true })
  await writeJson(PREVIOUS_STATE_PATH, previousState)
  console.log(
    previousState
      ? "Registry health state downloaded."
      : "No previous registry health state found."
  )
}

async function checkRegistries() {
  assertCredentialFreeCheck()

  const previousStateValue = await readJson(PREVIOUS_STATE_PATH)
  const previousState =
    previousStateValue === null
      ? null
      : registryMonitorStateSchema.parse(previousStateValue)
  const parsedDirectory = registryDirectorySchema.parse(directory)
  const cliPath = path.resolve(
    process.cwd(),
    "../../packages/shadcn/dist/index.js"
  )
  const result = await runRegistryMonitor({
    directory: parsedDirectory,
    previousState,
    mode: getMode(),
    runDryRun: (options) => runLocalCliDryRun({ ...options, cliPath }),
  })

  await writeJson(MONITOR_OUTPUT_PATH, result)
  console.log(
    `Registry checks completed for ${result.run.totals.registries} registries.`
  )
}

async function publishMonitor() {
  const token = getBlobToken()
  const result = registryMonitorOutputSchema.parse(
    await readJson(MONITOR_OUTPUT_PATH)
  )
  const publication = await publishRegistryHealth({
    ...result,
    token,
  })
  const cleanup = await cleanRegistryHealthHistory({ token })

  await writeStepSummary({
    latestPath: publication.latestPath,
    mode: result.run.mode,
    totals: result.run.totals,
    diagnostics: result.run.diagnostics,
    deleted: cleanup.deleted,
  })
  await fs.rm(WORK_DIRECTORY, { recursive: true, force: true })
  console.log(`Registry health snapshot published: ${publication.latestPath}`)
}

async function runPackageScript(
  script: string,
  environment: NodeJS.ProcessEnv
) {
  const isWindows = process.platform === "win32"
  const command = isWindows ? "pnpm.cmd" : "pnpm"

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, ["run", script], {
      cwd: process.cwd(),
      env: environment,
      shell: isWindows,
      stdio: "inherit",
    })

    child.on("error", reject)
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `${script} failed with ${signal ? `signal ${signal}` : `exit code ${code}`}`
        )
      )
    })
  })
}

async function runAllPhases() {
  await runPackageScript("registry:health:prepare", process.env)

  const checkEnvironment = { ...process.env }
  for (const name of BLOB_ENVIRONMENT_VARIABLES) {
    delete checkEnvironment[name]
  }
  delete checkEnvironment.GITHUB_STEP_SUMMARY

  await runPackageScript("registry:health:check", checkEnvironment)
  await runPackageScript("registry:health:publish", process.env)
}

async function main() {
  const phase = getPhase()

  if (!phase) {
    await runAllPhases()
    return
  }

  if (phase === "prepare") {
    await prepareMonitor()
    return
  }

  if (phase === "check") {
    await checkRegistries()
    return
  }

  await publishMonitor()
}

main().catch((error) => {
  console.error(
    "Registry health monitor failed:",
    error instanceof Error ? error.message : "Unknown error"
  )
  process.exitCode = 1
})
