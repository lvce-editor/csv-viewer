import { expect, test } from '@jest/globals'
import * as ParseCsvLine from '../src/parts/ParseCsvLine/ParseCsvLine.ts'

test('normal', () => {
  const content = `key, value`
  expect(ParseCsvLine.parseCsvLine(content)).toEqual(['key', 'value'])
})

test('unquote values', () => {
  const content = `"key"," value"`
  expect(ParseCsvLine.parseCsvLine(content)).toEqual(['key', 'value'])
})
