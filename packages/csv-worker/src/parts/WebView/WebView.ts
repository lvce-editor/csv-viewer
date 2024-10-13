import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const create = (id: number) => {
  const webview = {
    rowIndex: 0,
    columnIndex: 0,
    textArea: false,
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

export const setTextArea = (id: number, textArea: boolean) => {
  const webView = WebViewStates.get(id)
  const newWebView = {
    ...webView,
    textArea,
  }
  WebViewStates.set(id, newWebView)
}

export const getCursor = (id: number) => {
  return WebViewStates.get(id)
}

const getNewWebView = (webView: any, key: string): any => {
  let rowIndex = webView.rowIndex
  let columnIndex = webView.columnIndex
  if (key === 'ArrowLeft') {
    columnIndex--
  } else if (key === 'ArrowRight') {
    columnIndex++
  } else if (key === 'ArrowDown') {
    rowIndex++
  } else if (key === 'ArrowUp') {
    rowIndex--
  }
  if (rowIndex <= 0) {
    rowIndex = 0
  }
  if (columnIndex <= 0) {
    columnIndex = 0
  }
  return {
    ...webView,
    rowIndex,
    columnIndex,
  }
}
export const handleKeyDown = (id: number, key: string) => {
  const webView = WebViewStates.get(id)
  if (!webView) {
    throw new Error(`webview not found ${id}`)
  }
  const newWebView = getNewWebView(webView, key)
  WebViewStates.set(id, newWebView)
}
