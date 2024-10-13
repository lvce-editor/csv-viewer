// TODO use virtual dom in worker

const initialize = (parsed) => {
  const $App = document.createElement('div')
  $App.className = 'App'

  const $Content = document.createElement('div')
  $Content.className = 'Content'

  const $Table = document.createElement('table')
  $Table.className = 'Table'

  const $Tbody = document.createElement('tbody')
  $Tbody.className = 'TableBody'

  const { content, header } = parsed

  const $Thead = document.createElement('thead')
  $Thead.className = 'TableHead'
  for (const element of header) {
    const $Th = document.createElement('th')
    $Th.textContent = element
    $Thead.append($Th)
  }

  for (const row of content) {
    const $Row = document.createElement('tr')
    $Row.className = 'Row'
    for (const element of row) {
      const $Cell = document.createElement('td')
      $Cell.className = 'Cell'
      $Cell.textContent = element
      $Row.append($Cell)
    }
    $Tbody.append($Row)
  }
  $Table.append($Thead, $Tbody)

  $Content.append($Table)
  $App.append($Content)
  document.body.append($App)
}

const rpc = globalThis.lvceRpc({
  initialize,
})
