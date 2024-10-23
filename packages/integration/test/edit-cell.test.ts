import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test.skip('edit cell', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const id = 1
  await worker.execute('WebView.create', id)
  await worker.execute('WebView.setCells', id, [['a']])
  await worker.execute('WebView.setCursor', id, 0, 0)
  await worker.execute('WebView.setTextArea', id, true)
  await worker.execute('WebView.handleInput', id, 'b')
  await worker.execute('WebView.handleSubmit', id)
  expect(await worker.execute('WebView.getCells', id)).toEqual([['b']])
})
