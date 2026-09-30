import os from "os"
import path from "path"
import fs from "fs-extra"

// Absolute path into test/fixtures, stable no matter where the calling
// test file lives. getFixturesDir("config-full") or
// getFixturesDir("frameworks", "next-app").
export function getFixturesDir(...segments: string[]) {
  return path.resolve(__dirname, "../../test/fixtures", ...segments)
}

// Temp dir with guaranteed cleanup. Returns the callback's result.
export async function withTempDir<T>(
  fn: (dir: string) => Promise<T>,
  prefix = "shadcn-test-"
): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix))
  try {
    return await fn(dir)
  } finally {
    await fs.rm(dir, { recursive: true, force: true })
  }
}
