import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = (id: number): void => {
  const state = WebViewStates.get(id)
  const { rowIndex, columnIndex, cells, value } = state
  const oldRow = cells[rowIndex]
  const newRow = [...oldRow.slice(0, columnIndex - 1), value, ...oldRow.slice(columnIndex + 1)]
  const newCells = [...cells.slice(0, rowIndex), newRow, ...cells.slice(rowIndex + 1)]
  const newState: WebView = {
    ...state,
    textArea: false,
    cells: newCells,
  }
  WebViewStates.set(id, newState)
}
