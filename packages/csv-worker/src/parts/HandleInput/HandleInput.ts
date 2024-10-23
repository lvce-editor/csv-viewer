import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleInput = (id: number, value: string): void => {
  const state = WebViewStates.get(id)
  const newState = {
    ...state,
    value,
  }
  WebViewStates.set(id, newState)
}
