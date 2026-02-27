import { spawn } from "node:child_process"

const STRING_OPTIONS = new Map([
  ["components", "PARITY_COMPONENTS"],
  ["base-url", "PARITY_TEST_BASE_URL"],
  ["port", "PARITY_TEST_PORT"],
  ["page-load-timeout-ms", "PARITY_PAGE_LOAD_TIMEOUT_MS"],
  ["component-timeout-ms", "PARITY_COMPONENT_TIMEOUT_MS"],
  ["font-wait-timeout-ms", "PARITY_FONT_WAIT_TIMEOUT_MS"],
  ["image-wait-timeout-ms", "PARITY_IMAGE_WAIT_TIMEOUT_MS"],
  ["setup-timeout-ms", "PARITY_SETUP_TIMEOUT_MS"],
])

const BOOLEAN_OPTIONS = new Map([
  ["skip-build", "PARITY_SKIP_BUILD"],
  ["allow-missing-equivalent", "PARITY_ALLOW_MISSING_EQUIVALENT"],
])

const SHORT_ALIASES = new Map([
  ["c", "components"],
  ["u", "base-url"],
  ["p", "port"],
])

function printHelp() {
  const lines = [
    "Run pixel parity tests with CLI parameters mapped to PARITY_* env vars.",
    "",
    "Usage:",
    "  pnpm --filter=shadcn run test:pixel -- [options] [-- <extra vitest args>]",
    "",
    "Options:",
    "  --components, -c <csv>           -> PARITY_COMPONENTS",
    "  --base-url, -u <url>             -> PARITY_TEST_BASE_URL",
    "  --port, -p <number>              -> PARITY_TEST_PORT",
    "  --page-load-timeout-ms <number>  -> PARITY_PAGE_LOAD_TIMEOUT_MS",
    "  --component-timeout-ms <number>  -> PARITY_COMPONENT_TIMEOUT_MS",
    "  --font-wait-timeout-ms <number>  -> PARITY_FONT_WAIT_TIMEOUT_MS",
    "  --image-wait-timeout-ms <number> -> PARITY_IMAGE_WAIT_TIMEOUT_MS",
    "  --setup-timeout-ms <number>      -> PARITY_SETUP_TIMEOUT_MS",
    "  --skip-build[=true|false]        -> PARITY_SKIP_BUILD",
    "  --no-skip-build                  -> PARITY_SKIP_BUILD=0",
    "  --allow-missing-equivalent       -> PARITY_ALLOW_MISSING_EQUIVALENT=1",
    "  --no-allow-missing-equivalent    -> PARITY_ALLOW_MISSING_EQUIVALENT=0",
    "  -h, --help                       Show this help message",
    "",
    "Examples:",
    "  pnpm --filter=shadcn run test:pixel -- --components ui/calendar,ui/carousel --skip-build",
    "  pnpm --filter=shadcn run test:pixel -- --base-url http://127.0.0.1:4173 -- --maxConcurrency=4",
  ]

  console.log(lines.join("\n"))
}

function parseBoolean(value, optionName) {
  const normalized = value.toLowerCase()
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false
  }

  throw new Error(`Invalid boolean value for --${optionName}: "${value}"`)
}

function isBooleanLiteral(value) {
  return /^(1|0|true|false|yes|no|on|off)$/i.test(value)
}

function parseArgs(argv) {
  const normalizedArgv = argv[0] === "--" ? argv.slice(1) : argv
  const parsedEnv = {}
  const passthrough = []

  for (let i = 0; i < normalizedArgv.length; i += 1) {
    const arg = normalizedArgv[i]

    if (arg === "--") {
      passthrough.push(...normalizedArgv.slice(i + 1))
      break
    }

    if (arg === "-h" || arg === "--help") {
      printHelp()
      process.exit(0)
    }

    if (arg.startsWith("--no-")) {
      const optionName = arg.slice("--no-".length)
      const envKey = BOOLEAN_OPTIONS.get(optionName)
      if (envKey) {
        parsedEnv[envKey] = "0"
        continue
      }

      passthrough.push(arg)
      continue
    }

    if (arg.startsWith("--")) {
      const [rawOption, inlineValue] = arg.slice(2).split("=", 2)
      const stringEnvKey = STRING_OPTIONS.get(rawOption)
      if (stringEnvKey) {
        const nextArg = normalizedArgv[i + 1]
        const value = inlineValue ?? nextArg
        if (!value || value === "--" || (inlineValue === undefined && value.startsWith("-"))) {
          throw new Error(`Missing value for --${rawOption}`)
        }

        parsedEnv[stringEnvKey] = value
        if (inlineValue === undefined) {
          i += 1
        }
        continue
      }

      const boolEnvKey = BOOLEAN_OPTIONS.get(rawOption)
      if (boolEnvKey) {
        if (inlineValue !== undefined) {
          parsedEnv[boolEnvKey] = parseBoolean(inlineValue, rawOption) ? "1" : "0"
          continue
        }

        const nextArg = normalizedArgv[i + 1]
        if (nextArg && !nextArg.startsWith("-") && isBooleanLiteral(nextArg)) {
          parsedEnv[boolEnvKey] = parseBoolean(nextArg, rawOption) ? "1" : "0"
          i += 1
          continue
        }

        parsedEnv[boolEnvKey] = "1"
        continue
      }

      passthrough.push(arg)
      continue
    }

    if (arg.startsWith("-")) {
      const short = arg.slice(1)
      const optionName = SHORT_ALIASES.get(short)
      if (optionName) {
        const envKey = STRING_OPTIONS.get(optionName)
        const value = normalizedArgv[i + 1]
        if (!envKey || !value || value === "--" || value.startsWith("-")) {
          throw new Error(`Missing value for -${short}`)
        }
        parsedEnv[envKey] = value
        i += 1
        continue
      }
    }

    passthrough.push(arg)
  }

  return { parsedEnv, passthrough }
}

function run() {
  try {
    const { parsedEnv, passthrough } = parseArgs(process.argv.slice(2))
    const command = process.platform === "win32" ? "vitest.cmd" : "vitest"
    const args = [
      "run",
      "--config",
      "test/visual/vitest.pixel.config.ts",
      "test/visual/pixel-perfect-vite.test.ts",
      "--maxConcurrency=8",
      ...passthrough,
    ]

    const child = spawn(command, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ...parsedEnv,
      },
    })

    child.on("error", (error) => {
      console.error(error)
      process.exit(1)
    })

    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal)
        return
      }

      process.exit(code ?? 1)
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

run()
