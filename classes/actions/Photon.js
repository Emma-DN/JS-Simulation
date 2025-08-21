import canvasUtils from "../../canvas.js";
class Photon {
    static photons = [];
    static counter = 0;
    constructor(x, y, angle) {
        Photon.counter += 1
        this.ttl = 600; // changes based on monitor
        this.radius = 10;
        this.power = 3;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * this.power;
        this.dy = Math.sin(angle) * this.power;
    }

    static reset() {
        this.photons = [];
        this.counter = 0;
    }

    update() {
        if (this.ttl > 0) {
            this.ttl -= 1;
            if (this.ttl === 0) {
                this.die()
            }
            this.x += this.dx;
            this.y += this.dy;

            if (this.ttl < 100) this.radius *= 0.98;

            if (this.x > canvasUtils.canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvasUtils.canvas.width + this.radius;
            if (this.y > canvasUtils.canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvasUtils.canvas.height + this.radius;
        }

    }

    die() {
        this.ttl = 0
        Photon.counter -= 1
    }

    draw() {
        if (this.ttl > 0) {
            canvasUtils.view.beginPath()
            canvasUtils.view.arc(this.x, this.y, this.radius / 2.6, 0, Math.PI * 2)
            canvasUtils.view.fill()
        }
    }
}
export default Photon