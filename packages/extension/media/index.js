const handleDoubleClick = async (event) => {
  event.preventDefault()
  const { target } = event
  const { dataset } = target
  await rpc.invoke('handleDoubleClick', dataset.row, dataset.column)
}

const handleClick = async (event) => {
  event.preventDefault()
  const { target } = event
  const { dataset } = target
  await rpc.invoke('handleClick', dataset.row, dataset.column)
}

const handleKeyDown = async (event) => {
  const { key } = event
  await rpc.invoke('handleKeyDown', key)
}

const render = (vdom) => {
  if (vdom.type === 'text') {
    const node = document.createTextNode(vdom.value)
    return node
  }
  const children = vdom.children || []
  const $$children = children.map(render)
  const $Element = document.createElement(vdom.type)
  if (vdom.className) {
    $Element.className = vdom.className
  }
  if (vdom['data-row'] !== undefined) {
    $Element.dataset.row = vdom['data-row']
  }
  if (vdom['data-column'] !== undefined) {
    $Element.dataset.column = vdom['data-column']
  }
  $Element.append(...$$children)
  return $Element
}

const setDom = (vdom) => {
  const $Rendered = render(vdom)
  const $App = document.querySelector('.App')
  $App?.replaceChildren()
  $App?.append($Rendered)
}

const initialize = (vdom) => {
  const $App = document.createElement('div')
  $App.addEventListener('dblclick', handleDoubleClick)
  $App.addEventListener('pointerdown', handleClick)
  window.addEventListener('keydown', handleKeyDown)
  $App.className = 'App'
  document.body.append($App)
  setDom(vdom)
}

const rpc = globalThis.lvceRpc({
  initialize,
  setDom,
})
