import { execa } from "execa"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  getGitHubRefCandidates,
  getPreferredGitHubRefNames,
  parseGitLsRemote,
  resolveGitHubRef,
} from "./github-ref"

vi.mock("execa", () => ({
  execa: vi.fn(),
}))

describe("GitHub ref resolution", () => {
  beforeEach(() => {
    vi.mocked(execa).mockReset()
  })

  it("resolves HEAD through git ls-remote", async () => {
    vi.mocked(execa).mockResolvedValueOnce({
      stdout: [
        "ref: refs/heads/main\tHEAD",
        "1111111111111111111111111111111111111111\tHEAD",
      ].join("\n"),
    } as any)

    await expect(resolveGitHubRef({ owner: "acme", repo: "ui" })).resolves.toBe(
      "1111111111111111111111111111111111111111"
    )
    expect(vi.mocked(execa)).toHaveBeenCalledWith(
      "git",
      ["ls-remote", "--symref", "--", "https://github.com/acme/ui.git", "HEAD"],
      {
        env: {
          GIT_TERMINAL_PROMPT: "0",
        },
        timeout: 15_000,
      }
    )
  })

  it("uses a full commit SHA without calling git", async () => {
    await expect(
      resolveGitHubRef({
        owner: "acme",
        repo: "ui",
        ref: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      })
    ).resolves.toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    expect(vi.mocked(execa)).not.toHaveBeenCalled()
  })

  it("prefers branch names before tag names for shorthand refs", () => {
    expect(getPreferredGitHubRefNames("main")).toEqual([
      "refs/heads/main",
      "refs/tags/main^{}",
      "refs/tags/main",
      "main",
    ])
  })

  it("prefers peeled annotated tags over tag objects", async () => {
    vi.mocked(execa).mockResolvedValueOnce({
      stdout: [
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\trefs/tags/v1.0.0",
        "2222222222222222222222222222222222222222\trefs/tags/v1.0.0^{}",
      ].join("\n"),
    } as any)

    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui", ref: "v1.0.0" })
    ).resolves.toBe("2222222222222222222222222222222222222222")
  })

  it("treats short SHAs as refs", async () => {
    vi.mocked(execa).mockResolvedValueOnce({
      stdout: "",
    } as any)

    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui", ref: "abc1234" })
    ).rejects.toThrow('Could not resolve GitHub ref "abc1234"')
    expect(vi.mocked(execa)).toHaveBeenCalledWith(
      "git",
      [
        "ls-remote",
        "--symref",
        "--",
        "https://github.com/acme/ui.git",
        "refs/heads/abc1234",
        "refs/tags/abc1234^{}",
        "refs/tags/abc1234",
        "abc1234",
      ],
      expect.any(Object)
    )
  })

  it("reuses command-local ref cache", async () => {
    const cache = new Map<string, Promise<string>>()
    vi.mocked(execa).mockResolvedValueOnce({
      stdout: "1111111111111111111111111111111111111111\tHEAD",
    } as any)

    await resolveGitHubRef({ owner: "acme", repo: "ui" }, { cache })
    await resolveGitHubRef({ owner: "acme", repo: "ui" }, { cache })

    expect(vi.mocked(execa)).toHaveBeenCalledTimes(1)
  })

  it("removes failed ref resolutions from the command-local cache", async () => {
    const cache = new Map<string, Promise<string>>()
    vi.mocked(execa)
      .mockRejectedValueOnce(
        Object.assign(new Error("timed out"), { timedOut: true })
      )
      .mockResolvedValueOnce({
        stdout: "1111111111111111111111111111111111111111\tHEAD",
      } as any)

    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui" }, { cache })
    ).rejects.toThrow('Failed to resolve GitHub ref "HEAD"')
    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui" }, { cache })
    ).resolves.toBe("1111111111111111111111111111111111111111")

    expect(vi.mocked(execa)).toHaveBeenCalledTimes(2)
  })

  it("returns a clear missing git suggestion", async () => {
    vi.mocked(execa).mockRejectedValueOnce(
      Object.assign(new Error("spawn git ENOENT"), { code: "ENOENT" })
    )

    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui" })
    ).rejects.toMatchObject({
      suggestion:
        "Install Git and try again. Git is required to resolve GitHub registry refs.",
    })
  })

  it("returns a clear timeout suggestion", async () => {
    vi.mocked(execa).mockRejectedValueOnce(
      Object.assign(new Error("timed out"), { timedOut: true })
    )

    await expect(
      resolveGitHubRef({ owner: "acme", repo: "ui" })
    ).rejects.toMatchObject({
      suggestion:
        "GitHub ref resolution timed out. Check your network connection and try again.",
    })
  })
})

describe("GitHub ls-remote parsing", () => {
  beforeEach(() => {
    vi.mocked(execa).mockReset()
  })

  it("parses advertised refs and skips symref lines", () => {
    const refs = parseGitLsRemote(
      [
        "ref: refs/heads/main\tHEAD",
        "1111111111111111111111111111111111111111\tHEAD",
        "2222222222222222222222222222222222222222\trefs/heads/main",
      ].join("\n")
    )

    expect(Object.fromEntries(refs)).toEqual({
      HEAD: "1111111111111111111111111111111111111111",
      "refs/heads/main": "2222222222222222222222222222222222222222",
    })
  })

  it("deduplicates ref candidates", () => {
    expect(getGitHubRefCandidates("refs/heads/main")).toEqual([
      "refs/heads/main",
    ])
  })
})
