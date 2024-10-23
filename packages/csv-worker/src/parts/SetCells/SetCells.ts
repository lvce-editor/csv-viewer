import type { Row } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const setCells = (id: number, cells: readonly Row[]): void => {
  const webView = WebViewStates.get(id)
  const newState = {
    ...webView,
    cells,
  }
  WebViewStates.set(id, newState)
}
