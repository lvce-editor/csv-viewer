import type { WebView } from '../WebView/WebView.ts'

const webviews = Object.create(null)

export const set = (id: number, webView: WebView): void => {
  webviews[id] = webView
}

export const get = (id: number): WebView => {
  return webviews[id]
}
