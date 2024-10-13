// @ts-ignore
const rpc = vscode.createRpc({
  id: 'builtin.csv-viewer.csv-worker',
})

export const invoke = (method, ...params) => {
  return rpc.invoke(method, ...params)
}
