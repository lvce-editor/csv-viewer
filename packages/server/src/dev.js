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
      'packages/chat-worker/src/chatWorkerMain.ts',
      '--outfile=packages/chat-worker/dist/chatWorkerMain.js',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
  const child3 = spawn(
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
      'packages/network-worker/src/networkWorkerMain.ts',
      '--outfile=packages/network-worker/dist/networkWorkerMain.js',
    ],
    {
      cwd: root,
    },
  )
  // child.stdout.pipe(process.stdout)
}

main()
