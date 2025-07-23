/* eslint-disable no-console */
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)
const projectRoot = process.cwd()

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function checkDependencies() {
  log('\n📦 Checking optional dependencies for visual diff...', colors.cyan)

  const dependencies = ['canvas', 'pixelmatch', 'pngjs']
  const missing = []

  for (const dep of dependencies) {
    try {
      await import(dep)
      log(`  ✓ ${dep} is installed`, colors.green)
    } catch {
      missing.push(dep)
      log(`  ✗ ${dep} is not installed`, colors.yellow)
    }
  }

  if (missing.length > 0) {
    log('\n💡 To enable visual diff features, install:', colors.yellow)
    log(`   pnpm add -D ${missing.join(' ')}`, colors.bright)
    log('   (Screenshots will still be captured without these)\n', colors.reset)
  }

  return missing.length === 0
}

function cleanPreviousScreenshots() {
  log('\n🧹 Cleaning previous screenshots...', colors.cyan)

  const dirs = ['screenshots', 'screenshot-comparisons']

  for (const dir of dirs) {
    const path = join(projectRoot, dir)
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true })
      log(`  ✓ Removed ${dir}`, colors.green)
    }
  }
}

async function runScreenshots() {
  log('\n🚀 Starting Screenshot Generation Workflow', colors.bright + colors.blue)
  log('='.repeat(50), colors.blue)

  try {
    // Step 1: Check if dev server is running
    log('\n📋 Checking development server...', colors.cyan)
    try {
      await execAsync('curl -s http://localhost:5173 > /dev/null')
      log('  ✓ Dev server is running on http://localhost:5173', colors.green)
    } catch {
      log('  ✗ Dev server is not running!', colors.red)
      log('\n💡 Please run "pnpm dev" in another terminal first.', colors.yellow)
      process.exit(1)
    }

    // Step 2: Check dependencies
    const hasVisualDiff = await checkDependencies()

    // Step 3: Clean previous screenshots (optional)
    const args = process.argv.slice(2)
    if (args.includes('--clean')) {
      cleanPreviousScreenshots()
    }

    // Step 4: Run screenshot capture
    log('\n📸 Capturing screenshots from all routes...', colors.cyan)
    log('  This may take a minute as we wait for animations and ensure consistency.', colors.reset)

    const { stdout: captureOutput, stderr: captureError } = await execAsync(
      'pnpm exec playwright test e2e/capture-screenshots-improved.spec.ts --headed',
      { cwd: projectRoot },
    )

    if (captureError && !captureError.includes('deprecated')) {
      log(`\n⚠️  Capture warnings: ${captureError}`, colors.yellow)
    }

    // Parse Playwright output for better display
    const lines = captureOutput.split('\n')
    let testsPassed = 0
    let _testsFailed = 0

    for (const line of lines) {
      if (line.includes('✓') || line.includes('passed')) {
        testsPassed++
        log(`  ✓ ${line.trim()}`, colors.green)
      } else if (line.includes('✗') || line.includes('failed')) {
        _testsFailed++
        log(`  ✗ ${line.trim()}`, colors.red)
      } else if (line.includes('Capturing')) {
        log(`  📸 ${line.trim()}`, colors.cyan)
      }
    }

    // Step 5: Organize screenshots for comparison
    log('\n📁 Organizing screenshots for comparison...', colors.cyan)

    const visualComparisonScript = hasVisualDiff
      ? 'e2e/utils/visual-comparison.ts'
      : 'e2e/utils/organize-comparisons.ts'

    const { stdout: organizeOutput } = await execAsync(`pnpm tsx ${visualComparisonScript}`, {
      cwd: projectRoot,
    })

    console.log(organizeOutput)

    // Step 6: Summary
    log('\n' + '='.repeat(50), colors.blue)
    log('✨ Screenshot Generation Complete!', colors.bright + colors.green)
    log('='.repeat(50), colors.blue)

    log('\n📊 Results:', colors.cyan)
    log(
      `  • Screenshots captured: ${testsPassed > 0 ? '✓' : '✗'}`,
      testsPassed > 0 ? colors.green : colors.red,
    )
    log(`  • Comparisons organized: ✓`, colors.green)
    log(
      `  • Visual diff enabled: ${hasVisualDiff ? '✓' : '✗ (optional deps missing)'}`,
      hasVisualDiff ? colors.green : colors.yellow,
    )

    log('\n📂 Output locations:', colors.cyan)
    log('  • Screenshots: ./screenshots/', colors.reset)
    log('  • Comparisons: ./screenshot-comparisons/', colors.reset)

    log('\n🌐 Next steps:', colors.cyan)
    log('  1. Open screenshot-comparisons/index.html in your browser', colors.reset)
    log('  2. Review visual differences between Figma and implementation', colors.reset)
    log('  3. Use the interactive comparison tools (side-by-side, slider, diff)', colors.reset)

    if (!hasVisualDiff) {
      log(
        '\n💡 Pro tip: Install visual diff dependencies for pixel-perfect comparisons:',
        colors.yellow,
      )
      log('   pnpm add -D canvas pixelmatch pngjs', colors.bright)
    }
  } catch (error) {
    log('\n❌ Error during workflow:', colors.red)
    console.error(error)

    log('\n💡 Troubleshooting tips:', colors.yellow)
    log('  1. Make sure dev server is running: pnpm dev', colors.reset)
    log('  2. Check that Playwright is installed: pnpm install', colors.reset)
    log(
      '  3. Try running with --headed flag to see browser: pnpm screenshots:all --headed',
      colors.reset,
    )

    process.exit(1)
  }
}

// Run the script
void runScreenshots()
