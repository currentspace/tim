import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)
const projectRoot = process.cwd()

async function runComparisons() {
  console.log('🚀 Starting screenshot capture and comparison workflow...\n')

  try {
    // Step 1: Check if dev server is running
    console.log('📋 Checking dev server...')
    try {
      await execAsync('curl -s http://localhost:5173 > /dev/null')
      console.log('✅ Dev server is running\n')
    } catch {
      console.error('❌ Dev server is not running. Please run "pnpm dev" first.\n')
      process.exit(1)
    }

    // Step 2: Run screenshot capture
    console.log('📸 Capturing screenshots from all routes...')
    const { stdout: captureOutput } = await execAsync(
      'pnpm exec playwright test e2e/capture-and-compare.spec.ts --grep "Capture All Route Screenshots"',
      { cwd: projectRoot }
    )
    console.log(captureOutput)

    // Step 3: Organize screenshots for comparison
    console.log('\n📁 Organizing screenshots for comparison...')
    const { stdout: organizeOutput } = await execAsync('pnpm tsx e2e/utils/organize-comparisons.ts', {
      cwd: projectRoot,
    })
    console.log(organizeOutput)

    // Step 4: Run visual regression tests
    console.log('\n🔍 Running visual regression tests...')
    const { stdout: testOutput } = await execAsync(
      'pnpm exec playwright test e2e/capture-and-compare.spec.ts --grep "Visual Regression Tests"',
      { cwd: projectRoot }
    )
    console.log(testOutput)

    console.log('\n✨ Workflow completed successfully!')
    console.log('📄 Open screenshot-comparisons/index.html to view the results')
  } catch (error) {
    console.error('❌ Error during workflow:', error)
    process.exit(1)
  }
}

void runComparisons()