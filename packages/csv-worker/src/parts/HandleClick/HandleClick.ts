import * as SetCursor from '../SetCursor/SetCursor.ts'

export const handleClick = (id: number, row: string, column: string) => {
  const parsedRow = parseInt(row)
  const parsedColumn = parseInt(column)
  SetCursor.setCursor(id, parsedRow, parsedColumn)
}
