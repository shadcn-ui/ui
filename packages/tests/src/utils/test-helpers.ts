import fs from "fs-extra"
import path from "path"

// Additional test utilities for comprehensive testing
export class TestHelper {
  static async validateComponentStructure(filePath: string, expectedExports: string[]): Promise<boolean> {
    if (!await fs.pathExists(filePath)) return false
    
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Check for expected exports
    const hasAllExports = expectedExports.every(exp => content.includes(`export ${exp}`))
    
    // Check for proper component structure
    const hasFunction = content.includes('function') || content.includes('const')
    const hasReturn = content.includes('return')
    const hasImport = content.includes('import')
    
    return hasAllExports && hasFunction && hasReturn && hasImport
  }

  static async checkStyleVariantConsistency(baseLyraPath: string, radixNovaPath: string): Promise<{
    consistent: boolean
    differences: string[]
  }> {
    const differences: string[] = []
    
    if (!await fs.pathExists(baseLyraPath) || !await fs.pathExists(radixNovaPath)) {
      differences.push('Missing variant files')
      return { consistent: false, differences }
    }
    
    const baseLyraContent = await fs.readFile(baseLyraPath, 'utf-8')
    const radixNovaContent = await fs.readFile(radixNovaPath, 'utf-8')
    
    // Check for consistent exports
    const baseExports = this.extractExports(baseLyraContent)
    const novaExports = this.extractExports(radixNovaContent)
    
    if (JSON.stringify(baseExports.sort()) !== JSON.stringify(novaExports.sort())) {
      differences.push('Inconsistent exports between variants')
    }
    
    // Check for consistent data-slot attributes
    const baseSlots = this.extractDataSlots(baseLyraContent)
    const novaSlots = this.extractDataSlots(radixNovaContent)
    
    if (JSON.stringify(baseSlots.sort()) !== JSON.stringify(novaSlots.sort())) {
      differences.push('Inconsistent data-slot attributes')
    }
    
    return {
      consistent: differences.length === 0,
      differences
    }
  }

