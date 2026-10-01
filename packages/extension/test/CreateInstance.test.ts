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

test('starts editing the focused cell with Enter', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'name,quantity\nApple,10')
  instance.handleKeyDown('cell:0:2', 'Enter')
  expect(instance.getComponentState().textArea).toBe(true)
  expect(instance.getComponentState().value).toBe('10')
  expect(instance.render()).toContainEqual(expect.objectContaining({ name: 'cellEditor', value: '10' }))
  expect(instance.renderFocus()).toBe('[name="cellEditor"]')
})

test.each(['cell:0:0', 'cell:0:3', 'cell:4:1'])('does not edit non-data cell %s with Enter', async (name) => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'name,quantity\nApple,10')
  instance.handleKeyDown(name, 'Enter')
  expect(instance.getComponentState().textArea).toBe(false)
  expect(instance.render()).not.toContainEqual(expect.objectContaining({ name: 'cellEditor' }))
})

test('renders a complete editable row for a header-only CSV and preserves neighboring fields', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'name,quantity,note\n')
  expect(instance.getComponentState().cells).toEqual([])
  for (const name of ['cell:0:1', 'cell:0:2', 'cell:0:3']) {
    expect(instance.render()).toContainEqual(expect.objectContaining({ name }))
  }

  instance.handleDoubleClick('cell:0:1')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'Apple' })
  instance.handleKeyDown('cellEditor', 'Enter')
  instance.handleDoubleClick('cell:0:2')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: '4' })
  instance.handleKeyDown('cellEditor', 'Enter')
  expect(instance.getComponentState().cells).toEqual([['Apple', '4', '']])
})

test('supports empty CSVs and repeated row and column insertion', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => '')
  expect(instance.render()).toContainEqual(expect.objectContaining({ name: 'cell:0:1' }))
  instance.handleEvent?.({ name: 'addColumn', type: 'click' })
  expect(instance.getComponentState().header).toEqual(['Column 1', 'Column 2'])
  expect(instance.getComponentState().cells).toEqual([])
  instance.handleEvent?.({ name: 'addRow', type: 'click' })
  instance.handleEvent?.({ name: 'addRow', type: 'click' })
  expect(instance.getComponentState().cells).toEqual([
    ['', ''],
    ['', ''],
  ])
  expect(instance.render()).toContainEqual(expect.objectContaining({ name: 'cell:1:2' }))
})

test('pads ragged rows to the widest existing row before extending columns', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'name,quantity,note\nApple,4\nPear,2,ripe,extra')
  expect(instance.getComponentState().header).toEqual(['name', 'quantity', 'note', ''])
  expect(instance.getComponentState().cells).toEqual([
    ['Apple', '4', '', ''],
    ['Pear', '2', 'ripe', 'extra'],
  ])
  instance.handleEvent?.({ name: 'addColumn', type: 'click' })
  expect(instance.getComponentState().cells).toEqual([
    ['Apple', '4', '', '', ''],
    ['Pear', '2', 'ripe', 'extra', ''],
  ])
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

test.each(['Backspace', 'Delete'])('clears only the selected data cell with %s', async (key) => {
  const instance = await createInstanceWithReadFile(
    createContext(),
    async () => 'name,quantity,note\nApple,10,red\nPear,20,green',
  )
  instance.handleEvent?.({ name: 'cell:0:2', type: 'click' })
  instance.handleKeyDown('cell:0:2', key)
  expect(instance.getComponentState().cells).toEqual([
    ['Apple', '', 'red'],
    ['Pear', '20', 'green'],
  ])
  expect(instance.renderFocus()).toBe('[id="cell:0:2"]')
  instance.handleKeyDown('cell:0:2', key)
  expect(instance.getComponentState().cells).toEqual([
    ['Apple', '', 'red'],
    ['Pear', '20', 'green'],
  ])
})

