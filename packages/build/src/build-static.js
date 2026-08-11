import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir, rm, writeFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import { root } from './root.js'

await import('./build.js')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

const { commitHash } = await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

await cp(path.join(root, 'dist2'), path.join(root, 'dist', commitHash, 'extensions', 'builtin.csv-viewer'), {
  recursive: true,
  force: true,
})

await rm(join(root, 'dist', commitHash, 'playground'), { recursive: true, force: true })
await cp(join(root, 'packages', 'e2e', 'files'), join(root, 'dist', commitHash, 'playground'), {
  recursive: true,
})

const dirents = await readdir(join(root, 'dist', commitHash, 'playground'))
const fileMap = dirents.map((dirent) => `/playground/${dirent}`)
await writeFile(join(root, 'dist', commitHash, 'config', 'fileMap.json'), JSON.stringify(fileMap, null, 2) + '\n')
