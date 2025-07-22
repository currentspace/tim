#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..', '..')

async function runComparisons() {
  console.log('🚀 Starting screenshot capture and comparison workflow...\n')

  try {
    // Step 1: Check if dev server is running
    console.log('📋 Checking dev server...')
    try {
      await execAsync('curl -s http://localhost:5173 > /dev/null')
      console.log('✅ Dev server is running\n')
    } catch {
      console.log('❌ Dev server is not running. Please run "pnpm dev" first.\n')
      process.exit(1)
    }

    // Step 2: Run screenshot capture
    console.log('📸 Capturing screenshots from all routes...')
    const { stdout: captureOutput } = await execAsync(
      'pnpm playwright test e2e/capture-and-compare.spec.ts --grep "should capture screenshots"',
      { cwd: projectRoot },
    )
    console.log(captureOutput)

    // Step 3: Check if screenshots were created
    const screenshotsDir = join(projectRoot, 'screenshots')
    if (!existsSync(screenshotsDir)) {
      console.log('❌ Screenshots directory was not created\n')
      process.exit(1)
    }

    // Step 4: Organize screenshots for comparison
    console.log('\n📁 Organizing screenshots for comparison...')
    const { stdout: organizeOutput } = await execAsync(
      'pnpm tsx e2e/utils/organize-comparisons.ts',
      { cwd: projectRoot },
    )
    console.log(organizeOutput)

    // Step 5: Run visual regression tests
    console.log('\n🔍 Running visual regression tests...')
    const { stdout: testOutput } = await execAsync(
      'pnpm playwright test e2e/capture-and-compare.spec.ts --grep "should match Figma design"',
      { cwd: projectRoot },
    )
    console.log(testOutput)

    console.log('\n✨ Workflow completed successfully!')
    console.log('📄 Open screenshot-comparisons/index.html to view the results\n')
  } catch (error) {
    console.error('❌ Error during workflow:', error.message)
    process.exit(1)
  }
}

// Run the workflow
runComparisons()
