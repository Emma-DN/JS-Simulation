const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d");
const particleCount = 1;
const baseFrameRate = 60;

window.addEventListener("resize", resizeCanvas);

class Keyboard {
    static keys = {};
    static {
        window.addEventListener("keydown", Keyboard.keyDown);
        window.addEventListener("keyup", Keyboard.keyUp);
    }
    static keyDown(e) {
        if (!e.repeat) Keyboard.keys[e.code] = true;
    }
    static keyUp(e) {
        Keyboard.keys[e.code] = false;
    }
    static keyOnce(key) {
        const down = !!Keyboard.keys[key];
        Keyboard.keys[key] = false;
        return down;
    }
    static get Left() { return !!Keyboard.keys.KeyA }
    static get Right() { return !!Keyboard.keys.KeyD }
    static get Thrust() { return !!Keyboard.keys.KeyW || !!Keyboard.keys.Space }
    static get Fire() { return Keyboard.keyOnce("Enter") }
}

function resizeCanvas() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    setupCanvas();
}

function setupCanvas() {
    view.strokeStyle = "white";
    view.lineWidth = 2;
    view.lineCap = "round";
    view.fillStyle = "white";
}

resizeCanvas()



class Body {
    constructor(r = 80, argX = canvas.width * Math.random(), argY = canvas.height * Math.random()) {
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

    update(deltaTime = 1) {

        if (this.active) {
            if (this.x > canvas.width + this.radius) {
                this.x -= canvas.width + this.diameter
            }

            if (this.x < 0 - this.radius) {
                this.x += canvas.width + this.diameter
            }

            if (this.y > canvas.height + this.radius) {
                this.y -= canvas.height + this.diameter
            }

            if (this.y < 0 - this.radius) {
                this.y += canvas.height + this.diameter
            }

            this.x += this.dx * deltaTime * baseFrameRate;
            this.y += this.dy * deltaTime * baseFrameRate;
        }
    }

    draw() {
        if (this.active) {
            view.beginPath()
            view.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            view.fill()
        }
    }

    stopRendering(arrayRef) {
        bodies.splice(arrayRef, 1)
    }
}

class Ship {

    constructor(xArg = canvas.width / 2, yArg = canvas.height / 2) {
        this.x = xArg
        this.y = yArg
        this.angle = -Math.PI / 2
        this.radius = 40
        this.dx = 0;
        this.dy = 0;
        this.power = 0.01;
        this.maxSpeed = 2;
        this.active = true;
    }

    get tip() {
        const nose = {
            x: this.radius,
            y: 0
        }

        return this.rotate(nose)
    }

    thrust(deltaTime = 1) {
        const ax = Math.cos(this.angle) * this.power * deltaTime * baseFrameRate;
        const ay = Math.sin(this.angle) * this.power * deltaTime * baseFrameRate;

        const dx = this.dx + ax;
        const dy = this.dy + ay;

        const newSpeed = Math.sqrt(dx ** 2 + dy ** 2);
        if (newSpeed < this.maxSpeed) {
            this.dx = dx;
            this.dy = dy;
        }

        explosions.push(new Boost(this.x, this.y, this.angle + Math.PI, 5))

    }

    draw(deltaTime = 1) {
        if (this.active) {
            this.update(deltaTime);

            const nose = {
                x: this.radius,
                y: 0
            }

            const rotatedPoint = this.rotate(nose)
            const leftPoint = this.rotate(nose, this.angle + Math.PI * .75)
            const rightPoint = this.rotate(nose, this.angle - Math.PI * .75)

            view.beginPath()
            view.moveTo(this.x + rotatedPoint.x, this.y + rotatedPoint.y)
            view.lineTo(this.x + leftPoint.x, this.y + leftPoint.y)
            view.lineTo(this.x, this.y)
            view.lineTo(this.x + rightPoint.x, this.y + rightPoint.y)
            view.lineTo(this.x + rotatedPoint.x, this.y + rotatedPoint.y)
            view.arc(this.x, this.y, this.radius / 2.6, 0, Math.PI * 2)
            view.fill()
        }
    }

    update(deltaTime = 1) {
        if (this.active) {
            if (Keyboard.Left) this.angle -= 0.015 * deltaTime * baseFrameRate;
            if (Keyboard.Right) this.angle += 0.015 * deltaTime * baseFrameRate;
            if (Keyboard.Thrust) this.thrust(deltaTime);
            if (Keyboard.Fire) this.fire();

            this.x += this.dx * deltaTime * baseFrameRate;
            this.y += this.dy * deltaTime * baseFrameRate;

            //Screen wrapping
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
        }
    }

    fire() {
        console.log("Fire!");
        if (Photon.counter < 3) {
            const nose = this.tip;
            photons.push(new Photon(this.x + nose.x, this.y + nose.y, this.angle));
        }
    }

    rotate(point, a = this.angle) {
        const rx = (point.x * Math.cos(a)) - (point.y * Math.sin(a))
        const ry = (point.x * Math.sin(a)) + (point.y * Math.cos(a))
        return { x: rx, y: ry }
    }

    checkCollisions(bodies) {
        if (!this.active) return
        for (const body of bodies) {
            if (checkCollision(this, body)) {
                console.log("Collision")
                this.active = false;
                explosions.push(new Explosion(this.x, this.y))
            }
        }
    }
}

class Photon {
    static counter = 0;
    constructor(x, y, angle) {
        Photon.counter += 1
        this.ttl = 600;
        this.radius = 10;
        this.power = 3;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * this.power;
        this.dy = Math.sin(angle) * this.power;
    }

