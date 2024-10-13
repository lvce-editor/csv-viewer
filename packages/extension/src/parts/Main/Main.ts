import * as FilterAggregates from '../FilterAggregates/FilterAggregates.ts'

const webViewProvider = {
  id: 'builtin.csv-viewer',
  async create(webView, uri) {
    // TODO ask csv worker to create virtual dom
    // TODO support connecting state to webview
    // @ts-ignore
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
    async handleInput(text) {
      // @ts-ignore
      const aggregates = webViewProvider.aggregates
      // @ts-ignore
      const webView = webViewProvider.webView
      const filtered = FilterAggregates.filterAggregates(aggregates, text)
      await webView.invoke('setContent', filtered)
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
