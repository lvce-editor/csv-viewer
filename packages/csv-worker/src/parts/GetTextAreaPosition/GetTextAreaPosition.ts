import type { Cursor } from '../Cursor/Cursor.ts'
import type { Position } from '../Position/Position.ts'

export const getTextAreaPosition = (cursor: Cursor): Position => {
  const rowHeight = 20
  const columnWidth = 80
  return {
    x: columnWidth * cursor.columnIndex,
    y: rowHeight * cursor.rowIndex,
  }
}
