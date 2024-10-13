import type { CsvRow } from '../CsvRow/CsvRow.ts'

const parseItem = (item: string): string => {
  return item.trim()
}

export const parseCsvLine = (line: string): CsvRow => {
  return line.split(',').map(parseItem)
}
