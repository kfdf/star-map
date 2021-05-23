const fontSize = 20
/** @type{HTMLCanvasElement} */
let canvas = document.querySelector('#card')
let ctx = canvas.getContext('2d')
ctx.font = fontSize + 'px monospace'
canvas.width = ctx.measureText(' 888 8888 8 888').width + fontSize
let prevStar = null
/** @param{import('./field').Star} star */
export function showCard(star, x, y, touch) {
  if (star) {
    if (star != prevStar) { 
      canvas.height = fontSize * (star.planets.length + 1)
      ctx.font = fontSize + 'px monospace'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0008'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < star.planets.length; i++) {
        let p = star.planets[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        let cx = (p.isMoon ?  0.85 : 0.5) * fontSize
        let cy = (i + 1.5) * fontSize
        let size = p.size * fontSize / 2.2
        ctx.arc(cx, cy, size, 0, 2 * Math.PI)
        ctx.fill()
      }
      ctx.fillStyle = 'white'
      let name = star.cluster
      if (star.name != 'Prime') name = star.name + ' ' + name
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(name, canvas.width / 2, 2, canvas.width)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      for (let i = 0; i < star.planets.length; i++) {
        let p = star.planets[i]
        let line = ' ' + format(p.thermal, 1, 1)
        line += format(p.weather, 1, 1)
        line += format(p.tectonic, 1, 1)
        line += ' ' + format(p.minerals, 0, 4)
        let quality = p.quality < 10 ? p.quality : '+'
        line += ' ' + format(quality, 0, 1)
        line += ' ' + format(p.bioforms, 0, 3)
        ctx.fillText(line, fontSize, (i + 1.5) * fontSize + 2)
      }
      canvas.style.display = 'block'
    }
    if (touch) {
      x -= canvas.width / 2
      y -= canvas.height
    } else {
      x += 10
    }
    y = Math.max(0, Math.min(innerHeight - canvas.height, y))
    x = Math.max(0, Math.min(innerWidth - canvas.width, x))
    canvas.style.transform = `translate(${x}px, ${y}px)`
  } else if (prevStar != null) {
    canvas.style.display = ''
  }
  prevStar = star
}
function format(num, def, width) {
  let ret = num === def ? '-' : num.toString()
  if (ret.length < width) {
    ret = ret.padStart(width, ' ')
  } else if (ret.length > width) {
    ret = ret.slice(-width)
  } 
  return ret
}
