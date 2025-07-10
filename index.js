const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d");
const particleCount = 1;

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
    constructor(r = 80) {
        const maxSpeed = 4

        this.x = canvas.width * Math.random()
        this.y = canvas.height * Math.random()

        this.dx = (maxSpeed * Math.random()) - (maxSpeed / 2)
        this.dy = (maxSpeed * Math.random()) - (maxSpeed / 2)

        this.radius = r
    }

    get diameter() {
        return this.radius * 2
    }

    update() {

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

        this.x += this.dx
        this.y += this.dy
    }

    draw() {
        this.update()

        //view.fillRect(this.x, this.y, this.radius, 0, 2 * Math.PI);
        view.beginPath()
        view.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        view.fill()
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

        
        explosions.push(new Boost(this.x, this.y, this.angle + Math.PI, 5))

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

    update() {
        if (this.active) {
            if (Keyboard.Left) this.angle -= 0.015;
            if (Keyboard.Right) this.angle += 0.015;
            if (Keyboard.Thrust) this.thrust();
            if (Keyboard.Fire) this.fire();

            this.x += this.dx;
            this.y += this.dy;

            //Screen wrapping
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
        }
    }

    fire() {
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
        this.ttl = 600; // changes based on monitor
        this.radius = 10;
        this.power = 3;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * this.power;
        this.dy = Math.sin(angle) * this.power;
    }

    update() {
        if (this.ttl > 0) {
            this.ttl -= 1;
            if (this.ttl === 0) {
                Photon.counter -= 1
                photons.shift()
            }
            this.x += this.dx;
            this.y += this.dy;

            if (this.ttl < 100) this.radius *= 0.98;

            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
        }

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
        this.ttl = 1000
        this.particles = []

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y))
        }

    }

    draw() { 
        for (const p of this.particles) {
            if (p.ttl == 0){
                this.particles.pop()
                continue
            }
            this.ttl --
            p.draw() 
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

    draw() { for (const p of this.particles ) 
        {
            if (p.ttl == 0){
                this.particles.pop()
                continue
            }
            p.draw()
        }
     }
}

function random(min, max){
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

    draw() {
        if (this.ttl > 0) {
            this.x += this.dx
            this.y += this.dy
            const oldStyle = view.fillStyle

            view.fillStyle = `rgba(${this.color[0]},${this.color[1]}, ${this.color[2]}, ${this.ttl / this.maxttl})`
            view.fillRect(this.x - this.halfSize, this.y - this.halfSize, this.size, this.size)
            view.fillStyle = oldStyle
            this.ttl -= 1;
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

    draw() {

        if (this.ttl > 0) {
            this.x += this.dx
            this.y += this.dy
            const oldStyle = view.fillStyle

            view.fillStyle = `rgba(${this.color[0]},${this.color[1]}, ${this.color[2]}, ${this.ttl / this.maxttl})`
            view.fillRect(this.x - this.halfSize, this.y - this.halfSize, this.size, this.size)
            view.fillStyle = oldStyle
            this.ttl -= 1;
        }
    }
}

function checkCollision(b1, b2) {
    return b1.radius + b2.radius > Math.hypot(b1.x - b2.x, b1.y - b2.y)
}

const ship = new Ship()
const photons = [];
const bodies = [];
const explosions = [];

for (let index = 0; index < particleCount; index++) {
    bodies.push(new Body())
}

function animate() {
    view.clearRect(0, 0, canvas.width, canvas.height)

    ship.checkCollisions(bodies)


    for (const b of bodies) {
        b.draw();
    }

    for (const p of photons) {
        p.update();
        p.draw();
    }
    console.log(`Photons Size: ${photons.length}`)


    let explosionsIterator = 0
    for (const e of explosions) {
        
        if (explosions[explosionsIterator].particles.length == 0){
            explosions.splice(explosionsIterator, 1)
        }
        e.draw();
        explosionsIterator++
    }
    console.log(`Explosions Size: ${explosions.length}`)
    ship.draw();

    requestAnimationFrame(animate)
}

// Drawing Explosions
animate()