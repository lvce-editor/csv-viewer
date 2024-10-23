import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const getNewWebView = (webView: any, key: string): any => {
  let rowIndex = webView.rowIndex
  let columnIndex = webView.columnIndex
  if (key === 'Enter') {
    return {
      ...webView,
      textArea: false,
    }
  }
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
