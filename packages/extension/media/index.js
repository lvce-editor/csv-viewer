// TODO use virtual dom in worker

const initialize = (textContent) => {
  const app = document.createElement('div')
  app.className = 'App'
  const content = document.createElement('div')
  content.className = 'Content'
  content.textContent = textContent
  app.append(content)
  document.body.append(app)
}

const rpc = globalThis.lvceRpc({
  initialize,
})
