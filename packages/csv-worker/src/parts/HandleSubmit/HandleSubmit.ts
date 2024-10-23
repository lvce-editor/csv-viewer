import type { WebView } from '../WebView/WebView.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleSubmit = (id: number): void => {
  const state = WebViewStates.get(id)
  const newState: WebView = {
    ...state,
    textArea: false,
  }
  WebViewStates.set(id, newState)
}
