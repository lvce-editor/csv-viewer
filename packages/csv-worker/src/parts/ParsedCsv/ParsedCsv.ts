import type { CsvRow } from '../CsvRow/CsvRow.ts'

export interface ParsedCsv {
  readonly header: CsvRow
  readonly content: readonly CsvRow[]
}
