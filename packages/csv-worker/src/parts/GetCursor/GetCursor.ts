import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getCursor = (id: number) => {
  return WebViewStates.get(id)
}
