import * as SetCursor from '../SetCursor/SetCursor.ts'

export const handleClick = (id: number, row: string, column: string) => {
  const parsedRow = Number.parseInt(row)
  const parsedColumn = Number.parseInt(column)
  SetCursor.setCursor(id, parsedRow, parsedColumn)
}
