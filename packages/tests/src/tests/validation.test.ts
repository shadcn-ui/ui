import { afterAll, beforeAll, describe, expect, it } from "vitest"
import fs from "fs-extra"
import path from "path"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"
import { TestHelper, TestDataGenerator, performanceMonitor } from "../utils/test-helpers"

// Mock registry for validation tests
const validationRegistry = await createRegistryServer(
  [
    ...TestDataGenerator.generateStyleVariantTest("accordion", ["base-lyra", "radix-nova"]),
    ...TestDataGenerator.generateStyleVariantTest("button", ["base-lyra", "radix-nova"]),
    ...TestDataGenerator.generateStyleVariantTest("tooltip", ["base-lyra", "radix-nova"]),
  ],
  {
    port: 7777,
    path: "/validation",
  }
)

beforeAll(async () => {
  await validationRegistry.start()
})

afterAll(async () => {
  await validationRegistry.stop()
})
// hamza
describe("test validation and utilities", () => {
  describe("TestHelper utilities", () => {
    it("should validate component structure correctly", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@validation": "http://localhost:7777/validation/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@validation/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const isValid = await TestHelper.validateComponentStructure(baseLyraPath, ["Accordion"])

      expect(isValid).toBe(true)
    })

    it("should check style variant consistency", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@validation": "http://localhost:7777/validation/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@validation/button"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/button.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/button.tsx")

      const consistency = await TestHelper.checkStyleVariantConsistency(baseLyraPath, radixNovaPath)

      expect(consistency.consistent).toBe(true)
      expect(consistency.differences).toHaveLength(0)
    })

    it("should validate import differences between variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@validation": "http://localhost:7777/validation/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@validation/tooltip"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx")

      const importAnalysis = await TestHelper.validateImportDifferences(baseLyraPath, radixNovaPath)

      expect(importAnalysis.baseLyraImports).toBeDefined()
      expect(importAnalysis.radixNovaImports).toBeDefined()
      expect(importAnalysis.expectedDifferences).toHaveLength(3)
    })

    it("should extract exports correctly", () => {
      const testContent = `
        export function Button() { return <button>Click</button> }
        export const Input = () => <input />
        export { Button, Input }
      `

      const exports = TestHelper.extractExports(testContent)

      expect(exports).toContain("Button")
      expect(exports).toContain("Input")
    })

    it("should extract data slots correctly", () => {
      const testContent = `
        <div data-slot="accordion">Content</div>
        <span data-slot="accordion-trigger">Trigger</span>
      `

      const slots = TestHelper.extractDataSlots(testContent)

      expect(slots).toContain("accordion")
      expect(slots).toContain("accordion-trigger")
    })

    it("should extract CSS variables correctly", () => {
      const testContent = `
        .class { --accordion-height: 100px; --button-bg: blue; }
      `

      const variables = TestHelper.extractCSSVariables(testContent)

      expect(variables).toContain("--accordion-height")
      expect(variables).toContain("--button-bg")
    })
  })

  describe("TestDataGenerator", () => {
    it("should generate component names", () => {
      const name = TestDataGenerator.generateComponentName()

      expect(typeof name).toBe("string")
      expect(name.length).toBeGreaterThan(0)
    })

    it("should generate registry items", () => {
      const item = TestDataGenerator.generateRegistryItem("TestComponent")

      expect(item.name).toBe("TestComponent")
      expect(item.type).toBe("registry:ui")
      expect(item.files).toHaveLength(1)
      expect(item.files[0].path).toContain("TestComponent")
    })

    it("should generate style variant tests", () => {
      const variants = TestDataGenerator.generateStyleVariantTest("accordion", ["base-lyra", "radix-nova"])

      expect(variants).toHaveLength(2)
      expect(variants[0].name).toBe("accordion")
      expect(variants[0].files[0].path).toContain("base-lyra")
      expect(variants[1].files[0].path).toContain("radix-nova")
    })
  })

  describe("PerformanceMonitor", () => {
    it("should measure execution time", () => {
      const monitor = new PerformanceMonitor()

      monitor.start("test")
      const result = monitor.end("test")

      expect(typeof result).toBe("number")
      expect(result).toBeGreaterThanOrEqual(0)
    })

    it("should measure synchronous operations", () => {
      const monitor = new PerformanceMonitor()

      const result = monitor.measure("test", () => {
        return 42
      })

      expect(result).toBe(42)
    })

    it("should measure asynchronous operations", async () => {
      const monitor = new PerformanceMonitor()

      const result = await monitor.measureAsync("test", async () => {
        return await Promise.resolve(42)
      })

      expect(result).toBe(42)
    })
  })

  describe("test coverage validation", () => {
    it("should validate test coverage", async () => {
      const testFiles = [
        "src/tests/add.test.ts",
        "src/tests/init.test.ts",
        "src/tests/registries.test.ts",
        "src/tests/search.test.ts",
        "src/tests/view.test.ts",
        "src/tests/style-refactoring.test.ts",
        "src/tests/component-differences.test.ts",
        "src/tests/validation.test.ts"
      ]

      const coverage = await TestHelper.validateTestCoverage(
        testFiles.map(file => path.join(__dirname, "..", file))
      )

      expect(coverage.totalFiles).toBe(testFiles.length)
      expect(coverage.coverage).toBeGreaterThan(0)
      expect(coverage.filesWithTests).toBeGreaterThan(0)
    })

    it("should generate test reports", () => {
      const results = {
        totalChecks: 10,
        passed: 8,
        failed: 2,
        successRate: 80,
        details: [
          {
            name: "Test 1",
            status: "✅ PASSED",
            checks: ["Check 1: ✅", "Check 2: ✅"]
          },
          {
            name: "Test 2",
            status: "❌ FAILED",
            checks: ["Check 1: ❌", "Check 2: ✅"]
          }
        ],
        recommendations: [
          "Fix failing tests",
          "Add more edge case coverage"
        ]
      }

      const report = TestHelper.generateTestReport(results)

      expect(report).toContain("# Test Validation Report")
      expect(report).toContain("## Summary")
      expect(report).toContain("## Details")
      expect(report).toContain("## Recommendations")
      expect(report).toContain("Total Checks: 10")
      expect(report).toContain("Passed: 8")
      expect(report).toContain("Failed: 2")
    })
  })

  describe("integration validation", () => {
    it("should validate complete style refactoring workflow", async () => {
      const timer = performanceMonitor.start("integration-test")

      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@validation": "http://localhost:7777/validation/{name}",
      })

      // Add multiple components
      await npxShadcn(fixturePath, ["add", "@validation/accordion", "@validation/button", "@validation/tooltip"])

      // Validate all components were created
      const components = ["accordion", "button", "tooltip"]
      const variants = ["base-lyra", "radix-nova"]

      for (const component of components) {
        for (const variant of variants) {
          const filePath = path.join(fixturePath, `components/ui/${variant}/${component}.tsx`)
          expect(await fs.pathExists(filePath)).toBe(true)
        }
      }

      // Validate consistency across variants
      for (const component of components) {
        const baseLyraPath = path.join(fixturePath, `components/ui/base-lyra/${component}.tsx`)
        const radixNovaPath = path.join(fixturePath, `components/ui/radix-nova/${component}.tsx`)

        const consistency = await TestHelper.checkStyleVariantConsistency(baseLyraPath, radixNovaPath)
        expect(consistency.consistent).toBe(true)
      }

      const duration = performanceMonitor.end("integration-test")
      expect(duration).toBeLessThan(10000) // Should complete within 10 seconds
    })

    it("should handle performance monitoring during tests", async () => {
      const results = []

      for (let i = 0; i < 5; i++) {
        const result = performanceMonitor.measure(`iteration-${i}`, () => {
          // Simulate some work
          let sum = 0
          for (let j = 0; j < 1000; j++) {
            sum += j
          }
          return sum
        })

        results.push(result)
      }

      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(typeof result).toBe("number")
        expect(result).toBeGreaterThan(0)
      })
    })
  })
})
