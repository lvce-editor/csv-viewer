export type Row = readonly string[]

export interface WebView {
  readonly cells: readonly Row[]
  readonly columnIndex: number
  readonly header: Row
  readonly port: any
  readonly rowIndex: number
  readonly textArea: boolean
  readonly value: string
}
