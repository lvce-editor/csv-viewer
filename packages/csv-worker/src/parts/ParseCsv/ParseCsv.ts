import * as ParseCsvLine from '../ParseCsvLine/ParseCsvLine.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'

export const parseCsv = (content: string): ParsedCsv => {
  const lines = SplitLines.splitLines(content)
  const parsed = lines.map(ParseCsvLine.parseCsvLine)
  return {
    header: parsed[0],
    content: parsed.slice(1),
  }
}
