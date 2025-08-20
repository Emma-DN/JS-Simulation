// import Keyboard from "../actions/Keyboard.js";
import { Input } from "../actions/Input.js";
import Boost from "../actions/Boost.js";
import canvasUtils from "../../canvas.js";
import Photon from "../actions/Photon.js";
import Utils from "../utils/utils.js"
import Explosion from "../effects/Explosion.js";

class Ship {

    static boosts = [];
    constructor(xArg = canvas.width / 2, yArg = canvas.height / 2) {
        this.init(xArg, yArg)
    }

    get tip() {
        const nose = {
            x: this.radius,
            y: 0
        }

        return this.rotate(nose);
    }

    init(xArg = canvas.width / 2, yArg = canvas.height / 2) {
        this.x = xArg;
        this.y = yArg;
        this.angle = -Math.PI / 2;
        this.radius = 40;
        this.dx = 0;
        this.dy = 0;
        this.power = 0.01;
        this.maxSpeed = 2;
        this.active = true;
    }

    reset = () => this.init();

    thrust() {
        const ax = Math.cos(this.angle) * this.power;
        const ay = Math.sin(this.angle) * this.power;

        const dx = this.dx + ax;
        const dy = this.dy + ay;

        const newSpeed = Math.sqrt(dx ** 2 + dy ** 2);
        if (newSpeed < this.maxSpeed) {
            this.dx = dx;
            this.dy = dy;
        }


        Ship.boosts.push(new Boost(this.x, this.y, this.angle + Math.PI, 5))

    }

    draw() {
        if (this.active) {
            this.update();

            const nose = {
                x: this.radius,
                y: 0
            }


            const rotatedPoint = this.rotate(nose)
            const leftPoint = this.rotate(nose, this.angle + Math.PI * .75)
            const rightPoint = this.rotate(nose, this.angle - Math.PI * .75)

            canvasUtils.view.beginPath()
            canvasUtils.view.moveTo(this.x + rotatedPoint.x, this.y + rotatedPoint.y)
            canvasUtils.view.lineTo(this.x + leftPoint.x, this.y + leftPoint.y)
            canvasUtils.view.lineTo(this.x, this.y)
            canvasUtils.view.lineTo(this.x + rightPoint.x, this.y + rightPoint.y)
            canvasUtils.view.lineTo(this.x + rotatedPoint.x, this.y + rotatedPoint.y)
            canvasUtils.view.arc(this.x, this.y, this.radius / 2.6, 0, Math.PI * 2)
            canvasUtils.view.fill()
        }
    }

    update() {
        if (this.active) {
            if (Input.Left) this.angle -= 0.015;
            if (Input.Right) this.angle += 0.015;
            if (Input.Thrust) this.thrust();
            if (Input.Fire) this.fire();

            this.x += this.dx;
            this.y += this.dy;

            //Screen wrapping
            if (this.x > canvasUtils.canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvasUtils.canvas.width + this.radius;
            if (this.y > canvasUtils.canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvasUtils.canvas.height + this.radius;
        }
    }

    fire() {
        console.log("Fire!");
        if (Photon.counter < 3) {
            const nose = this.tip;
            Photon.photons.push(new Photon(this.x + nose.x, this.y + nose.y, this.angle));
        }
    }

    rotate(point, a = this.angle) {
        const rx = (point.x * Math.cos(a)) - (point.y * Math.sin(a))
        const ry = (point.x * Math.sin(a)) + (point.y * Math.cos(a))
        return { x: rx, y: ry }
    }

    checkCollisions(bodies) {
        if (!this.active) return
        for (const b of bodies) {
            if (Utils.checkCollision(this, b)) {
                console.log("Collision")
                this.active = false;
                Explosion.explosions.push(new Explosion(this.x, this.y))
            }
        }
    }
}

export default Ship