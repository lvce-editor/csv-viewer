import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'

export const getVirtualDom = (id: number): any => {
  const webView = WebViewStates.get(id)
  const dom = GetCsvVirtualDom.getCsvVirtualDom({
    header: webView.header,
    content: webView.cells,
  })
  return dom
}
