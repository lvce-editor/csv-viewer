export type CsvRow = readonly string[]

export interface CsvViewState {
  readonly cells: readonly CsvRow[]
  readonly columnIndex: number
  readonly focusRequest: boolean
  readonly focusSelector: string
  readonly header: CsvRow
  readonly rowIndex: number
  readonly textArea: boolean
  readonly value: string
}
