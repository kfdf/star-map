import { getRegion, labelFontSize } from './field.js'
import { showCard } from './card.js'

let wrapper = document.querySelector('#wrapper')
let touchPointer = document.querySelector('#touch-pointer')
/** @type {HTMLCanvasElement} */
let canvas = wrapper.querySelector('#field')
let ctx = canvas.getContext('2d', { alpha: false })

let mapX = 500, mapY = 500
let zoom = Math.min(innerHeight, innerWidth) / 1000
if (!(zoom > 0.1 && zoom < 10)) zoom = 1
let matrix, canvasMatrix = ctx.getTransform()
let mouseMatrix, dragMatrix, mouseX, mouseY

// let seen = new Set()
let renderCycle = 0
let rendering = false
async function render() {
  if (rendering) return
  rendering = true
  await null
  rendering = false
  let centerX = innerWidth / 2
  let centerY = innerHeight / 2
  if (dragMatrix != null || mouseMatrix != null) {
    let { e, f } = new DOMMatrix()
      .translateSelf(centerX, centerY)
      .scaleSelf(zoom, -zoom)
      .invertSelf()
      .translateSelf(mouseX, mouseY)  
    if (dragMatrix != null) {
      mapX = dragMatrix.e - e
      mapY = dragMatrix.f - f  
    } else {
      mapX = mouseMatrix.e - e
      mapY = mouseMatrix.f - f  
    }
  }
  matrix = new DOMMatrix()
    .translateSelf(centerX, centerY)
    .scaleSelf(zoom, -zoom)
    .translateSelf(-mapX, -mapY)  
  // There is loss of precision if a transform matrix is 
  // applied to a canvas and later read from it. Probably 
  // doesn't matter, but just to be on the safe side.
  // let canvasMatrix = ctx.getTransform()
  let abcdSame = 
    Math.abs(matrix.a - canvasMatrix.a) < 1e-7 &&
    Math.abs(matrix.b - canvasMatrix.b) < 1e-7 &&
    Math.abs(matrix.c - canvasMatrix.c) < 1e-7 &&
    Math.abs(matrix.d - canvasMatrix.d) < 1e-7
  let left = canvasMatrix.e - matrix.e
  let top = canvasMatrix.f - matrix.f
  let right = canvas.width - centerX * 2 - left
  let bottom = canvas.height - centerY * 2 - top
  if (!abcdSame || left < 0 || top < 0 || right < 0 || bottom < 0) {
    renderCycle += 1
    if (renderCycle > 1e6) renderCycle = 0
    canvas.width = centerX * 3
    canvas.height = centerY * 3
    left = centerX / 2
    top = centerY / 2
    ctx.resetTransform()
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    canvasMatrix = new DOMMatrix()
      .translateSelf(left, top)
      .multiplySelf(matrix)
    ctx.setTransform(canvasMatrix)
    ctx.beginPath()
    for (let i = 0; i <= 1000; i += 100) {
      ctx.moveTo(0, i)
      ctx.lineTo(1000, i)
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 1000)
    }
    ctx.lineWidth = 2
    ctx.lineCap = 'square'
    ctx.strokeStyle = '#444'    
    ctx.stroke()

    let inv = canvasMatrix.inverse()
    let y2 = Math.ceil(inv.f / 100)
    let x1 = Math.floor(inv.e / 100)
    inv = inv.translateSelf(centerX * 3, centerY * 3)
    let y1 = Math.floor(inv.f / 100)
    let x2 = Math.ceil(inv.e / 100)

    ctx.font = labelFontSize + 'px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        let { labels, stars } = getRegion(x, y)
        ctx.fillStyle = '#666'
        for (let label of labels) {
          if (label.renderCycle == renderCycle) continue
          label.renderCycle = renderCycle
          ctx.save()
          ctx.translate(label.x, label.y)
          ctx.scale(1, -1)
          ctx.fillText(label.name, 0, 0)
          ctx.restore()
        }
        for (let star of stars) {
          if (star.renderCycle == renderCycle) continue
          star.renderCycle = renderCycle
          ctx.fillStyle = star.color
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI)
          ctx.fill()
        } 
      }
    }    
  }
  canvas.style.transform = `translate(-${left}px, -${top}px)`
}
function updateMouseMatrixAndShowCard(isTouch) {
  mouseMatrix = matrix.inverse().translateSelf(mouseX, mouseY)    
  let { e, f } = mouseMatrix
  let { stars } = getRegion(Math.floor(e / 100), Math.floor(f / 100))
  let closestStar = null
  let closestDist = Infinity
  for (let star of stars) {
    let dx = Math.abs(star.x - e)
    let dy = Math.abs(star.y - f)
    if (dx > star.size * 3 || dy > star.size * 3) continue
    let dist = Math.max(dx, dy)
    if (dist > closestDist) continue
    closestDist = dist
    closestStar = star
  }
  showCard(closestStar, mouseX, mouseY, isTouch) 
  if (isTouch) {
    touchPointer.style.display = 'block'
    touchPointer.style.top = mouseY + 'px'
    touchPointer.style.left = mouseX + 'px'
  }  
}

