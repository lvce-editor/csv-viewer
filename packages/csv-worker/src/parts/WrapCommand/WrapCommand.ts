import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import { id } from '../Id/Id.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const wrapCommand = (fn) => {
  return async (...args) => {
    await fn(id, ...args)
    const newState = WebViewStates.get(id)
    const { port } = newState
    const dom = GetVirtualDom.getVirtualDom(id)
    await port.invoke('setDom', dom)
  }
}
