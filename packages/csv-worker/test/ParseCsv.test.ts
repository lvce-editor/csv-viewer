import { expect, test } from '@jest/globals'
import * as ParseCsv from '../src/parts/ParseCsv/ParseCsv.js'

test('parseCsv', () => {
  const content = `key, value
a, 1`
  expect(ParseCsv.parseCsv(content)).toEqual({
    header: ['key', 'value'],
    content: [['a', '1']],
  })
})
