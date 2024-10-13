import type { Cursor } from '../Cursor/Cursor.ts'
import type { Position } from '../Position/Position.ts'

export const getTextAreaPosition = (cursor: Cursor): Position => {
  const rowHeight = 20
  const columnWidth = 120
  const firstColumnWidth = 40
  let x = 0
  if (cursor.columnIndex >= 1) {
    x += firstColumnWidth
  }
  if (cursor.columnIndex >= 2) {
    x += (cursor.columnIndex - 1) * columnWidth
  }
  return {
    x,
    y: rowHeight * (cursor.rowIndex + 1),
  }
}
