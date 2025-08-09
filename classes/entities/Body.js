import canvasUtils from "../../canvas.js";

class Body {
    static bodies = [];
    static count = 3;
    
    constructor(r = 80, argX = canvasUtils.canvas.width * Math.random(), argY = canvasUtils.canvas.height * Math.random()) {
        this.active = true;
        const maxSpeed = 4

        this.x = argX
        this.y = argY

        this.dx = (maxSpeed * Math.random()) - (maxSpeed / 2)
        this.dy = (maxSpeed * Math.random()) - (maxSpeed / 2)

        this.radius = r
    }

    get diameter() {
        return this.radius * 2
    }

    update() {

        if (this.active) {
            if (this.x > canvasUtils.canvas.width + this.radius) {
                this.x -= canvasUtils.canvas.width + this.diameter
            }

            if (this.x < 0 - this.radius) {
                this.x += canvasUtils.canvas.width + this.diameter
            }

            if (this.y > canvasUtils.canvas.height + this.radius) {
                this.y -= canvasUtils.canvas.height + this.diameter
            }

            if (this.y < 0 - this.radius) {
                this.y += canvasUtils.canvas.height + this.diameter
            }

            this.x += this.dx
            this.y += this.dy
        }
    }

    draw() {
        if (this.active) {
            canvasUtils.view.beginPath()
            canvasUtils.view.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            canvasUtils.view.fill()
        }
    }

    stopRendering(arrayRef) {
        bodies.splice(arrayRef, 1)
    }
}
export default Body