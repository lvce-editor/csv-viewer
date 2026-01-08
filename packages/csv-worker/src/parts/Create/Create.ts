import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number, port: MessagePort): void => {
  const webview: WebView = {
    cells: [],
    columnIndex: 0,
    header: [],
    port,
    rowIndex: 0,
    textArea: false,
    value: '',
  }
  WebViewStates.set(id, webview)
}
