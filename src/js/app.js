'use strict'

// --------------------------------------------------
//      Auxiliar functions
// --------------------------------------------------

const animateScroll = (target, duration, easing, padding, align, onFinish) => {
  padding = padding || 0
  var docElem = document.documentElement
  var windowHeight = docElem.clientHeight
  var maxScroll = ('scrollMaxY' in window) ? window.scrollMaxY : (docElem.scrollHeight - windowHeight)
  var currentY = window.pageYOffset

  var targetY = currentY
  var elementBounds = isNaN(target) ? target.getBoundingClientRect() : 0

  if (align === 'center') {
    targetY += isNaN(target) ? (elementBounds.top + elementBounds.height / 2) : target
    targetY -= windowHeight / 2
    targetY -= padding
  } else if (align === 'bottom') {
    targetY += elementBounds.bottom || target
    targetY -= windowHeight
    targetY += padding
  } else {
    targetY += elementBounds.top || target
    targetY -= padding
  }
  targetY = Math.max(Math.min(maxScroll, targetY), 0)

  var deltaY = targetY - currentY

  var obj = {
    targetY: targetY,
    deltaY: deltaY,
    duration: duration || 0,
    easing: (easing in animateScroll.Easing) ? animateScroll.Easing[easing] : animateScroll.Easing.linear,
    onFinish: onFinish,
    startTime: Date.now(),
    lastY: currentY,
    step: animateScroll.step
  }

  window.requestAnimationFrame(obj.step.bind(obj))
}

animateScroll.Easing = {
  linear: function (t) { return t },
  easeInQuad: function (t) { return t * t },
  easeOutQuad: function (t) { return t * (2 - t) },
  easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
  easeInCubic: function (t) { return t * t * t },
  easeOutCubic: function (t) { return (--t) * t * t + 1 },
  easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
  easeInQuart: function (t) { return t * t * t * t },
  easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
  easeInOutQuart: function (t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
  easeInQuint: function (t) { return t * t * t * t * t },
  easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
  easeInOutQuint: function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}

animateScroll.step = function () {
  if (this.lastY !== window.pageYOffset && this.onFinish) {
    this.onFinish()
    return
  }

  var t = Math.min((Date.now() - this.startTime) / this.duration, 1)

  var y = this.targetY - ((1 - this.easing(t)) * (this.deltaY))
  window.scrollTo(window.scrollX, y)

  if (t !== 1) {
    this.lastY = window.pageYOffset
    window.requestAnimationFrame(this.step.bind(this))
  } else {
    if (this.onFinish) this.onFinish()
  }
}

// --------------------------------------------------
//      Asynchronous image loading process
// --------------------------------------------------

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

// --------------------------------------------------
//      Menu
// --------------------------------------------------

const menu = document.querySelector('#menu')
const menuLinks = menu.querySelectorAll('a')
const menuToggle = document.querySelector('#menu-toggle')
const nav = document.querySelector('#nav')

const toggleMenu = () => {
  menu.classList.toggle('dn')
  menu.classList.toggle('db')
  menu.classList.toggle('fadeIn')

  if (menuToggle.classList.contains('is-active')) {
    menuToggle.textContent = 'Menú'
  } else {
    menuToggle.textContent = 'Cerrar'
  }

  menuToggle.classList.toggle('is-active')

  nav.classList.toggle('bg-light-purple-90')
  nav.classList.toggle('bg-purple-80')
}

menuToggle.addEventListener('click', e => {
  e.preventDefault()

  toggleMenu()
})

Array.prototype.forEach.call(menuLinks, link => {
  link.addEventListener('click', e => {
    e.preventDefault()

    const elementToScrollTo = document.querySelector(e.currentTarget.getAttribute('href'))

    toggleMenu()

    animateScroll(elementToScrollTo, 1000, 'easeInOutQuint', nav.offsetHeight)
  })
})

// --------------------------------------------------
//      In-page navigation
// --------------------------------------------------

const goToLinks = document.querySelectorAll('.js-go-to')

const closeMenuIfOpen = () => {
  if (menuToggle.classList.contains('is-active')) {
    menu.classList.add('dn')
    menu.classList.remove('db')
    menu.classList.remove('fadeIn')

    menuToggle.textContent = '☰ Menú'

    menuToggle.classList.remove('is-active')
  }
}

Array.prototype.forEach.call(goToLinks, link => {
  link.addEventListener('click', e => {
    e.preventDefault()

    const elementToScrollTo = document.querySelector(e.currentTarget.getAttribute('href'))

    closeMenuIfOpen()

    animateScroll(elementToScrollTo, 1000, 'easeInOutQuint', nav.offsetHeight)
  })
})

// --------------------------------------------------
//      Toggle speaker's bio
// --------------------------------------------------

const toggleBioLinks = document.querySelectorAll('.js-toggle-speaker-bio')

Array.prototype.forEach.call(toggleBioLinks, link => {
  link.addEventListener('click', e => {
    e.preventDefault()

    const currentLinK = e.target
    const nextSibling = currentLinK.previousSibling

    if (nextSibling.classList.contains('is-shown')) {
      currentLinK.textContent = 'Leer más'

      nextSibling.classList.add('dn')
      nextSibling.classList.remove('is-shown')
    } else {
      currentLinK.textContent = 'Leer menos'

      nextSibling.classList.remove('dn')
      nextSibling.classList.add('is-shown')
    }
  })
})
