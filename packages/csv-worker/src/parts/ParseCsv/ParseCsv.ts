import type { CsvRow } from '../CsvRow/CsvRow.ts'
import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'

const parseItem = (item: string): string => {
  return item.trim()
}

const parseCsvLine = (line: string): CsvRow => {
  return line.split(',').map(parseItem)
}

export const parseCsv = (content: string): ParsedCsv => {
  const lines = content.split('\n')
  const parsed = lines.map(parseCsvLine)
  return {
    header: parsed[0],
    content: parsed.slice(1),
  }
}
