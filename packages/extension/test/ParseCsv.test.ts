import { expect, test } from '@jest/globals'
import { parseCsv, parseCsvLine } from '../src/parts/ParseCsv/ParseCsv.ts'

test('parses a CSV document', () => {
  expect(parseCsv('key, value\na, 1')).toEqual({
    content: [['a', '1']],
    header: ['key', 'value'],
  })
})

test('trims and unquotes values', () => {
  expect(parseCsvLine('"key"," value"')).toEqual(['key', 'value'])
})
