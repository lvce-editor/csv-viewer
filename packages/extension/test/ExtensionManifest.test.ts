import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

test('uses the isolated virtual DOM view API without a separate RPC worker', async () => {
  const text = await readFile(new URL('../extension.json', import.meta.url), 'utf8')
  const manifest = JSON.parse(text)
  expect(manifest.isolated).toBe(true)
  expect(manifest.activation).toEqual(['onView:builtin.csv-viewer'])
  expect(manifest.rpc).toBeUndefined()
  expect(manifest.webViews).toBeUndefined()
  expect(manifest.views).toEqual([
    {
      css: 'media/index.css',
      id: 'builtin.csv-viewer',
      kind: 'virtualDom',
      selector: ['.csv'],
      showSideBarHeader: false,
      title: 'CSV Viewer',
      type: 'preview',
    },
  ])
})
