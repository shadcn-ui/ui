import { spawn, type ChildProcess } from "node:child_process"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"

import { DEFAULT_STYLE, type RegistryDryRunResult } from "./monitor"

async function runLocalCliDryRun({
  namespace,
  item,
  registryUrl,
  cliPath,
  timeoutMs = 60_000,
  killGraceMs = 5_000,
}: {
  namespace: string
  item: string
  registryUrl: string
  cliPath: string
  timeoutMs?: number
  killGraceMs?: number
}): Promise<RegistryDryRunResult> {
  const startedAt = Date.now()
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "shadcn-registry-health-")
  )

  try {
    await fs.mkdir(path.join(temporaryDirectory, "app"), { recursive: true })
    await Promise.all([
      fs.writeFile(
        path.join(temporaryDirectory, "components.json"),
        JSON.stringify(
          {
            $schema: "https://ui.shadcn.com/schema.json",
            style: DEFAULT_STYLE,
            rsc: true,
            tsx: true,
            tailwind: {
              config: "",
              css: "app/globals.css",
              baseColor: "neutral",
              cssVariables: true,
              prefix: "",
            },
            iconLibrary: "lucide",
            aliases: {
              components: "@/components",
              utils: "@/lib/utils",
              ui: "@/components/ui",
              lib: "@/lib",
              hooks: "@/hooks",
            },
            registries: {
              [namespace]: registryUrl,
            },
          },
          null,
          2
        )
      ),
      fs.writeFile(path.join(temporaryDirectory, "app/globals.css"), ""),
      fs.writeFile(
        path.join(temporaryDirectory, "package.json"),
        JSON.stringify({ private: true })
      ),
    ])

    return await new Promise<RegistryDryRunResult>((resolve) => {
      const child: ChildProcess = spawn(
        process.execPath,
        [
          cliPath,
          "add",
          `${namespace}/${item}`,
          "--dry-run",
          "--yes",
          "--cwd",
          temporaryDirectory,
        ],
        {
          cwd: temporaryDirectory,
          env: getDryRunEnvironment(temporaryDirectory),
          stdio: "ignore",
        }
      )
      let completed = false
      let timedOut = false
      let forceKillTimeout: NodeJS.Timeout | undefined
      const finish = (result: RegistryDryRunResult) => {
        if (completed) return
        completed = true
        clearTimeout(timeout)
        if (forceKillTimeout) clearTimeout(forceKillTimeout)
        resolve(result)
      }
      const timeout = setTimeout(() => {
        timedOut = true
        child.kill("SIGTERM")
        forceKillTimeout = setTimeout(() => {
          if (!completed) child.kill("SIGKILL")
        }, killGraceMs)
      }, timeoutMs)

      child.on("error", () =>
        finish({
          success: false,
          failureCode: timedOut ? "timeout" : "spawn_error",
          durationMs: Date.now() - startedAt,
        })
      )
      child.on("exit", (code, signal) => {
        const failureCode = timedOut
          ? "timeout"
          : code === 0
            ? undefined
            : signal
              ? "terminated"
              : `exit_${code}`

        finish({
          success: !timedOut && code === 0,
          failureCode,
          durationMs: Date.now() - startedAt,
        })
      })
    })
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true })
  }
}

function getDryRunEnvironment(temporaryDirectory: string) {
  return {
    PATH: process.env.PATH,
    TMPDIR: os.tmpdir(),
    XDG_CACHE_HOME: temporaryDirectory,
    XDG_CONFIG_HOME: temporaryDirectory,
    npm_config_userconfig: path.join(temporaryDirectory, ".npmrc"),
    NODE_ENV: "production",
    CI: "1",
    NO_COLOR: "1",
  } satisfies NodeJS.ProcessEnv
}

export { getDryRunEnvironment, runLocalCliDryRun }
