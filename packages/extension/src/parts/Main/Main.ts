import * as CsvWorker from '../CsvWorker/CsvWorker.ts'

const webViewProvider = {
  id: 'builtin.csv-viewer',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)

    const parsed = await CsvWorker.invoke('Csv.parse', content)
    const vdom = await CsvWorker.invoke('Csv.getVirtualDom', parsed)
    await webView.invoke('initialize', vdom)

    // TODO ask csv worker to create virtual dom
    // TODO support connecting state to webview
    // @ts-ignore
    this.webView = webView
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
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
