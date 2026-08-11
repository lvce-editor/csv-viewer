import { expect, test } from '@jest/globals'
import { view, viewId } from '../src/parts/CsvView/CsvView.ts'

test('registers the CSV virtual DOM view', () => {
  expect(view.id).toBe(viewId)
  expect(view.kind).toBe('virtualDom')
  expect(view.eventListeners).toEqual([
    {
      name: 'handleDoubleClick',
      params: ['handleDoubleClick', 'event.target.name'],
      preventDefault: true,
    },
    {
      name: 'handleKeyDown',
      params: ['handleKeyDown', 'event.target.name', 'event.key'],
    },
  ])
})
