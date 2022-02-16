const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [1080, 1080],
}

let manager
let text = 'A'
let fontSize = 1200
let fontFamily = 'serif'
let fontStyle = 'normal'
let fontWeight = 'normal'

const HALF = 0.5
// const glyphs = 'ºª!"·$%&/()=¡|@#¢∞¬÷“”≠´‚?¿`+^*[]´ç¨Ç{}<,.->;:_'.split('')
const glyphs = '_=/'.split('')

const typeCanvas = document.createElement('canvas')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {
  const cell = 20
  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)
  const numCells = cols * rows

  typeCanvas.width = cols
  typeCanvas.height = rows

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'white'
    typeContext.fillRect(0, 0, cols, rows)

    fontSize = cols * 1.2

    typeContext.fillStyle = 'black'
    typeContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    typeContext.textBaseline = 'middle'
    typeContext.textBaseline = 'top'
    typeContext.textAlign = 'center'

    const metrics = typeContext.measureText(text)
    const mx = metrics.actualBoundingBoxLeft * -1
    const my = metrics.actualBoundingBoxAscent * -1
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    const tx = (cols - mw) * HALF - mx
    const ty = (rows - mh) * HALF - my
    typeContext.save()
    typeContext.translate(tx, ty)

    // typeContext.beginPath()
    // typeContext.rect(mx, my, mw, mh)
    // typeContext.stroke()

    typeContext.fillText(text, 0, 0)
    typeContext.restore()

    const typeData = typeContext.getImageData(0, 0, cols, rows).data
    // console.log(typeData)

    context.drawImage(typeCanvas, 0, 0)
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    for (let i = 0; i < numCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cell
      const y = row * cell

      const r = typeData[i * 4 + 0]
      const g = typeData[i * 4 + 1]
      const b = typeData[i * 4 + 2]
      const a = typeData[i * 4 + 3]
      const halfCell = cell * HALF

      const glyph = getGlyph(r)

      const sizeFactor = Math.random() < 0.1 ? 5 : 1.5

      context.font = `${cell * sizeFactor}px ${fontFamily}`
      // context.fillStyle = `rgb(${r},${g},${b})`
      context.fillStyle = `white`

      context.save()
      context.translate(x, y)
      context.translate(halfCell, halfCell)

      // context.fillRect(0, 0, cell, cell)
      // context.beginPath()
      // context.arc(0, 0, halfCell, 0, Math.PI * 2)
      // context.fill()

      context.fillText(glyph, 0, 0)

      context.restore()
    }
  }
}

const getGlyph = (value) => {
  if (value < 50) return ''
  if (value < 100) return '.'
  if (value < 150) return '-'
  if (value < 200) return '+'

  return random.pick(glyphs)
}

const onKeyUp = (event) => {
  if (event.keyCode < 65 || event.keyCode > 90) return

  text = event.key.toUpperCase()
  manager.render()
}

document.addEventListener('keyup', onKeyUp)

const start = async () => {
  manager = await canvasSketch(sketch, settings)
}

start()
