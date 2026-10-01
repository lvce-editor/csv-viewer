import { expect, test } from '@jest/globals'
import { parseCsv, parseCsvLine, serializeCsvEdits } from '../src/parts/ParseCsv/ParseCsv.ts'

test('preserves spaces and decodes quoted delimiters and quotes', () => {
  expect(parseCsvLine('"a,b","say ""hi""", value')).toEqual(['a,b', 'say "hi"', ' value'])
})

test.each(['\n', '\r\n', '\r'])('preserves newline convention %j and untouched bytes', (newline) => {
  const byteOrderMark = '\u{FEFF}' // cspell:ignore FEFF
  const original = `${byteOrderMark}name,quantity,note${newline}"Apple",10,"red"${newline}Pear,,green${newline}`
  const parsed = parseCsv(original)
  expect(parsed.content).toEqual([
    ['Apple', '10', 'red'],
    ['Pear', '', 'green'],
  ])
  expect(
    serializeCsvEdits(original, [
      ['Apple', '15', 'red'],
      ['Pear', '42', 'green'],
    ]),
  ).toBe(original.replace(',10,', ',15,').replace('Pear,,', 'Pear,42,'))
})

test('preserves absent final newline and escapes edited values', () => {
  const original = 'name,note\nApple,red'
  const edited = serializeCsvEdits(original, [['Apple', 'comma, quote" and\nline']])
  expect(edited).toBe('name,note\nApple,"comma, quote"" and\nline"')
  expect(parseCsv(edited).content).toEqual([['Apple', 'comma, quote" and\nline']])
})

test('parses empty fields and quoted multiline records without phantom final rows', () => {
  expect(parseCsv('a,b\n"x\ny",\n')).toEqual({ content: [['x\ny', '']], header: ['a', 'b'] })
  expect(parseCsv('')).toEqual({ content: [], header: [] })
  expect(() => parseCsv('a\n"unterminated')).toThrow('Invalid or unterminated quoted CSV field')
})
