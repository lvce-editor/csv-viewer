const workers = new Map()

const getOrCreate = (fn) => {
  if (!workers.has(fn)) {
    workers.set(fn, fn())
  }
  return workers.get(fn)
}

export const getOrCreateWorker = (fn) => {
  return {
    async invoke(method, ...params) {
      const rpc = await getOrCreate(fn)
      return rpc.invoke(method, ...params)
    },
    async dispose() {
      const promise = workers.get(fn)
      workers.delete(fn)
      const rpc = await promise
      rpc.dispose()
    },
  }
}
