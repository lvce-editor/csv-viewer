import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test('focus', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCursor', id, 0, 1)
  await worker.execute('WebView.handleKeyDown', id, 'ArrowLeft')
  expect(await worker.execute('WebView.getPosition', id)).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
