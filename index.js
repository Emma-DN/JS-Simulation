const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d");
const particleCount = 2;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp)

let keys = {};

function keyDown(e) {
    keys[e.code] = true;
}

function keyUp(e) {
    keys[e.code] = false;
}
// if(Keyboard.Left) Left();
class Keyboard {
    static get Left() { return !!keys.KeyA }
    static get Right() { return !!keys.KeyD }
    static get Thrust() { return !!keys.KeyW || !!keys.Space }
}

function resizeCanvas()
{
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    setupCanvas();
};

function setupCanvas(){
    view.strokeStyle = "white";
    view.lineWidth = 2;
    view.lineCap = "round";
    view.fillStyle = "white";
}

resizeCanvas()

const particles = [];

class Particle {
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

        view.fillRect(this.x, this.y, this.radius, 0, 2 * Math.PI);
    }

    stopRendering(arrayRef){
        particles.splice(arrayRef, 1)
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
        this.maxSpeed = 3;
    }

    thrust(){
        const ax = Math.cos(this.angle) * this.power;
        const ay = Math.sin(this.angle) * this.power;

        const dx = this.dx + ax;
        const dy = this.dy + ay;

        const newSpeed = Math.sqrt(dx ** 2 + dy ** 2);
        if(newSpeed < this.maxSpeed)
        {
            this.dx = dx;
            this.dy = dy;
        }

    }

    draw(){

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

    update(){

        if(Keyboard.Left) this.angle -= 0.015;
        if(Keyboard.Right) this.angle += 0.015;
        if(Keyboard.Thrust) this.thrust();

        this.x += this.dx;
        this.y += this.dy;

        //Screen wrapping
        if(this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;


    }

    rotate(point, a = this.angle){
        const rx = (point.x * Math.cos(a)) - (point.y * Math.sin(a))
        const ry = (point.x * Math.sin(a)) + (point.y * Math.cos(a))
        return {x: rx, y: ry}
    }
}





const ship = new Ship()

for (let index = 0; index < particleCount; index++) 
    {
        particles.push(new Particle())
    }

function animate(){
    view.clearRect(0,0,canvas.width, canvas.height)  
    
    for (const p of particles) {
        p.draw();
    }
    ship.draw();

    requestAnimationFrame(animate)
}



animate()