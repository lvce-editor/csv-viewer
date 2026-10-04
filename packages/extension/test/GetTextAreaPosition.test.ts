import { expect, test } from '@jest/globals'
import { getTextAreaPosition } from '../src/parts/GetTextAreaPosition/GetTextAreaPosition.ts'

test('gets the text area position', () => {
  expect(getTextAreaPosition(1, 1)).toEqual({ x: 41, y: 77 })
})

test('accounts for scrolling when getting the text area position', () => {
  expect(getTextAreaPosition(100, 1, 120, 1980)).toEqual({ x: -79, y: 77 })
})
