#!/usr/bin/env node

/**
 * Test script to verify monorepo fixes
 * Run with: node test-monorepo-fix.js
 */

import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { execa } from 'execa'

async function testMonorepoCreation() {
  console.log('🧪 Testing shadcn monorepo creation...')
  
  const testDir = path.join(os.tmpdir(), `shadcn-test-${Date.now()}`)
  
  try {
    await fs.mkdir(testDir, { recursive: true })
    console.log(`📁 Created test directory: ${testDir}`)
    
    // Test monorepo creation
    console.log('🚀 Creating Next.js monorepo...')
    const result = await execa('pnpm', ['dlx', 'shadcn@canary', 'init'], {
      cwd: testDir,
      input: 'Next.js (Monorepo)\ntest-monorepo\n',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    console.log('✅ Monorepo creation successful!')
    console.log('Output:', result.stdout)
    
    // Check if files were created
    const monorepoPath = path.join(testDir, 'test-monorepo')
    const webAppPath = path.join(monorepoPath, 'apps', 'web')
    
    const componentsJsonExists = await fs.access(path.join(webAppPath, 'components.json')).then(() => true).catch(() => false)
    const packageJsonExists = await fs.access(path.join(monorepoPath, 'package.json')).then(() => true).catch(() => false)
    
    console.log(`📄 components.json exists: ${componentsJsonExists}`)
    console.log(`📄 package.json exists: ${packageJsonExists}`)
    
    if (componentsJsonExists && packageJsonExists) {
      console.log('🎉 All tests passed!')
    } else {
      console.log('❌ Some files are missing')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.stdout) console.log('stdout:', error.stdout)
    if (error.stderr) console.log('stderr:', error.stderr)
  } finally {
    // Cleanup
    try {
      await fs.rm(testDir, { recursive: true, force: true })
      console.log('🧹 Cleaned up test directory')
    } catch (cleanupError) {
      console.warn('⚠️ Failed to cleanup:', cleanupError.message)
    }
  }
}

testMonorepoCreation().catch(console.error)