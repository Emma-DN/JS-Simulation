import canvasUtils from "../../canvas.js"

class Particle {
    constructor(x, y) {
        const angle = Math.PI * 2 * Math.random()
        this.maxSpeed = 2

        this.x = x
        this.y = y
        const speedFactor = Math.random()
        this.dx = Math.cos(angle) * this.maxSpeed * speedFactor
        this.dy = Math.sin(angle) * this.maxSpeed * speedFactor
        this.size = 10
        this.halfSize = this.size / 2
        this.maxttl = 150
        this.ttl = this.maxttl

        this.color = [255, 255, 255, 1]
    }

    draw() {

        if (this.ttl > 0) {
            this.x += this.dx
            this.y += this.dy
            const oldStyle = canvasUtils.view.fillStyle

            canvasUtils.view.fillStyle = `rgba(${this.color[0]},${this.color[1]}, ${this.color[2]}, ${this.ttl / this.maxttl})`
            canvasUtils.view.fillRect(this.x - this.halfSize, this.y - this.halfSize, this.size, this.size)
            canvasUtils.view.fillStyle = oldStyle
            this.ttl -= 1;
        }
    }
}
export default Particle