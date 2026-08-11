import type { CsvRow } from '../CsvViewState/CsvViewState.ts'

export interface ParsedCsv {
  readonly content: readonly CsvRow[]
  readonly header: CsvRow
}

const unquote = (item: string): string => {
  if (item.startsWith('"') && item.endsWith('"')) {
    return item.slice(1, -1)
  }
  return item
}

export const parseCsvLine = (line: string): CsvRow => {
  return line.split(',').map((item) => unquote(item).trim())
}

export const parseCsv = (content: string): ParsedCsv => {
  const rows = content.split('\n').map(parseCsvLine)
  return {
    content: rows.slice(1),
    header: rows[0] || [],
  }
}
