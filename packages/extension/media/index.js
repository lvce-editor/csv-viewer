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
  $Element.append(...$$children)
  return $Element
}

const initialize = (vdom) => {
  const $App = document.createElement('div')
  $App.className = 'App'
  const $Rendered = render(vdom)
  $App.append($Rendered)
  document.body.append($App)
}

const rpc = globalThis.lvceRpc({
  initialize,
})
