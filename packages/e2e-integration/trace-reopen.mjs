import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(process.argv[2])
const files = [
  'extensions/builtin.csv-viewer/dist/csvViewerMain.js',
  'node_modules/@lvce-editor/file-system-worker/dist/fileSystemWorkerMain.js',
  'node_modules/@lvce-editor/main-area-worker/dist/mainAreaWorkerMain.js',
  'node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js',
  'packages/renderer-worker/src/parts/ViewletExtensionView/ViewletExtensionView.ts',
  'packages/renderer-worker/src/parts/Viewlet/Viewlet.js',
  'packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js',
  'packages/renderer-worker/src/parts/ViewletCommandQueue/ViewletCommandQueue.js',
]
for (const file of files) {
  const path = resolve(root, file)
  let source = await readFile(path, 'utf8')
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const inserts = []
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ['getResponse', 'invokeHelper'].includes(node.name.getText(parsed)) &&
      node.initializer?.body &&
      ts.isBlock(node.initializer.body)
    ) {
      const fn = node.name.getText(parsed)
      const value = fn === 'getResponse' ? 'message' : '{ method, params }'
      inserts.push([
        node.initializer.body.getStart(parsed) + 1,
        `console.log('REOPEN RPC ${file.split('/').at(-1)} ${fn}', JSON.stringify(${value}));`,
      ])
    }
    if (ts.isAwaitExpression(node)) {
      const expression = node.expression
      const line = parsed.getLineAndCharacterOfPosition(node.getStart(parsed)).line + 1
      const label = `${file.split('/').at(-1)}:${line} ${expression.getText(parsed).slice(0, 140)}`
      inserts.push([expression.getStart(parsed), `__csvTrace(${JSON.stringify(label)}, async () => (`])
      inserts.push([expression.end, '))'])
    }
    ts.forEachChild(node, visit)
  }
  visit(parsed)
  for (const [position, value] of inserts.sort((a, b) => b[0] - a[0]))
    source = source.slice(0, position) + value + source.slice(position)
  const helper = file.endsWith('.ts')
    ? 'const __csvTrace = async <T>(label: string, run: () => Promise<T>): Promise<T> =>'
    : 'const __csvTrace = async (label, run) =>'
  source =
    `\nlet __csvTraceId = 0;\n${helper} { const id = ++__csvTraceId; console.log('REOPEN start', id, label); try { const result = await run(); console.log('REOPEN done', id, label); return result; } catch (error) { console.log('REOPEN error', id, label, String(error)); throw error; } };\n` +
    source
  await writeFile(path, source)
}
