import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

test.skip('focus column right', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCursor', id, 0, 0)
  await worker.execute('WebView.handleKeyDown', id, 'ArrowRight')
  expect(await worker.execute('WebView.getPosition', id)).toEqual({
    columnIndex: 1,
    rowIndex: 0,
  })
})
