// TODO use virtual dom in worker

const initialize = (parsed) => {
  const app = document.createElement('div')
  app.className = 'App'
  const content = document.createElement('div')
  content.className = 'Content'
  content.textContent = JSON.stringify(parsed, null, 2)
  app.append(content)
  document.body.append(app)
}

const rpc = globalThis.lvceRpc({
  initialize,
})
