import type { Row, WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const setHeader = (id: number, row: Row): void => {
  const webView = WebViewStates.get(id)
  const newState: WebView = {
    ...webView,
    header: row,
  }
  WebViewStates.set(id, newState)
}
