import type { ViewContext } from '@lvce-editor/api'
import { expect, jest, test } from '@jest/globals'
import { validate, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { createInstanceWithReadFile } from '../src/parts/CreateInstance/CreateInstance.ts'

const createContext = (state?: unknown, uri = '/test.csv'): ViewContext & { readonly uri: string } => {
  return {
    requestRerender: jest.fn(async () => {}),
    showContextMenu: jest.fn(async () => {}),
    state,
    uid: 1,
    uri,
    viewId: 'builtin.csv-viewer',
  }
}

test('reads the file and renders its table', async () => {
  const readFile = jest.fn(async () => 'key,value\na,1')
  const instance = await createInstanceWithReadFile(createContext(), readFile)
  const dom = await instance.render()
  expect(readFile).toHaveBeenCalledWith('file:///test.csv')
  expect(validate(dom)).toBe(true)
  expect(dom).toContainEqual(expect.objectContaining({ className: 'Table', type: VirtualDomElements.Div }))
  expect(dom).toContainEqual(expect.objectContaining({ name: 'cell:0:1' }))
})

test('preserves file uris when reading the file', async () => {
  const readFile = jest.fn(async () => 'key,value\na,1')
  await createInstanceWithReadFile(createContext(undefined, 'file:///test.csv'), readFile)
  expect(readFile).toHaveBeenCalledWith('file:///test.csv')
})

test('edits a cell directly in the isolated view instance', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na')
  instance.handleDoubleClick('cell:0:1')
  expect(instance.render()).toContainEqual(expect.objectContaining({ name: 'cellEditor', value: 'a' }))
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'b' })
  instance.handleKeyDown('cellEditor', 'Enter')
  expect(instance.render()).toContainEqual(expect.objectContaining({ text: 'b' }))
  expect(instance.renderFocus()).toBe('[id="cell:0:1"]')
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
  expect(instance.renderFocus()).toBe('[id="cell:0:2"]')
  instance.handleKeyDown('cell:0:2', 'ArrowDown')
  expect(instance.renderFocus()).toBe('[id="cell:1:2"]')
})

test('scrolls keyboard focus into view', async () => {
  const lines = ['key', ...Array.from({ length: 100 }, (_, index) => 'row ' + index)]
  const instance = await createInstanceWithReadFile(createContext(), async () => lines.join('\n'))
  instance.handleKeyDown('cell:0:1', 'ArrowDown')
  instance.handleScroll(0, 40, 0)
  for (let rowIndex = 1; rowIndex <= 10; rowIndex++) {
    instance.handleKeyDown(`cell:${rowIndex - 1}:1`, 'ArrowDown')
  }
  expect(instance.getComponentState().rowIndex).toBe(10)
  expect(instance.getComponentState().scrollTop).toBeGreaterThan(0)
  expect(instance.renderScrollPosition()).toEqual(['.ScrollContainer', instance.getComponentState().scrollTop])
})

test('renders a viewport-sized window and the final absolute row for a million rows', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => '')
  instance.setComponentState({
    ...instance.getComponentState(),
    cells: Array.from({ length: 1_000_000 }, () => ['value']),
    header: ['value'],
  })
  instance.handleScroll(19_999_400, 600, 0)
  const dom = await instance.render()
  expect(dom.filter((node) => node.className === 'TableRow')).toHaveLength(81)
  expect(dom).toContainEqual(expect.objectContaining({ name: 'cell:999999:0' }))
  expect(dom).toContainEqual(expect.objectContaining({ text: '1000000' }))
  expect(dom).toContainEqual(
    expect.objectContaining({ childCount: 80, className: 'TableBody', style: 'height: 20000000px; position: relative;' }),
  )
})

test('clamps wheel scrolling to the content bounds', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na\nb')
  instance.handleWheel(10_000)
  expect(instance.getComponentState().scrollTop).toBe(0)
  instance.handleScroll(0, 20, 0)
  instance.handleWheel(10_000)
  expect(instance.getComponentState().scrollTop).toBe(20)
  instance.handleWheel(-10_000)
  expect(instance.getComponentState().scrollTop).toBe(0)
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

test('component state edits affect rendering and subsequent cell selection in one instance', async () => {
  const first = await createInstanceWithReadFile(undefined, async () => '')
  const second = await createInstanceWithReadFile(undefined, async () => '')
  first.setComponentState({ ...first.getComponentState(), cells: [['edited']], header: ['name'] })
  expect(JSON.stringify(first.render())).toContain('edited')
  first.handleDoubleClick('cell:0:1')
  expect(first.getComponentState().value).toBe('edited')
  expect(second.getComponentState().cells).not.toEqual([['edited']])
})
