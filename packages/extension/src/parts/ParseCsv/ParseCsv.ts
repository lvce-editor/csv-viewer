import type { CsvRow } from '../CsvViewState/CsvViewState.ts'

export interface ParsedCsv {
  readonly content: readonly CsvRow[]
  readonly header: CsvRow
}

interface Field {
  readonly end: number
  readonly start: number
  readonly value: string
}

// Keep field spans so editing one value does not rewrite unrelated CSV bytes.
const parseFields = (content: string): readonly (readonly Field[])[] => {
  const rows: Field[][] = []
  let row: Field[] = []
  const pattern = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n|\r|\n|$)/y
  let start = content.codePointAt(0) === 0xfe_ff ? 1 : 0
  while (start < content.length || row.length > 0) {
    pattern.lastIndex = start
    const match = pattern.exec(content)
    if (!match) {
      throw new Error('Invalid or unterminated quoted CSV field')
    }
    const [, quoted, plain, delimiter] = match
    const value = typeof quoted === 'string' ? quoted.replaceAll('""', '"') : plain
    row.push({ end: pattern.lastIndex - delimiter.length, start, value })
    start = pattern.lastIndex
    if (delimiter !== ',') {
      rows.push(row)
      row = []
    }
    if (delimiter === '') {
      break
    }
  }
  return rows
}

export const parseCsvLine = (line: string): CsvRow => parseFields(line)[0]?.map((field) => field.value) || []

export const parseCsv = (content: string): ParsedCsv => {
  const rows = parseFields(content).map((row) => row.map((field) => field.value))
  return { content: rows.slice(1), header: rows[0] || [] }
}

const quoteField = (value: string): string => (/[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)

const serializeRow = (row: CsvRow): string => row.map(quoteField).join(',')

interface TextEdit {
  readonly end: number
  readonly start: number
  readonly text: string
}

const getChangedFieldEdits = (fields: readonly Field[], values: CsvRow): readonly TextEdit[] => {
  const edits: TextEdit[] = []
  for (const [columnIndex, field] of fields.entries()) {
    const value = values[columnIndex]
    if (typeof value === 'string' && value !== field.value) {
      edits.push({ end: field.end, start: field.start, text: quoteField(value) })
    }
  }
  return edits
}

const getAddedFieldEdit = (
  fields: readonly Field[],
  values: CsvRow,
  columnCount: number,
  addEveryField: boolean,
): TextEdit | undefined => {
  const shouldAdd = addEveryField || values.slice(fields.length).some((value) => value !== '')
  if (!shouldAdd || values.length <= fields.length) {
    return undefined
  }
  const start = fields.at(-1)?.end || 0
  const text = values
    .slice(fields.length, columnCount)
    .map((value) => `,${quoteField(value)}`)
    .join('')
  return { end: start, start, text }
}

export const serializeCsvEdits = (original: string, header: CsvRow, cells: readonly CsvRow[]): string => {
  const records = parseFields(original)
  const originalColumnCount = records[0]?.length || 0
  const addsColumns = header.length > originalColumnCount
  const lineEnding = /\r\n|\r|\n/.exec(original)?.[0] || '\n'
  if (records.length === 0) {
    const rows = [serializeRow(header), ...cells.map(serializeRow)]
    return rows.join(lineEnding) + lineEnding
  }
  let result = ''
  let offset = 0
  for (const [rowIndex, fields] of records.entries()) {
    const values = rowIndex === 0 ? header : cells[rowIndex - 1] || []
    const addedField = getAddedFieldEdit(fields, values, header.length, addsColumns)
    const edits = [...getChangedFieldEdits(fields, values), ...(addedField ? [addedField] : [])]
    for (const edit of edits) {
      result += original.slice(offset, edit.start) + edit.text
      offset = edit.end
    }
  }
  result += original.slice(offset)

  const existingCellRows = records.length - 1
  const addedRows = cells.slice(existingCellRows)
  if (addedRows.length === 0) {
    return result
  }
  const hasFinalNewline = /(?:\r\n|\r|\n)$/.test(original)
  const prefix = hasFinalNewline ? '' : lineEnding
  const suffix = hasFinalNewline ? lineEnding : ''
  return result + prefix + addedRows.map((row) => serializeRow(row.slice(0, header.length))).join(lineEnding) + suffix
}
