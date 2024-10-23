import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const setTextArea = (id: number, textArea: boolean): void => {
  const webView = WebViewStates.get(id)
  const newWebView: WebView = {
    ...webView,
    textArea,
  }
  WebViewStates.set(id, newWebView)
}
