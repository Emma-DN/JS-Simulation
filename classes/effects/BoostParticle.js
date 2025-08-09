import Utils from "../utils/utils.js"
import canvasUtils from "../../canvas.js"
class BoostParticle {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        const maxSpread = 0.5
        this.spread = Utils.random(-maxSpread, maxSpread)
        angle += this.spread
        this.maxSpeed = 2
        this.dx = Math.cos(angle) * this.maxSpeed
        this.dy = Math.sin(angle) * this.maxSpeed

        this.size = 4
        this.halfSize = this.size / 2

        this.maxttl = 60
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

export default BoostParticle