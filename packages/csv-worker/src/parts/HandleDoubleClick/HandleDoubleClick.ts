import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleDoubleClick = async (id: number, row: string, column: string) => {
  const parsedRow = parseInt(row)
  const parsedColumn = parseInt(column)
  const cursor = {
    rowIndex: parsedRow,
    columnIndex: parsedColumn,
    textArea: true,
  }
  SetCursor.setCursor(id, parsedRow, parsedColumn)
  SetTextArea.setTextArea(id, cursor.textArea)

  const { port } = WebViewStates.get(id)
  const newDom = GetVirtualDom.getVirtualDom(id)
  await port.invoke('setDom', newDom)
  await port.invoke('focusTextArea')
}
