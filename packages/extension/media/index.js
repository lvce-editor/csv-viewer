const handleDoubleClick = async (event) => {
  event.preventDefault()
  const { target } = event
  const { dataset } = target
  await rpc.invoke('handleDoubleClick', dataset.row, dataset.column)
}

const handlePointerDown = async (event) => {
  const { target, detail } = event
  const { dataset } = target
  if (target.nodeName === 'TEXTAREA') {
    return
  }
  await rpc.invoke('handleClick', dataset.row, dataset.column)
}

const handleKeyDown = async (event) => {
  const { key } = event
  if (key === 'Enter') {
    return
  }
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
  if (vdom.style) {
    for (const [key, value] of Object.entries(vdom.style)) {
      $Element.style[key] = value
    }
  }
  if (vdom.name) {
    $Element.name = vdom.name
  }
  if (vdom.value) {
    $Element.value = vdom.value
  }
  $Element.append(...$$children)
  return $Element
}

const replace = ($Parent, $Old, $New) => {
  if (!$Old) {
    $Parent.append($New)
    return
  }
  if ($Old instanceof Text && $New instanceof Text) {
    $Old.nodeValue = $New.nodeValue
    return
  }
  if ($Old.nodeName !== $New.nodeName) {
    $Old.replaceWith($New)
    return
  }
  if ($Old.className !== $New.className) {
    $Old.className = $New.className
  }
  const oldChildLength = $Old.childNodes.length
  const newChildLength = $New.childNodes.length
  const minLength = Math.min(oldChildLength, newChildLength)
  for (let i = 0; i < minLength; i++) {
    replace($Old, $Old.childNodes[i], $New.childNodes[i])
  }
  for (let i = minLength; i < newChildLength; i++) {
    $Old.append($New.childNodes[i])
  }
  for (let i = minLength; i < oldChildLength; i++) {
    $Old.lastChild.remove()
  }
}

const setDom = (vdom) => {
  const $Rendered = render(vdom)
  const $App = document.querySelector('.App')
  replace($App, $App?.childNodes[0], $Rendered)
}

const initialize = (vdom) => {
  const $App = document.createElement('div')
  window.addEventListener('dblclick', handleDoubleClick, { capture: true })
  window.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('keydown', handleKeyDown)
  $App.className = 'App'
  document.body.append($App)
  setDom(vdom)
}

const handleTextAreaKeyDown = async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    await rpc.invoke('handleSubmit')
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    await rpc.invoke('handleCancel')
  }
}

const handleTextAreaInput = async (event) => {
  const { target } = event
  const { value } = target
  await rpc.invoke('handleInput', value)
}

const focusTextArea = () => {
  const $App = document.querySelector('.App')
  const $TextArea = $App?.querySelector('.TextArea')
  $TextArea?.addEventListener('keydown', handleTextAreaKeyDown)
  $TextArea?.addEventListener('input', handleTextAreaInput)
  // @ts-ignore
  $TextArea.focus()
}

const rpc = globalThis.lvceRpc({
  initialize,
  setDom,
  focusTextArea,
})
