const rpc = globalThis.rpc

export const invoke = async (method: string, ...params: any[]): Promise<any> => {
  const url = await rpc.invoke(method, ...params)
  return url
}
