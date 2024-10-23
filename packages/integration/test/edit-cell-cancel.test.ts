import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test('edit cell - cancel', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCells', id, [['a']])
  await worker.execute('WebView.setCursor', id, 0, 0)
  await worker.execute('WebView.setTextarea', id, true)
  await worker.execute('WebView.handleInput', id, 'b')
  await worker.execute('WebView.setTextarea', id, false)
  expect(await worker.execute('WebView.getTextArea', id)).toBe(false)
})
