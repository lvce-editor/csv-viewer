import type { CsvRow } from '../CsvRow/CsvRow.ts'

const unquote = (item: string): string => {
  if (item.startsWith('"') && item.endsWith('"')) {
    return item.slice(1, -1)
  }
  return item
}

const parseItem = (item: string): string => {
  return unquote(item).trim()
}

export const parseCsvLine = (line: string): CsvRow => {
  return line.split(',').map(parseItem)
}
