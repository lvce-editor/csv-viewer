import type { ViewContext } from '@lvce-editor/api'
import { expect, jest, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { createInstanceWithReadFile } from '../src/parts/CreateInstance/CreateInstance.ts'

const createContext = (state?: unknown): ViewContext & { readonly uri: string } => {
  return {
    requestRerender: jest.fn(async () => {}),
    showContextMenu: jest.fn(async () => {}),
    state,
    uid: 1,
    uri: '/test.csv',
    viewId: 'builtin.csv-viewer',
  }
}

test('reads the file and renders its table', async () => {
  const readFile = jest.fn(async () => 'key,value\na,1')
  const instance = await createInstanceWithReadFile(createContext(), readFile)
  const dom = instance.render()
  expect(readFile).toHaveBeenCalledWith('/test.csv')
  expect(dom).toContainEqual(expect.objectContaining({ className: 'Table', type: VirtualDomElements.Table }))
  expect(dom).toContainEqual(expect.objectContaining({ name: 'cell:0:1' }))
})

test('edits a cell directly in the isolated view instance', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na')
  instance.handleDoubleClick('cell:0:1')
  expect(instance.render()).toContainEqual(expect.objectContaining({ name: 'cellEditor', value: 'a' }))
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'b' })
  instance.handleKeyDown('cellEditor', 'Enter')
  expect(instance.render()).toContainEqual(expect.objectContaining({ text: 'b' }))
  expect(instance.renderFocus()).toBe('[name="cell:0:1"]')
})

test('cancels editing and preserves the old value', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na')
  instance.handleDoubleClick('cell:0:1')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'b' })
  instance.handleKeyDown('cellEditor', 'Escape')
  expect(instance.render()).toContainEqual(expect.objectContaining({ text: 'a' }))
  expect(instance.render()).not.toContainEqual(expect.objectContaining({ name: 'cellEditor' }))
})

test('moves focus with arrow keys', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'a,b\n1,2\n3,4')
  instance.handleKeyDown('cell:0:1', 'ArrowRight')
  expect(instance.renderFocus()).toBe('[name="cell:0:2"]')
  instance.handleKeyDown('cell:0:2', 'ArrowDown')
  expect(instance.renderFocus()).toBe('[name="cell:1:2"]')
})

test('restores cursor state while rereading file content', async () => {
  const instance = await createInstanceWithReadFile(
    createContext({ columnIndex: 1, rowIndex: 1, value: 'draft' }),
    async () => 'key\na\nb',
  )
  expect(instance.saveState()).toEqual({
    columnIndex: 1,
    rowIndex: 1,
    uri: '/test.csv',
    value: 'draft',
  })
})
