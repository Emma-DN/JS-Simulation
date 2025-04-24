const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d")

const lineRange = 600
const particleCount = 2
const radius = 80


window.addEventListener("resize", resizeCanvas)


function resizeCanvas()
{
    canvas.height = innerHeight
    canvas.width = innerWidth
    applyLineStyle()
};

function applyLineStyle(){
    view.strokeStyle = "white"
    view.lineWidth = 2
    view.lineCap = "round"

    view.fillStyle = "white"

}

function between(x, min, max){
    return x >= min && x <= max
}


resizeCanvas()

const array = new Array()


class Ball {
    radius = 0

    constructor() {
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

    shrink(arrayRef){

        if (this.radius < 1){
            this.stopRendering(arrayRef)
        }
        this.radius = this.radius - 0.05
    }

    draw() {
        this.update()

        view.beginPath()
        view.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        view.fill()
    }

    stopRendering(arrayRef){
        array.splice(arrayRef, 1)
    }
}





for (let index = 0; index < particleCount; index++) {
    const b = new Ball()
    array[index] = b
}

function animate(){

    view.clearRect(0,0,canvas.width, canvas.height)  
    
    for (const ball of array) {
        ball.draw();
    }

    requestAnimationFrame(animate)
}



animate()