import type { Row } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getCells = (id: number): readonly Row[] => {
  const state = WebViewStates.get(id)
  return state.cells
}
