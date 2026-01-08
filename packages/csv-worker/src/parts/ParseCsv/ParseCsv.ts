import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'
import * as ParseCsvLine from '../ParseCsvLine/ParseCsvLine.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export const parseCsv = (content: string): ParsedCsv => {
  const lines = SplitLines.splitLines(content)
  const parsed = lines.map(ParseCsvLine.parseCsvLine)
  return {
    content: parsed.slice(1),
    header: parsed[0],
  }
}