test('does not clear row headings, headers, invalid cells, or text while editing', async () => {
  const instance = await createInstanceWithReadFile(createContext(), async () => 'name,quantity\nApple,10')
  instance.handleKeyDown('cell:0:0', 'Delete')
  instance.handleKeyDown('cell:4:1', 'Delete')
  expect(instance.getComponentState().cells).toEqual([['Apple', '10']])
  instance.handleDoubleClick('cell:0:2')
  instance.handleKeyDown('cellEditor', 'Backspace')
  expect(instance.getComponentState().value).toBe('10')
  expect(instance.getComponentState().cells).toEqual([['Apple', '10']])
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

test.each([
  ['10', '15'],
  ['', '42'],
  ['10', ''],
])('saves %j to %j and retains adjacent cells on reopen', async (before, after) => {
  let disk = `name,quantity,note\nApple,${before},red\nPear,20,green\n`
  const read = async () => disk
  const write = jest.fn(async (_uri: string, content: string) => {
    disk = content
  })
  const instance = await createInstanceWithReadFile(createContext(), read, write)
  instance.handleDoubleClick('cell:0:2')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: after })
  instance.handleKeyDown('cellEditor', 'Enter')
  expect(instance.isDirty()).toBe(true)
  expect(write).not.toHaveBeenCalled()
  await instance.save()
  expect(instance.isDirty()).toBe(false)
  expect(disk).toBe(`name,quantity,note\nApple,${after},red\nPear,20,green\n`)
  const reopened = await createInstanceWithReadFile(createContext(), read, write)
  expect(reopened.getComponentState().cells[0]).toEqual(['Apple', after, 'red'])
})

test('saves added rows and columns and restores them after reopening', async () => {
  let disk = 'name,quantity,note\n'
  const read = async () => disk
  const write = jest.fn(async (_uri: string, content: string) => {
    disk = content
  })
  const instance = await createInstanceWithReadFile(createContext(), read, write)
  const edit = (row: number, column: number, value: string): void => {
    instance.handleDoubleClick(`cell:${row}:${column}`)
    instance.handleEvent?.({ name: 'cellEditor', type: 'input', value })
    instance.handleKeyDown('cellEditor', 'Enter')
  }
  edit(0, 1, 'Apple')
  edit(0, 2, '4')
  edit(0, 3, 'fresh')
  instance.handleEvent?.({ name: 'addRow', type: 'click' })
  edit(1, 1, 'Pear')
  instance.handleEvent?.({ name: 'addColumn', type: 'click' })
  edit(0, 4, 'fruit')

  expect(instance.isDirty()).toBe(true)
  await instance.save()
  expect(disk).toBe('name,quantity,note,Column 4\nApple,4,fresh,fruit\nPear,,,\n')
  const reopened = await createInstanceWithReadFile(createContext(), read, write)
  expect(reopened.getComponentState().header).toEqual(['name', 'quantity', 'note', 'Column 4'])
  expect(reopened.getComponentState().cells).toEqual([
    ['Apple', '4', 'fresh', 'fruit'],
    ['Pear', '', '', ''],
  ])
})

test('Escape and unchanged commits leave the document clean', async () => {
  const write = jest.fn(async () => {})
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na\n', write)
  instance.handleDoubleClick('cell:0:1')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'b' })
  instance.handleKeyDown('cellEditor', 'Escape')
  expect(instance.isDirty()).toBe(false)
  instance.handleDoubleClick('cell:0:1')
  instance.handleKeyDown('cellEditor', 'Enter')
  await instance.save()
  expect(instance.isDirty()).toBe(false)
  expect(write).not.toHaveBeenCalled()
})

test('failed saves retain committed edits and dirty state for retry', async () => {
  const write = jest.fn(async () => {
    throw new Error('disk full')
  })
  const instance = await createInstanceWithReadFile(createContext(), async () => 'key\na\n', write)
  instance.handleDoubleClick('cell:0:1')
  instance.handleEvent?.({ name: 'cellEditor', type: 'input', value: 'b' })
  instance.handleKeyDown('cellEditor', 'Enter')
  await expect(instance.save()).rejects.toThrow('disk full')
  expect(instance.isDirty()).toBe(true)
  expect(instance.getComponentState().cells[0]).toEqual(['b'])
})

test('edits made during a pending save remain dirty', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  const instance = await createInstanceWithReadFile(
    createContext(),
    async () => 'key\na\n',
    async () => promise,
  )
  const edit = (value: string): void => {
    instance.handleDoubleClick('cell:0:1')
    instance.handleEvent?.({ name: 'cellEditor', type: 'input', value })
    instance.handleKeyDown('cellEditor', 'Enter')
  }
  edit('b')
  const pending = instance.save()
  edit('c')
  resolve()
  await pending
  expect(instance.isDirty()).toBe(true)
})
