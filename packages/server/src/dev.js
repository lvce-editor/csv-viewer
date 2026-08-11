import { spawn } from 'child_process'
import { join } from 'path'

// @ts-ignore
const __dirname = import.meta.dirname

const root = join(__dirname, '..', '..', '..')

const serverPath = join(root, 'node_modules', '@lvce-editor', 'server', 'bin', 'server.js')

const main = () => {
  spawn(serverPath, ['--only-extension=packages/extension', '--test-path=packages/e2e'], {
    stdio: 'inherit',
  })
}

main()
