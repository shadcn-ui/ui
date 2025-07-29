import path from "path"
import { fileURLToPath } from "url"
import { execa, type ExecaChildProcess } from "execa"
import waitPort from "wait-port"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, "../../../..")
const PORT = 4000

export class Registry {
  private process?: ExecaChildProcess
  private _url?: string

  get url(): string {
    if (!this._url) {
      throw new Error("Registry not started. Call start() first.")
    }
    return this._url
  }

  async start(): Promise<void> {
    if (this.process) {
      return
    }

    this.process = execa("pnpm", ["v4:dev"], {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
      stdio: "pipe",
      reject: false,
    })

    try {
      await waitPort({
        port: PORT,
        host: "localhost",
        timeout: 60000,
        interval: 1000,
      })

      this._url = `http://localhost:${PORT}/r`
    } catch (error) {
      this.process.kill()
      this.process = undefined
      throw new Error(`Registry failed to start on port ${PORT}: ${error}`)
    }
  }

  async stop(): Promise<void> {
    if (!this.process) {
      return
    }

    this.process.kill("SIGTERM")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!this.process.killed) {
      this.process.kill("SIGKILL")
    }

    this.process = undefined
    this._url = undefined
  }
}
