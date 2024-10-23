import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getTextArea = (id: number): boolean => {
  const webView = WebViewStates.get(id)
  return webView.textArea
}
