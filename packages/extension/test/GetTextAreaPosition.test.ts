import { expect, test } from '@jest/globals'
import { getTextAreaPosition } from '../src/parts/GetTextAreaPosition/GetTextAreaPosition.ts'

test('gets the text area position', () => {
  expect(getTextAreaPosition(1, 1)).toEqual({ x: 41, y: 41 })
})
