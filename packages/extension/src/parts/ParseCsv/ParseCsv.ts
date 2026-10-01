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

export const serializeCsvEdits = (original: string, cells: readonly CsvRow[]): string => {
  const records = parseFields(original)
  let result = ''
  let offset = 0
  for (let rowIndex = 1; rowIndex < records.length; rowIndex++) {
    const fields = records[rowIndex].entries()
    for (const [columnIndex, field] of fields) {
      const value = cells[rowIndex - 1]?.[columnIndex]
      if (typeof value === 'string' && value !== field.value) {
        result += original.slice(offset, field.start) + quoteField(value)
        offset = field.end
      }
    }
  }
  return result + original.slice(offset)
}
