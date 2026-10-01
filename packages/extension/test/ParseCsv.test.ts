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
    serializeCsvEdits(original, parsed.header, [
      ['Apple', '15', 'red'],
      ['Pear', '42', 'green'],
    ]),
  ).toBe(original.replace(',10,', ',15,').replace('Pear,,', 'Pear,42,'))
})

test('preserves absent final newline and escapes edited values', () => {
  const original = 'name,note\nApple,red'
  const edited = serializeCsvEdits(original, ['name', 'note'], [['Apple', 'comma, quote" and\nline']])
  expect(edited).toBe('name,note\nApple,"comma, quote"" and\nline"')
  expect(parseCsv(edited).content).toEqual([['Apple', 'comma, quote" and\nline']])
})

test('parses empty fields and quoted multiline records without phantom final rows', () => {
  expect(parseCsv('a,b\n"x\ny",\n')).toEqual({ content: [['x\ny', '']], header: ['a', 'b'] })
  expect(parseCsv('')).toEqual({ content: [], header: [] })
  expect(() => parseCsv('a\n"unterminated')).toThrow('Invalid or unterminated quoted CSV field')
})

test('parses quoted commas, escaped quotes, and multiline fields as logical records', () => {
  const original = 'name,quantity,note\n"Apple, pear",10,"say ""hi"""\nPlum,20,"two\nlines"\n'
  const parsed = parseCsv(original)
  expect(parsed).toEqual({
    content: [
      ['Apple, pear', '10', 'say "hi"'],
      ['Plum', '20', 'two\nlines'],
    ],
    header: ['name', 'quantity', 'note'],
  })
  const edited = serializeCsvEdits(original, parsed.header, [
    ['Apple, pear', '11', 'say "hi"'],
    ['Plum', '20', 'two\nlines'],
  ])
  expect(edited).toBe(original.replace(',10,', ',11,'))
  expect(parseCsv(edited).content).toEqual([
    ['Apple, pear', '11', 'say "hi"'],
    ['Plum', '20', 'two\nlines'],
  ])
})

test('does not turn the final newline into an extra row', () => {
  expect(parseCsv('name,quantity,note\n')).toEqual({
    content: [],
    header: ['name', 'quantity', 'note'],
  })
})

test('serializes added rows and columns while preserving existing values and line endings', () => {
  const original = 'name,quantity,note\nApple,4\nPear,2,ripe\n'
  const edited = serializeCsvEdits(
    original,
    ['name', 'quantity', 'note', 'category'],
    [
      ['Apple', '4', '', 'fruit'],
      ['Pear', '2', 'ripe', 'fruit'],
      ['Plum', '3', 'purple', 'fruit'],
    ],
  )
  expect(edited).toBe('name,quantity,note,category\nApple,4,,fruit\nPear,2,ripe,fruit\nPlum,3,purple,fruit\n')
  expect(parseCsv(edited)).toEqual({
    content: [
      ['Apple', '4', '', 'fruit'],
      ['Pear', '2', 'ripe', 'fruit'],
      ['Plum', '3', 'purple', 'fruit'],
    ],
    header: ['name', 'quantity', 'note', 'category'],
  })
})

test('serializes a new editable row from an empty file', () => {
  expect(serializeCsvEdits('', ['name', 'quantity'], [['Apple', '4']])).toBe('name,quantity\nApple,4\n')
})
