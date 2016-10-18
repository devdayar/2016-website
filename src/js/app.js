'use strict'

function aload () {
  const attribute = 'data-aload'
  let nodes = window.document.querySelectorAll('[' + attribute + ']')

  if (nodes.length === undefined) {
    nodes = [nodes]
  }

  [].forEach.call(nodes, function (node) {
    node[ node.tagName !== 'LINK' ? 'src' : 'href' ] = node.getAttribute(attribute)
    node.removeAttribute(attribute)
  })

  return nodes
}

aload()
