export type Row = readonly string[]

export interface WebView {
  readonly rowIndex: number
  readonly columnIndex: number
  readonly textArea: boolean
  readonly cells: readonly Row[]
  readonly value: string
  readonly header: Row
}
