import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number): void => {
  const webview = {
    rowIndex: 0,
    columnIndex: 0,
    textArea: false,
  }
  WebViewStates.set(id, webview)
}
