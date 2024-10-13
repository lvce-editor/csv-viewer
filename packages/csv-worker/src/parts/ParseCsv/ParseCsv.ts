import { CsvRow } from '../CsvRow/CsvRow.ts'

const parseItem = (item: string): string => {
  return item.trim()
}

const parseCsvLine = (line: string): CsvRow => {
  return line.split(',').map(parseItem)
}

export const parseCsv = (content: string): readonly CsvRow[] => {
  const lines = content.split('\n')
  const parsed = lines.map(parseCsvLine)
  return parsed
}
