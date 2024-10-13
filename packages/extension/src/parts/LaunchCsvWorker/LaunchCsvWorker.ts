import * as HeapSnapshotWorkerUrl from '../HeapSnapshotWorkerUrl/HeapSnapshotWorkerUrl.ts'

const execute = (method, ...params) => {
  return {}
}

export const launchCsvWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: HeapSnapshotWorkerUrl.heapSnapshotWorkerUrl,
    name: 'CSV Worker',
    execute,
  })
  return rpc
}
