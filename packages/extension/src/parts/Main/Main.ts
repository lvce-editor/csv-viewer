import * as CsvWorker from '../CsvWorker/CsvWorker.ts'

const id = 1

const webViewProvider = {
  id: 'builtin.csv-viewer',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)

    const parsed = await CsvWorker.invoke('Csv.parse', content)
    const vdom = await CsvWorker.invoke('Csv.getVirtualDom', parsed)
    await webView.invoke('initialize', vdom)
    await CsvWorker.invoke('WebView.create', id)

    // TODO ask csv worker to create virtual dom
    // TODO support connecting state to webview
    // @ts-ignore
    this.webView = webView
    // @ts-ignore
    webViewProvider.parsed = parsed
  },
  async open(uri, webView) {
    // const content = await vscode.readFile(uri)
    // webView.postMessage({
    //   jsonrpc: '2.0',`
    //   method: 'setContent',
    //   params: [content],
    // })
  },
  commands: {
    async handleInput(text) {},
    async handleDoubleClick(row, column) {
      const parsedRow = parseInt(row)
      const parsedColumn = parseInt(column)
      // @ts-ignore
      const parsed = webViewProvider.parsed
      const cursor = {
        rowIndex: parsedRow,
        columnIndex: parsedColumn,
        textArea: true,
      }
      await CsvWorker.invoke('WebView.setCursor', id, parsedRow, parsedColumn)
      await CsvWorker.invoke('WebView.setTextarea', id, cursor.textArea)
      const newDom = await CsvWorker.invoke('Csv.getVirtualDom', parsed, cursor)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
    async handleClick(row, column) {
      const parsedRow = parseInt(row)
      const parsedColumn = parseInt(column)
      // @ts-ignore
      const parsed = webViewProvider.parsed
      const cursor = {
        rowIndex: parsedRow,
        columnIndex: parsedColumn,
      }
      await CsvWorker.invoke('WebView.setCursor', id, parsedRow, parsedColumn)
      const newDom = await CsvWorker.invoke('Csv.getVirtualDom', parsed, cursor)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
    async handleKeyDown(key) {
      await CsvWorker.invoke('WebView.handleKeyDown', id, key)
      const cursor = await CsvWorker.invoke('WebView.getCursor', id)
      // @ts-ignore
      const parsed = webViewProvider.parsed
      const newDom = await CsvWorker.invoke('Csv.getVirtualDom', parsed, cursor)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