document.addEventListener('wheel', event => {
  if (hasModifier(event)) return
  zoom *= event.deltaY < 0 ? 1.25 : 0.8
  render()
})
window.addEventListener('contextmenu', e => {
  e.preventDefault()
})
window.addEventListener('mousedown', e => {
  dragMatrix = mouseMatrix.translate()
})
window.addEventListener('mousemove', event => {
  mouseX = event.clientX
  mouseY = event.clientY  
  updateMouseMatrixAndShowCard(false)
  if (dragMatrix != null) render()
})
window.addEventListener('mouseup', event => {
  dragMatrix = null
})
/** @param {MouseEvent} e */
function hasModifier(e) {
  return e.ctrlKey || e.altKey || e.shiftKey || e.metaKey
}
window.addEventListener('keydown', e => {
  if (hasModifier(e)) return
  if (/^F\d{1,2}/.test(e.key)) return
  wrapper.classList.add('readme')
})
window.addEventListener('keyup', e => {
  wrapper.classList.remove('readme')
})
window.addEventListener('resize', render)
render()

let firstTouch, secondTouch, touchDist

function getSame(touch, touchEvent) {
  if (!touch) return
  let touches = touchEvent.changedTouches
  for (let i = 0; i < touches.length; i++) {
    let ret = touches[i]
    if (touch.identifier == ret.identifier) return ret
  }
}
function getDistance(touch, touch2) {
  let dx = touch.clientX - touch2.clientX
  let dy = touch.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}
window.addEventListener('touchstart', event => {
  event.preventDefault()
  let touches = Array.from(event.changedTouches)
  if (!firstTouch && touches.length) {
    firstTouch = touches.shift()
    mouseX = firstTouch.clientX
    mouseY = firstTouch.clientY - 40   
    updateMouseMatrixAndShowCard(true)
  }
  if (!secondTouch && touches.length) {
    secondTouch = touches.shift()
    touchDist = getDistance(firstTouch, secondTouch)
    dragMatrix = mouseMatrix.translate()
  }
})
window.addEventListener('touchmove', event => {
  event.preventDefault()
  let first = getSame(firstTouch, event)
  let second = getSame(secondTouch, event)
  if (first) {
    firstTouch = first
    mouseX = firstTouch.clientX
    mouseY = firstTouch.clientY - 40       
    updateMouseMatrixAndShowCard(true)
  }
  if (second) {
    secondTouch = second
  }
  if (!first && !second) return
  if (dragMatrix) {
    let newDist = getDistance(firstTouch, secondTouch)
    if (Math.abs(touchDist - newDist) > 10) {
      zoom *= newDist / touchDist
      touchDist = newDist
    }
  }
  render()
})
window.addEventListener('touchend', event => {
  event.preventDefault()
  let first = getSame(firstTouch, event)
  let second = getSame(secondTouch, event)
  if (first) {
    firstTouch = null
    touchPointer.style.display = ''
  }
  if (first || second) {
    secondTouch = null
    dragMatrix = null
  }
})
window.addEventListener('touchcancel', event => {
  event.preventDefault()
})
