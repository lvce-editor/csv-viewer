import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const saveState = (id: number): any => {
  const webView = WebViewStates.get(id)
  const { port, ...rest } = webView
  return rest
}
