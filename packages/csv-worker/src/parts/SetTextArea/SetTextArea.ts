import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const setTextArea = (id: number, textArea: boolean) => {
  const webView = WebViewStates.get(id)
  const newWebView = {
    ...webView,
    textArea,
  }
  WebViewStates.set(id, newWebView)
}
