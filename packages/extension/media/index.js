// TODO use virtual dom in worker

const initialize = (parsed) => {
  const $App = document.createElement('div')
  $App.className = 'App'
  const $Content = document.createElement('div')
  $Content.className = 'Content'

  const rows = parsed
  for (const row of rows) {
    const $Row = document.createElement('div')
    $Row.className = 'Row'
    for (const element of row) {
      const $Cell = document.createElement('div')
      $Cell.className = 'Cell'
      $Cell.textContent = element
      $Row.append($Cell)
    }
    $Content.append($Row)
  }
  $App.append($Content)
  document.body.append($App)
}

const rpc = globalThis.lvceRpc({
  initialize,
})
