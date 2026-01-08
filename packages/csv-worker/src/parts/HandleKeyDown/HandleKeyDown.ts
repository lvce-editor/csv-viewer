import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const getNewWebView = (webView: any, key: string): any => {
  let {rowIndex} = webView
  let {columnIndex} = webView
  if (key === 'Enter') {
    return {
      ...webView,
      textArea: false,
    }
  }
  switch (key) {
  case 'ArrowDown': {
    rowIndex++
  
  break;
  }
  case 'ArrowLeft': {
    columnIndex--
  
  break;
  }
  case 'ArrowRight': {
    columnIndex++
  
  break;
  }
  case 'ArrowUp': {
    rowIndex--
  
  break;
  }
  // No default
  }
  if (rowIndex <= 0) {
    rowIndex = 0
  }
  if (columnIndex <= 0) {
    columnIndex = 0
  }
  return {
    ...webView,
    columnIndex,
    rowIndex,
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
