const webviews = Object.create(null)

export const set = (id: number, webView: any) => {
  webviews[id] = webView
}

export const get = (id: number) => {
  return webviews[id]
}
