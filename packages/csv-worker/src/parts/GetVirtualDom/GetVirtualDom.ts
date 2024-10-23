import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const getVirtualDom = (id: number): any => {
  const webView = WebViewStates.get(id)
  const dom = GetCsvVirtualDom.getCsvVirtualDom(
    {
      header: webView.header,
      content: webView.cells,
    },
    {
      rowIndex: webView.rowIndex,
      columnIndex: webView.columnIndex,
      textArea: webView.textArea,
    },
  )
  return dom
}
