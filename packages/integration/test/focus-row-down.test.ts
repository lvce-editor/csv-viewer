import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test('focus row down', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCursor', id, 0, 0)
  await worker.execute('WebView.handleKeyDown', id, 'ArrowDown')
  expect(await worker.execute('WebView.getPosition', id)).toEqual({
    rowIndex: 1,
    columnIndex: 0,
  })
})
