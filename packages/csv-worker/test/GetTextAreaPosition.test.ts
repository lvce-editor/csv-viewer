import { expect, test } from '@jest/globals'
import type { Cursor } from '../src/parts/Cursor/Cursor.ts'
import * as GetTextAreaPosition from '../src/parts/GetTextAreaPosition/GetTextAreaPosition.ts'

test('getTextAreaPosition', () => {
  const cursor: Cursor = {
    columnIndex: 1,
    rowIndex: 1,
  }
  expect(GetTextAreaPosition.getTextAreaPosition(cursor)).toEqual({
    x: 41,
    y: 41,
  })
})
