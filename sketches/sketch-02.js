const canvasSketch = require('canvas-sketch')
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [1080, 1080],
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)
    context.fillStyle = 'black'

    const SIZE = 0.3
    const HALF = 0.5

    const cx = 0
    const cy = 0
    const w = width * 0.01
    const h = height * 0.1
    const ticks = 40
    const tickPosition = math.degToRad(360 / ticks)
    const radius = width * 0.8

    let x, y

    for (let i = 0; i < ticks; i++) {
      const angle = tickPosition * i

      x = cx + radius * Math.sin(angle)
      y = cy + radius * Math.cos(angle)

      // Draw ticks
      context.save()
      context.translate(x, y)
      context.rotate(-angle)
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5))

      context.beginPath()
      context.rect(
        -w * HALF,
        random.range(0, -h * HALF),
        w,
        random.range(1, h * 4)
      )
      context.fill()
      context.restore()

      // Draw arcs
      context.save()
      context.translate(cx, cy)
      context.rotate(-angle)
      context.lineWidth = random.range(1, 20)

      context.beginPath()
      context.arc(
        0,
        0,
        radius * random.range(0.7, 1.3),
        tickPosition * random.range(1, -8),
        tickPosition * random.range(1, 5)
      )
      context.stroke()
      context.restore()
    }
  }
}

canvasSketch(sketch, settings)
