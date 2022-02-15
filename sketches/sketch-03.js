const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  animate: true,
  dimensions: [1080, 1080],
}

const animation = () => {
  console.log('domestika')
  requestAnimationFrame(animation)
}
// animation()

const sketch = ({ context, width, height }) => {
  const agents = []
  const items = 60

  for (let i = 0; i < items; i++) {
    const x = random.range(0, width)
    const y = random.range(0, height)

    agents.push(new Agent(x, y))
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j]
        const distance = agent.pos.getDistance(other.pos)

        if (distance > 200) continue

        context.lineWidth = math.mapRange(distance, 0, 200, 12, 1)
        context.beginPath()
        context.moveTo(agent.pos.x, agent.pos.y)
        context.lineTo(other.pos.x, other.pos.y)
        context.stroke()
        context.strokeStyle = 'white'
      }
    }

    agents.forEach((agent) => {
      agent.update()
      agent.draw(context)
      agent.bounce(width, height)
    })
  }
}

canvasSketch(sketch, settings)

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  getDistance(v) {
    const dx = this.x - v.x
    const dy = this.y - v.y

    return Math.sqrt(dx * dx + dy * dy)
  }
}

class Agent {
  speed = 1.5

  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(
      random.range(-this.speed, this.speed),
      random.range(-this.speed, this.speed)
    )
    this.radius = random.range(2, 8)
    this.lineWidth = random.range(1, 4)
  }

  draw(context) {
    context.fillStyle = 'white'
    context.save()
    context.translate(this.pos.x, this.pos.y)
    context.lineWidth = this.lineWidth
    context.beginPath()
    context.arc(0, 0, this.radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()
    context.restore()
  }

  update() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  bounce(width, height) {
    const size = this.radius * 2

    if (this.pos.x <= size || this.pos.x >= width - size) this.vel.x *= -1
    if (this.pos.y <= size || this.pos.y >= height - size) this.vel.y *= -1
  }

  wrap(width, height) {
    const size = this.radius * 2

    if (this.pos.x <= -size) this.pos.x = width + size
    if (this.pos.y <= -size) this.pos.y = height + size

    if (this.pos.x >= width + size) this.pos.x = -size
    if (this.pos.y >= height + size) this.pos.y = -size
  }
}
