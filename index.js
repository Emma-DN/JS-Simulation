const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d")

const particleCount = 2


window.addEventListener("resize", resizeCanvas)


function resizeCanvas()
{
    canvas.height = innerHeight
    canvas.width = innerWidth
    setupCanvas()
};

function setupCanvas(){
    view.strokeStyle = "white"
    view.lineWidth = 2
    view.lineCap = "round"

    view.fillStyle = "white"

}

resizeCanvas()

const particles = [];


class Particle {

    constructor(radius=80) {
        const maxSpeed = 4;

        this.x = canvas.width * Math.random()
        this.y = canvas.height * Math.random()

        this.dx = (maxSpeed * Math.random()) - (maxSpeed / 2)
        this.dy = (maxSpeed * Math.random()) - (maxSpeed / 2)
        
        this.radius = radius
    }

    get diameter() {
        return this.radius * 2;
    }

    update() {

        if (this.x > canvas.width + this.radius) {
            this.x -= canvas.width + this.diameter;
        }

        if (this.x < 0 - this.radius) {
            this.x += canvas.width + this.diameter;
        }

        if (this.y > canvas.height + this.radius) {
            this.y -= canvas.height + this.diameter;
        }

        if (this.y < 0 - this.radius) {
            this.y += canvas.height + this.diameter;
        }

        this.x += this.dx
        this.y += this.dy
    }

    draw() {
        this.update()

        view.beginPath()
        view.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        view.fill()
    }

    stopRendering(arrayRef){
        particles.splice(arrayRef, 1)
    }
}

class Ship {
    constructor(x = canvas.width / 2, y = canvas.height / 2){
        this.x = x;
        this.y = y;
    }

    draw()  {

        //view.beginPath();
        view.fillRect(this.x, this.y, 4, 4);
        //view.fill();


    }
    


}


for (let index = 0; index < particleCount; index++) particles.push(new Particle());
const ship = new Ship();
function animate(){

    view.clearRect(0,0,canvas.width, canvas.height)  
    
    for (const p of particles) {
        p.draw();
    }
    ship.draw();

    requestAnimationFrame(animate)
}



animate()