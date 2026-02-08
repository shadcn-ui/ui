import path from "path"
import { fileURLToPath } from "url"

import { runCommand } from "./helpers"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.join(__dirname, "../../fixtures/next-app")

describe("runCommand", () => {
  it("should execute the shadcn cli", async () => {
    const result = await runCommand(fixturePath, ["--version"])

    expect(result.exitCode).toBe(0)
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/)
  })
})
