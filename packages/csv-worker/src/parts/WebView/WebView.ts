import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number) => {
  const webview = {
    rowIndex: 0,
    columnIndex: 0,
  }
  WebViewStates.set(id, webview)
}

export const setCursor = (id: number, rowIndex: number, columnIndex: number) => {
  const webView = WebViewStates.get(id)
  const newWebView = {
    ...webView,
    rowIndex,
    columnIndex,
  }
  WebViewStates.set(id, newWebView)
}

export const getCursor = (id: number) => {
  return WebViewStates.get(id)
}

export const handleKeyDown = (id: number, key: string) => {
  console.log({ key })
}
