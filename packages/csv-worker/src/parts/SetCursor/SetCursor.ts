import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const setCursor = (id: number, rowIndex: number, columnIndex: number) => {
  const webView = WebViewStates.get(id)
  const newWebView = {
    ...webView,
    rowIndex,
    columnIndex,
  }
  WebViewStates.set(id, newWebView)
}
