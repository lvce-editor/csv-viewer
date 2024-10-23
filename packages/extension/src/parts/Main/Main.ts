import * as CsvWorker from '../CsvWorker/CsvWorker.ts'

const id = 1

const webViewProvider = {
  id: 'builtin.csv-viewer',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)

    const parsed = await CsvWorker.invoke('Csv.parse', content)
    await CsvWorker.invoke('WebView.create', id)
    console.log({ parsed })
    await CsvWorker.invoke('WebView.setHeader', id, parsed.header)
    await CsvWorker.invoke('WebView.setCells', id, parsed.content)
    const vdom = await CsvWorker.invoke('WebView.getVirtualDom', id)
    await webView.invoke('initialize', vdom)

    // TODO ask csv worker to create virtual dom
    // TODO support connecting state to webview
    // @ts-ignore
    this.webView = webView
  },
  async open(uri, webView) {},
  commands: {
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
      const newDom = await CsvWorker.invoke('WebView.getVirtualDom', id)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
      // @ts-ignore
      await webViewProvider.webView.invoke('focusTextArea')
    },
    async handleClick(row, column) {
      const parsedRow = parseInt(row)
      const parsedColumn = parseInt(column)
      await CsvWorker.invoke('WebView.setCursor', id, parsedRow, parsedColumn)
      const newDom = await CsvWorker.invoke('WebView.getVirtualDom', id)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
    async handleKeyDown(key) {
      await CsvWorker.invoke('WebView.handleKeyDown', id, key)
      const newDom = await CsvWorker.invoke('WebView.getVirtualDom', id)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
    async handleSubmit() {
      await CsvWorker.invoke('WebView.handleSubmit', id)
      const newDom = await CsvWorker.invoke('WebView.getVirtualDom', id)
      // @ts-ignore
      await webViewProvider.webView.invoke('setDom', newDom)
    },
    async handleInput(value) {
      await CsvWorker.invoke('WebView.handleInput', id, value)
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
