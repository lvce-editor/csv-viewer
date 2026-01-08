import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleDoubleClick = async (id: number, row: string, column: string) => {
  const parsedRow = Number.parseInt(row)
  const parsedColumn = Number.parseInt(column)
  const cursor = {
    columnIndex: parsedColumn,
    rowIndex: parsedRow,
    textArea: true,
  }
  SetCursor.setCursor(id, parsedRow, parsedColumn)
  SetTextArea.setTextArea(id, cursor.textArea)

  const { port } = WebViewStates.get(id)
  const newDom = GetVirtualDom.getVirtualDom(id)
  await port.invoke('setDom', newDom)
  await port.invoke('focusTextArea')
}
