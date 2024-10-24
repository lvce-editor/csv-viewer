import { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const saveState = (id: number): WebView => {
  const webView = WebViewStates.get(id)
  return webView
}
