import { execa } from "execa"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { withRegistryContext } from "./context"
import {
  encodeGitHubPath,
  fetchGitHubFileViaGh,
  fetchGitHubFileViaRest,
  getEnvGitHubToken,
  GitHubTransportError,
  readGitHubResponseTextWithLimit,
  resolveGitHubRefViaAuth,
} from "./github-cli"

vi.mock("execa", () => ({
  execa: vi.fn(),
}))

const server = setupServer()
const ADDRESS = { owner: "acme", repo: "ui" }
const SHA = "1111111111111111111111111111111111111111"
const BRANCH_SHA = "2222222222222222222222222222222222222222"
const TAG_SHA = "3333333333333333333333333333333333333333"

describe("github-cli", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" })
  })

  beforeEach(() => {
    vi.stubEnv("GH_TOKEN", "")
    vi.stubEnv("GITHUB_TOKEN", "")
    vi.mocked(execa).mockReset()
  })

  afterEach(() => {
    server.resetHandlers()
    vi.unstubAllEnvs()
  })

  afterAll(() => {
    server.close()
  })

  describe("getEnvGitHubToken", () => {
    it("returns null when no token is configured", () => {
      expect(getEnvGitHubToken()).toBeNull()
    })

    it("prefers GH_TOKEN over GITHUB_TOKEN", () => {
      vi.stubEnv("GH_TOKEN", "gh-token")
      vi.stubEnv("GITHUB_TOKEN", "github-token")

      expect(getEnvGitHubToken()).toBe("gh-token")
    })

    it("trims token values", () => {
      vi.stubEnv("GH_TOKEN", "  padded-token  ")

      expect(getEnvGitHubToken()).toBe("padded-token")
    })

    it("falls back to a valid second variable when the first is unsafe", () => {
      vi.stubEnv("GH_TOKEN", "bad token with spaces")
      vi.stubEnv("GITHUB_TOKEN", "good-token")

      expect(getEnvGitHubToken()).toBe("good-token")
    })

    it("rejects tokens with control characters", () => {
      vi.stubEnv("GH_TOKEN", "bad\ntoken")

      expect(getEnvGitHubToken()).toBeNull()
    })

    it("reads through the scoped registry context env", () => {
      vi.stubEnv("GH_TOKEN", "process-token")

      const token = withRegistryContext(() => getEnvGitHubToken(), {
        env: { GH_TOKEN: "context-token" },
      })

      expect(token).toBe("context-token")
    })

    it("does not fall back to process.env when a context env is set", () => {
      vi.stubEnv("GH_TOKEN", "process-token")

      const token = withRegistryContext(() => getEnvGitHubToken(), {
        env: {},
      })

      expect(token).toBeNull()
    })
  })

  describe("fetchGitHubFileViaGh", () => {
    it("invokes gh with pinned hostname, fixed headers, and a hermetic env", async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: "file content" } as any)

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "components/ui/button.tsx")
      ).resolves.toBe("file content")

      expect(vi.mocked(execa)).toHaveBeenCalledWith(
        "gh",
        [
          "api",
          "--hostname",
          "github.com",
          `repos/acme/ui/contents/components/ui/button.tsx?ref=${SHA}`,
          "-H",
          "Accept: application/vnd.github.raw+json",
          "-H",
          "X-GitHub-Api-Version: 2022-11-28",
        ],
        expect.objectContaining({
          extendEnv: false,
          timeout: 15_000,
          stripFinalNewline: false,
        })
      )

      const env = (vi.mocked(execa).mock.calls[0] as any[])[2].env as NodeJS.ProcessEnv
      expect(env.GH_HOST).toBe("github.com")
      expect(env.GH_PROMPT_DISABLED).toBe("1")
      expect(env.GH_NO_UPDATE_NOTIFIER).toBe("1")
      expect(env.NO_COLOR).toBe("1")
      expect(env).not.toHaveProperty("GH_TOKEN")
      expect(env).not.toHaveProperty("GITHUB_TOKEN")
      expect(env).not.toHaveProperty("GH_ENTERPRISE_TOKEN")
      expect(env).not.toHaveProperty("GITHUB_ENTERPRISE_TOKEN")
      expect(env).not.toHaveProperty("GH_DEBUG")
      expect(env).not.toHaveProperty("DEBUG")
      expect(env).not.toHaveProperty("GH_FORCE_TTY")
      expect(env).not.toHaveProperty("GH_TELEMETRY")
    })

    it("scrubs inherited gh env vars even when set in the parent", async () => {
      vi.stubEnv("GH_HOST", "github.enterprise.example")
      vi.stubEnv("GH_TOKEN", "inherited-token")
      vi.stubEnv("GH_DEBUG", "api")
      vi.mocked(execa).mockResolvedValueOnce({ stdout: "ok" } as any)

      await fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")

      const env = (vi.mocked(execa).mock.calls[0] as any[])[2].env as NodeJS.ProcessEnv
      expect(env.GH_HOST).toBe("github.com")
      expect(env).not.toHaveProperty("GH_TOKEN")
      expect(env).not.toHaveProperty("GH_DEBUG")
    })

    it("encodes path segments without encoding separators", async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: "ok" } as any)

      await fetchGitHubFileViaGh(ADDRESS, SHA, "dir with space/a?b.tsx")

      expect(vi.mocked(execa).mock.calls[0]![1]).toContain(
        `repos/acme/ui/contents/dir%20with%20space/a%3Fb.tsx?ref=${SHA}`
      )
    })

    it("classifies a missing gh binary", async () => {
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(new Error("spawn gh ENOENT"), { code: "ENOENT" })
      )

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
      ).rejects.toMatchObject({ kind: "enoent" })
    })

    it("classifies a timeout", async () => {
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(new Error("timed out"), { timedOut: true })
      )

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
      ).rejects.toMatchObject({ kind: "timeout" })
    })

    it("classifies an unauthenticated gh", async () => {
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(new Error("exit 4"), {
          stderr:
            "To get started with GitHub CLI, please run:  gh auth login",
        })
      )

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
      ).rejects.toMatchObject({ kind: "unauthenticated" })
    })

    it("parses a validated HTTP status from gh stderr", async () => {
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(new Error("exit 1"), {
          stderr: "gh: Not Found (HTTP 404)",
        })
      )

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
      ).rejects.toMatchObject({ kind: "http", statusCode: 404 })
    })

    it("treats unknown stderr as a generic network failure", async () => {
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(new Error("exit 1"), { stderr: "something odd" })
      )

      await expect(
        fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
      ).rejects.toMatchObject({ kind: "network" })
    })

    it("never leaks subprocess output into the sanitized failure", async () => {
      const secret = "ghp_secret_value_1234567890"
      vi.mocked(execa).mockRejectedValueOnce(
        Object.assign(
          new Error(`Command failed: gh api ...\n${secret}\nprivate source`),
          {
            stderr: `gh: boom ${secret} (HTTP 500)`,
            stdout: `partial private content ${secret}`,
          }
        )
      )

      const error = await fetchGitHubFileViaGh(
        ADDRESS,
        SHA,
        "button.tsx"
      ).catch((caught) => caught)

      expect(error).toBeInstanceOf(GitHubTransportError)
      expect(error.statusCode).toBe(500)
      const rendered = JSON.stringify({
        message: error.message,
        stack: error.stack,
        ...error,
      })
      expect(rendered).not.toContain(secret)
      expect(rendered).not.toContain("private")
    })

    it("bounds concurrent gh processes to eight", async () => {
      let active = 0
      let maxActive = 0
      vi.mocked(execa).mockImplementation((() => {
        active += 1
        maxActive = Math.max(maxActive, active)
        return new Promise((resolve) =>
          setTimeout(() => {
            active -= 1
            resolve({ stdout: "ok" })
          }, 5)
        )
      }) as any)

      await Promise.all(
        Array.from({ length: 20 }, (_, index) =>
          fetchGitHubFileViaGh(ADDRESS, SHA, `file-${index}.tsx`)
        )
      )

      expect(maxActive).toBeLessThanOrEqual(8)
      expect(maxActive).toBeGreaterThan(1)
    })
  })

  describe("fetchGitHubFileViaRest", () => {
    it("sends the token to api.github.com with the raw media type", async () => {
      let capturedHeaders: Headers | undefined
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/contents/button.tsx",
          ({ request }) => {
            capturedHeaders = request.headers
            return HttpResponse.text("file content")
          }
        )
      )

      await expect(
        fetchGitHubFileViaRest(ADDRESS, SHA, "button.tsx", "test-token")
      ).resolves.toBe("file content")

      expect(capturedHeaders?.get("authorization")).toBe("Bearer test-token")
      expect(capturedHeaders?.get("accept")).toBe(
        "application/vnd.github.raw+json"
      )
      expect(capturedHeaders?.get("x-github-api-version")).toBe("2022-11-28")
    })

    it("classifies HTTP failures without leaking the token", async () => {
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/contents/button.tsx",
          () => new HttpResponse(null, { status: 401 })
        )
      )

      const error = await fetchGitHubFileViaRest(
        ADDRESS,
        SHA,
        "button.tsx",
        "super-secret-token"
      ).catch((caught) => caught)

      expect(error).toBeInstanceOf(GitHubTransportError)
      expect(error.statusCode).toBe(401)
      expect(
        JSON.stringify({ message: error.message, ...error })
      ).not.toContain("super-secret-token")
    })

    it("rejects oversized files by content length", async () => {
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/contents/button.tsx",
          () =>
            new HttpResponse("tiny", {
              headers: { "Content-Length": String(100 * 1024 * 1024) },
            })
        )
      )

      await expect(
        fetchGitHubFileViaRest(ADDRESS, SHA, "button.tsx", "test-token")
      ).rejects.toMatchObject({ kind: "oversize" })
    })
  })

  describe("readGitHubResponseTextWithLimit", () => {
    it("reads a body within the limit", async () => {
      await expect(
        readGitHubResponseTextWithLimit(new Response("hello"), 10)
      ).resolves.toBe("hello")
    })

    it("rejects a streamed body that crosses the limit", async () => {
      await expect(
        readGitHubResponseTextWithLimit(
          new Response("this is longer than the limit"),
          10
        )
      ).rejects.toMatchObject({ kind: "oversize" })
    })
  })

  describe("resolveGitHubRefViaAuth (token mode)", () => {
    beforeEach(() => {
      vi.stubEnv("GH_TOKEN", "test-token")
    })

    it("prefers the branch when a branch and tag share a name", async () => {
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/commits/heads/release",
          () => HttpResponse.json({ sha: BRANCH_SHA })
        ),
        http.get(
          "https://api.github.com/repos/acme/ui/commits/tags/release",
          () => HttpResponse.json({ sha: TAG_SHA })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "release", "token")
      ).resolves.toBe(BRANCH_SHA)
    })

    it("falls back to the tag only on a branch 404", async () => {
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/commits/heads/v1.0.0",
          () => new HttpResponse(null, { status: 404 })
        ),
        http.get(
          "https://api.github.com/repos/acme/ui/commits/tags/v1.0.0",
          () => HttpResponse.json({ sha: TAG_SHA })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "v1.0.0", "token")
      ).resolves.toBe(TAG_SHA)
    })

    it("treats a non-404 branch failure as terminal", async () => {
      let tagRequests = 0
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/commits/heads/main",
          () => new HttpResponse(null, { status: 500 })
        ),
        http.get(
          "https://api.github.com/repos/acme/ui/commits/tags/main",
          () => {
            tagRequests += 1
            return HttpResponse.json({ sha: TAG_SHA })
          }
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "main", "token")
      ).rejects.toMatchObject({ kind: "http", statusCode: 500 })
      expect(tagRequests).toBe(0)
    })

    it("resolves HEAD through the commits endpoint", async () => {
      server.use(
        http.get("https://api.github.com/repos/acme/ui/commits/HEAD", () =>
          HttpResponse.json({ sha: SHA })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "HEAD", "token")
      ).resolves.toBe(SHA)
    })

    it("resolves fully qualified branch and tag refs directly", async () => {
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/commits/heads/main",
          () => HttpResponse.json({ sha: BRANCH_SHA })
        ),
        http.get(
          "https://api.github.com/repos/acme/ui/commits/tags/v1.0.0",
          () => HttpResponse.json({ sha: TAG_SHA })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/heads/main", "token")
      ).resolves.toBe(BRANCH_SHA)
      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/tags/v1.0.0", "token")
      ).resolves.toBe(TAG_SHA)
    })

    it("resolves other qualified refs through the git refs API with tag peeling", async () => {
      const tagObjectSha = "4444444444444444444444444444444444444444"
      server.use(
        http.get(
          "https://api.github.com/repos/acme/ui/git/ref/pull/1/head",
          () =>
            HttpResponse.json({
              object: { type: "tag", sha: tagObjectSha },
            })
        ),
        http.get(
          `https://api.github.com/repos/acme/ui/git/tags/${tagObjectSha}`,
          () =>
            HttpResponse.json({
              object: { type: "commit", sha: SHA },
            })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/pull/1/head", "token")
      ).resolves.toBe(SHA)
    })

    it("encodes unsafe ref characters", async () => {
      let capturedUrl: string | undefined
      server.use(
        http.get("https://api.github.com/*", ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({ sha: SHA })
        })
      )

      await resolveGitHubRefViaAuth(ADDRESS, "a?b&c", "token")

      expect(capturedUrl).toContain("/commits/heads/a%3Fb%26c")
    })

    it("rejects malformed SHAs from the API", async () => {
      server.use(
        http.get("https://api.github.com/repos/acme/ui/commits/heads/main", () =>
          HttpResponse.json({ sha: "not-a-sha" })
        )
      )

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/heads/main", "token")
      ).rejects.toMatchObject({ kind: "invalid-response" })
    })
  })

  describe("resolveGitHubRefViaAuth (gh mode)", () => {
    it("resolves through gh api and validates the SHA", async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        stdout: JSON.stringify({ sha: SHA }),
      } as any)

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/heads/main", "gh")
      ).resolves.toBe(SHA)

      expect(vi.mocked(execa).mock.calls[0]![1]).toContain(
        "repos/acme/ui/commits/heads/main"
      )
      expect(vi.mocked(execa).mock.calls[0]![1]).toContain("--hostname")
    })

    it("rejects unparseable gh output", async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        stdout: "not json",
      } as any)

      await expect(
        resolveGitHubRefViaAuth(ADDRESS, "refs/heads/main", "gh")
      ).rejects.toMatchObject({ kind: "invalid-response" })
    })
  })

  describe("encodeGitHubPath", () => {
    it("encodes segments and preserves separators", () => {
      expect(encodeGitHubPath("a b/c?d/e%f")).toBe("a%20b/c%3Fd/e%25f")
    })
  })
})
