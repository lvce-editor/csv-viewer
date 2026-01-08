import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const getSavedRowIndex = (savedState: any): number => {
  if (savedState && typeof savedState.rowIndex === 'number') {
    return savedState.rowIndex
  }
  return 0
}

const getSavedColumnIndex = (savedState: any) => {
  if (savedState && typeof savedState.columnIndex === 'number') {
    return savedState.columnIndex
  }
  return 0
}

const getSavedValue = (savedState: any) => {
  if (savedState && typeof savedState.value === 'string') {
    return savedState.value
  }
  return ''
}

export const setSavedState = (id: number, savedState: any): void => {
  const webView = WebViewStates.get(id)
  const rowIndex = getSavedRowIndex(savedState)
  const columnIndex = getSavedColumnIndex(savedState)
  const value = getSavedValue(savedState)
  const newState: WebView = {
    ...webView,
    columnIndex,
    rowIndex,
    value,
  }
  WebViewStates.set(id, newState)
}
