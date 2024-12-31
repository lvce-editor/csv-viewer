import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test.skip('focus row up', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCursor', id, 1, 0)
  await worker.execute('WebView.handleKeyDown', id, 'ArrowUp')
  expect(await worker.execute('WebView.getPosition', id)).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