  static extractExports(content: string): string[] {
    const exportRegex = /export\s+(?:function|const|class)\s+(\w+)/g
    const exports: string[] = []
    let match
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1])
    }
    
    // Also check for export { ... } syntax
    const exportBlockRegex = /export\s*{\s*([^}]+)\s*}/g
    while ((match = exportBlockRegex.exec(content)) !== null) {
      const items = match[1].split(',').map(item => item.trim().split(' as ')[0])
      exports.push(...items)
    }
    
    return [...new Set(exports)] // Remove duplicates
  }

  static extractDataSlots(content: string): string[] {
    const slotRegex = /data-slot="([^"]+)"/g
    const slots: string[] = []
    let match
    
    while ((match = slotRegex.exec(content)) !== null) {
      slots.push(match[1])
    }
    
    return [...new Set(slots)] // Remove duplicates
  }

  static async validateImportDifferences(baseLyraPath: string, radixNovaPath: string): Promise<{
    baseLyraImports: string[]
    radixNovaImports: string[]
    expectedDifferences: string[]
  }> {
    const baseLyraContent = await fs.readFile(baseLyraPath, 'utf-8')
    const radixNovaContent = await fs.readFile(radixNovaPath, 'utf-8')
    
    const baseLyraImports = this.extractImports(baseLyraContent)
    const radixNovaImports = this.extractImports(radixNovaContent)
    
    // Expected differences based on style refactoring
    const expectedDifferences = [
      'base-lyra should use @base-ui/react',
      'radix-nova should use radix-ui',
      'radix-nova should use React.ComponentProps'
    ]
    
    return {
      baseLyraImports,
      radixNovaImports,
      expectedDifferences
    }
  }

  static extractImports(content: string): string[] {
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"];?/g
    const imports: string[] = []
    let match
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }
    
    return [...new Set(imports)] // Remove duplicates
  }

  static async checkCSSVariableConsistency(baseLyraPath: string, radixNovaPath: string): Promise<{
    consistent: boolean
    baseVariables: string[]
    novaVariables: string[]
  }> {
    const baseLyraContent = await fs.readFile(baseLyraPath, 'utf-8')
    const radixNovaContent = await fs.readFile(radixNovaPath, 'utf-8')
    
    const baseVariables = this.extractCSSVariables(baseLyraContent)
    const novaVariables = this.extractCSSVariables(radixNovaContent)
    
    return {
      consistent: JSON.stringify(baseVariables.sort()) === JSON.stringify(novaVariables.sort()),
      baseVariables,
      novaVariables
    }
  }

  static extractCSSVariables(content: string): string[] {
    const variableRegex = /--[\w-]+/g
    const variables: string[] = []
    let match
    
    while ((match = variableRegex.exec(content)) !== null) {
      variables.push(match[0])
    }
    
    return [...new Set(variables)] // Remove duplicates
  }

  static async validateTestCoverage(testFiles: string[]): Promise<{
    totalFiles: number
    filesWithTests: number
    coverage: number
    missingTests: string[]
  }> {
    const results = {
      totalFiles: testFiles.length,
      filesWithTests: 0,
      coverage: 0,
      missingTests: [] as string[]
    }
    
    for (const file of testFiles) {
      if (await fs.pathExists(file)) {
        const content = await fs.readFile(file, 'utf-8')
        if (content.includes('describe(') && content.includes('it(')) {
          results.filesWithTests++
        } else {
          results.missingTests.push(file)
        }
      } else {
        results.missingTests.push(file)
      }
    }
    
    results.coverage = results.totalFiles > 0 ? (results.filesWithTests / results.totalFiles) * 100 : 0
    
    return results
  }

  static generateTestReport(results: any): string {
    const report = [
      '# Test Validation Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Summary',
      `- Total Checks: ${results.totalChecks || 0}`,
      `- Passed: ${results.passed || 0}`,
      `- Failed: ${results.failed || 0}`,
      `- Success Rate: ${results.successRate || 0}%`,
      '',
      '## Details',
      ...results.details?.map((detail: any) => 
        `### ${detail.name}\n- Status: ${detail.status}\n- Checks: ${detail.checkes?.join(', ') || 'N/A'}`
      ) || [],
      '',
      '## Recommendations',
      ...results.recommendations || ['No recommendations available']
    ].join('\n')
    
    return report
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private timers: Map<string, number> = new Map()
  
  start(label: string): void {
    this.timers.set(label, Date.now())
  }
  
  end(label: string): number {
    const start = this.timers.get(label)
    if (!start) return 0
    
    const duration = Date.now() - start
    this.timers.delete(label)
    
    if (process.env.DEBUG_TESTS) {
      console.log(`⏱️  ${label}: ${duration}ms`)
    }
    
    return duration
  }
  
  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }
  
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  }
}

// Test data generators
export class TestDataGenerator {
  static generateComponentName(): string {
    const prefixes = ['Test', 'Mock', 'Sample', 'Demo']
    const suffixes = ['Component', 'Widget', 'Element', 'Item']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${prefix}${suffix}`
  }
  
  static generateRegistryItem(name?: string): any {
    return {
      name: name || this.generateComponentName(),
      type: 'registry:ui',
      description: `Test component: ${name || 'Generated'}`,
      files: [
        {
          path: `components/ui/${name || 'test'}.tsx`,
          content: `export function ${name || 'Test'}() { return <div>Test Component</div> }`,
          type: 'registry:ui'
        }
      ]
    }
  }
  
  static generateStyleVariantTest(baseComponent: string, variants: string[]): any[] {
    return variants.map(variant => ({
      name: baseComponent,
      type: 'registry:ui',
      description: `${baseComponent} with ${variant} style`,
      files: [
        {
          path: `components/ui/${variant}/${baseComponent}.tsx`,
          content: `export function ${baseComponent}() { return <div>${variant} ${baseComponent}</div> }`,
          type: 'registry:ui'
        }
      ]
    }))
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()
