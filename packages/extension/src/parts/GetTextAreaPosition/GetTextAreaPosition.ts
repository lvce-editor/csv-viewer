export interface Position {
  readonly x: number
  readonly y: number
}

export const getTextAreaPosition = (rowIndex: number, columnIndex: number): Position => {
  const rowHeight = 20
  const columnWidth = 120
  const firstColumnWidth = 40
  let x = 0
  if (columnIndex >= 1) {
    x += firstColumnWidth
  }
  if (columnIndex >= 2) {
    x += (columnIndex - 1) * columnWidth
  }
  return {
    x: x + 1,
    y: rowHeight * (rowIndex + 1) + 1,
  }
}
