import { describe, expect, test } from "vitest"

import { isSafeTarget } from "./is-safe-target"

describe("isSafeTarget", () => {
  const cwd = "/foo/bar"

  describe("should reject path traversal attempts", () => {
    test.each([
      {
        description: "basic path traversal with ../",
        target: "../../etc/passwd",
      },
      {
        description: "nested path traversal",
        target: "ui/../../../etc/hosts",
      },
      {
        description: "path traversal with ~/../",
        target: "~/../../../.ssh/authorized_keys",
      },
      {
        description: "absolute paths outside project",
        target: "/etc/passwd",
      },
      {
        description: "paths that resolve outside project root",
        target: "foo/bar/../../../../etc/passwd",
      },
      {
        description: "URL-encoded path traversal",
        target: "%2e%2e%2f%2e%2e%2fetc%2fpasswd",
      },
      {
        description: "double URL-encoded sequences",
        target: "%252e%252e%252fetc%252fpasswd",
      },
      {
        description: "mixed encoded/plain traversal",
        target: "..%2f..%2fetc%2fpasswd",
      },
      {
        description: "null byte injection",
        target: "valid/path\0../../etc/passwd",
      },
      {
        description: "Windows-style path traversal",
        target: "..\\..\\Windows\\System32\\config",
      },
      {
        description: "Windows absolute paths",
        target: "C:\\Windows\\System32\\drivers\\etc\\hosts",
      },
      {
        description: "mixed separator traversal",
        target: "foo\\..\\../etc/passwd",
      },
      {
        description: "current directory reference attacks",
        target: "foo/./././../../../etc/passwd",
      },
      {
        description: "control characters in paths",
        target: "foo/\x01\x02/../../etc/passwd",
      },
      {
        description: "Unicode normalization attacks",
        target: "foo/../\u2025/etc/passwd",
      },
      {
        description:
          "path traversal with square brackets outside [...] pattern",
        target: "foo/[bar]/../../etc/passwd",
      },
    ])("$description", ({ target }) => {
      expect(isSafeTarget(target, cwd)).toBe(false)
    })
  })

  describe("should accept safe paths", () => {
    test.each([
      {
        description: "simple relative path",
        target: "ui/button.tsx",
      },
      {
        description: "nested relative path",
        target: "components/ui/button.tsx",
      },
      {
        description: "home directory expansion",
        target: "~/foo.json",
      },
      {
        description: "nested home directory path",
        target: "~/components/button.tsx",
      },
      {
        description: "dot in filename",
        target: "components/.env.local",
      },
      {
        description: "path with spaces",
        target: "my components/button.tsx",
      },
      {
        description: "path with special characters",
        target: "components/@ui/button.tsx",
      },
      {
        description: "framework routing with square brackets",
        target: "pages/[id].tsx",
      },
      {
        description: "catch-all routes with [...param]",
        target: "server/api/auth/[...].ts",
      },
      {
        description: "optional catch-all routes",
        target: "pages/[[...slug]].tsx",
      },
      {
        description: "dollar sign routes",
        target: "routes/$userId.tsx",
      },
      {
        description: "complex routing patterns",
        target: "app/[locale]/[...segments]/page.tsx",
      },
    ])("$description", ({ target }) => {
      expect(isSafeTarget(target, cwd)).toBe(true)
    })
  })

  describe("edge cases", () => {
    test("should handle empty string", () => {
      expect(isSafeTarget("", cwd)).toBe(true)
    })

    test("should handle single dot", () => {
      expect(isSafeTarget(".", cwd)).toBe(true)
    })

    test("should reject malformed URL encoding", () => {
      expect(isSafeTarget("%zz%ff%2e%2e%2f", cwd)).toBe(false)
    })

    test("should handle paths at project root", () => {
      expect(isSafeTarget("/foo/bar/test.txt", cwd)).toBe(true)
    })

    test("should reject paths just outside project root", () => {
      expect(isSafeTarget("/foo/test.txt", cwd)).toBe(false)
    })
  })
})
