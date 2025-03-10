import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number, port: MessagePort): void => {
  const webview: WebView = {
    rowIndex: 0,
    columnIndex: 0,
    textArea: false,
    cells: [],
    value: '',
    header: [],
    port,
  }
  WebViewStates.set(id, webview)
}
