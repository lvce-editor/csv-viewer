import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getPosition = (id: number): any => {
  const webView = WebViewStates.get(id)
  return {
    columnIndex: webView.columnIndex,
    rowIndex: webView.rowIndex,
  }
}
