import type { CsvRow } from '../CsvRow/CsvRow.ts'

export interface ParsedCsv {
  readonly content: readonly CsvRow[]
  readonly header: CsvRow
}
