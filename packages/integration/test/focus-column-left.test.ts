import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

test.skip('focus column left', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCursor', id, 0, 1)
  await worker.execute('WebView.handleKeyDown', id, 'ArrowLeft')
  expect(await worker.execute('WebView.getPosition', id)).toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
})