    update(deltaTime = 1) {
        if (this.ttl > 0) {
            this.ttl -= deltaTime * baseFrameRate;
            if (this.ttl <= 0) {
                this.die()
            }
            this.x += this.dx * deltaTime * baseFrameRate;
            this.y += this.dy * deltaTime * baseFrameRate;

            if (this.ttl < 100) this.radius *= Math.pow(0.98, deltaTime * baseFrameRate);

            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
        }

    }

    die() {
        this.ttl = 0
        Photon.counter -= 1
    }

    draw() {
        if (this.ttl > 0) {
            view.beginPath()
            view.arc(this.x, this.y, this.radius / 2.6, 0, Math.PI * 2)
            view.fill()
        }
    }
}

class Explosion {
    constructor(x, y, count = 400) {
        this.particles = []

        for (let i = 0; i < count; i++) {

            this.particles.push(new Particle(x, y))

        }
    }

    update(deltaTime = 1) { for (const p of this.particles) p.update(deltaTime) }

    draw() { for (const p of this.particles) p.draw() }

    cleanup() {
        for (let i = this.particles.length - 1; i >= 0; --i) {
            if (i === this.particles.length - 1 && this.particles[i].ttl === 0) {

                this.particles.pop();
                continue;
            }

            if (this.particles[i].ttl === 0) {
                this.particles[i] = this.particles.pop()
            }

        }

    }
}

class Boost {
    constructor(x, y, angle, count) {
        this.particles = []
        for (let i = 0; i < count; i++) {

            this.particles.push(new BoostParticle(x, y, angle))

        }

    }

    update(deltaTime = 1) { for (const p of this.particles) p.update(deltaTime) }

    draw() { for (const p of this.particles) p.draw() }

    cleanup() {
        for (let i = this.particles.length - 1; i >= 0; --i) {
            if (i === this.particles.length - 1 && this.particles[i].ttl === 0) {
                this.particles.pop();
                continue;
            }

            if (this.particles[i].ttl === 0) {
                this.particles[i] = this.particles.pop()
            }

        }

    }
}

function random(min, max) {
    return Math.random() * (max - min) + min
}

class BoostParticle {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        const maxSpread = 0.5
        this.spread = random(-maxSpread, maxSpread)
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

    update(deltaTime = 1) {
        if (this.ttl > 0) {
            this.x += this.dx * deltaTime * baseFrameRate;
            this.y += this.dy * deltaTime * baseFrameRate;
            this.ttl -= deltaTime * baseFrameRate;
            if (this.ttl < 0) this.ttl = 0;
        }
    }

    draw() {
        if (this.ttl > 0) {
            const oldStyle = view.fillStyle
            view.fillStyle = `rgba(${this.color[0]},${this.color[1]}, ${this.color[2]}, ${this.ttl / this.maxttl})`
            view.fillRect(this.x - this.halfSize, this.y - this.halfSize, this.size, this.size)
            view.fillStyle = oldStyle
        }

    }
}

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

    update(deltaTime = 1) {
        if (this.ttl > 0) {
            this.x += this.dx * deltaTime * baseFrameRate;
            this.y += this.dy * deltaTime * baseFrameRate;
            this.ttl -= deltaTime * baseFrameRate;
            if(this.ttl < 0) this.ttl = 0;
        }

    }

    draw() {

        if (this.ttl > 0) {

            const oldStyle = view.fillStyle
            view.fillStyle = `rgba(${this.color[0]},${this.color[1]}, ${this.color[2]}, ${this.ttl / this.maxttl})`
            view.fillRect(this.x - this.halfSize, this.y - this.halfSize, this.size, this.size)
            view.fillStyle = oldStyle
        }
    }
}

function cleanup() {
    console.log(`Length Before: ${explosions.length}`)
    bodies = bodies.filter(b => b.active)
    photons = photons.filter(p => p.ttl > 0)
    for (const e of explosions) {
        console.log(`Particles Length before: ${e.particles.length}`)
        e.cleanup()
        console.log(`Particles Length after: ${e.particles.length}`)
    }
    explosions = explosions.filter(e => e.particles.length > 0)
    console.log(`Length After: ${explosions.length}`)

}

function checkCollision(b1, b2) {
    return b1.radius + b2.radius > Math.hypot(b1.x - b2.x, b1.y - b2.y)
}

const ship = new Ship()
let photons = [];
let bodies = [];
let explosions = [];

for (let index = 0; index < particleCount; index++) {
    bodies.push(new Body())
}

let counter = 0

let lastTime = performance.now();

function animate(now = performance.now()) {

    let deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    deltaTime = Math.min(deltaTime, 0.05);

    if (++counter % 600 === 0) {
        cleanup()
    }

    view.clearRect(0, 0, canvas.width, canvas.height)

    for (const b of bodies) {
        b.update(deltaTime);
    }

    for (const p of photons) {
        p.update(deltaTime);
    }

    for (const e of explosions){
        e.update(deltaTime);
    }

    ship.checkCollisions(bodies)
    checkBodyCollisions(bodies, photons);

    for (const b of bodies) {
        b.draw();
    }

    for (const p of photons) {
        p.draw();
    }

    for (const e of explosions) {
        e.draw();
    }

    ship.draw(deltaTime);

    requestAnimationFrame(animate)
}

function checkBodyCollisions(bds, photons) {
    for (const b of bds) {
        if (b.active) {
            for (const p of photons) {
                if (p.ttl === 0) continue;
                if (checkCollision(b, p)) {
                    b.active = false;
                    p.die();
                    explosions.push(new Explosion(b.x, b.y));

                    if (b.radius > 40) {
                        bodies.push(new Body(b.radius * 0.75, b.x, b.y));
                        bodies.push(new Body(b.radius * 0.75, b.x, b.y));
                    }
                }
            }
        }
    }
}

animate()