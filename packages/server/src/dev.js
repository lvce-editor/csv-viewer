import { spawn } from 'child_process'
import { join } from 'path'

// @ts-ignore
const __dirname = import.meta.dirname

const root = join(__dirname, '..', '..', '..')

const serverPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'server', 'bin', 'server.js')
const esbuildPath = join(root, 'packages', 'build', 'node_modules', '.bin', 'esbuild')

const main = () => {
  const child = spawn(serverPath, ['--only-extension=packages/extension', '--test-path=packages/e2e'], {
    stdio: 'inherit',
  })
  const child2 = spawn(
    esbuildPath,
    [
      '--format=esm',
      '--bundle',
      '--external:node:buffer',
      '--external:electron',
      '--external:ws',
      '--external:node:worker_threads',
      '--bundle',
      '--watch',
      'packages/csv-worker/src/csvWorkerMain.ts',
      '--outfile=packages/csv-worker/dist/csvWorkerMain.js',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
}

main()
