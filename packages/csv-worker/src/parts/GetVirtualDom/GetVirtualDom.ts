import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getVirtualDom = (id: number): any => {
  const webView = WebViewStates.get(id)
  const dom = GetCsvVirtualDom.getCsvVirtualDom(
    {
      content: webView.cells,
      header: webView.header,
    },
    {
      columnIndex: webView.columnIndex,
      rowIndex: webView.rowIndex,
      textArea: webView.textArea,
    },
  )
  return dom
}
