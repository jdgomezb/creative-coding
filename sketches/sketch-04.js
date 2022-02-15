const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane')

const settings = {
  animate: true,
  dimensions: [1080, 1080],
}

const params = {
  cols: 30,
  rows: 30,
  scaleMin: 1,
  scaleMax: 30,
  frequency: 0.001,
  amplitude: 0.2,
  animate: true,
  frame: 0,
}

const sketch = ({ context, width, height }) => {
  const EIGHTY = 0.8
  const HALF = 0.5

  return ({ context, width, height, frame }) => {
    const cols = params.cols
    const rows = params.rows
    const numCells = cols * rows
    const gridW = width * EIGHTY
    const gridH = height * EIGHTY
    const cellW = gridW / cols
    const cellH = gridH / rows
    const gapX = (width - gridW) * HALF
    const gapY = (height - gridH) * HALF

    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    for (let i = 0; i < numCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cellW
      const y = row * cellH
      const w = cellW * EIGHTY
      const h = cellH * EIGHTY
      const f = params.animate ? frame : params.frame

      // const n = random.noise2D(x + f * 20, y, params.frequency)
      const n = random.noise3D(x, y, f * 10, params.frequency)

      const angle = n * Math.PI * params.amplitude
      // const scale = ((n + 1) / 2) * 30
      // const scale = (n * HALF + HALF) * 30
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax)

      context.save()
      context.translate(x, y)
      context.translate(gapX, gapY)
      context.translate(cellW * HALF, cellH * HALF)
      context.rotate(angle)
      context.lineWidth = scale
      context.lineCap = 'square'

      context.beginPath()
      context.moveTo(w * -HALF, 0)
      context.lineTo(w * HALF, 0)
      context.stroke()
      context.restore()
    }
  }
}

const createPane = () => {
  const pane = new Tweakpane.Pane()
  const grid = pane.addFolder({
    title: 'Grid',
  })
  grid.addInput(params, 'cols', { min: 2, max: 50, step: 1 })
  grid.addInput(params, 'rows', { min: 2, max: 50, step: 1 })
  grid.addInput(params, 'scaleMin', { min: 1, max: 100 })
  grid.addInput(params, 'scaleMax', { min: 1, max: 100 })

  const noise = pane.addFolder({
    title: 'Noise',
  })
  noise.addInput(params, 'frequency', { min: -0.01, max: 0.01 })
  noise.addInput(params, 'amplitude', { min: 0, max: 1 })
  noise.addInput(params, 'animate')
  noise.addInput(params, 'frame', { min: 0, max: 999 })
}

createPane()
canvasSketch(sketch, settings)
