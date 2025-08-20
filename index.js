import Ship from "./classes/entities/Ship.js";
import Body from "./classes/entities/Body.js";
import Photon from "./classes/actions/Photon.js";
import Explosion from "./classes/effects/Explosion.js";
import Utils from "./classes/utils/utils.js"
import canvasUtils from "./canvas.js";
import {Input} from "./classes/actions/Input.js"

canvasUtils.canvas = document.getElementById("canvasObject");
const canvas = canvasUtils.canvas
canvasUtils.view = canvas.getContext("2d");
const view = canvasUtils.view

window.addEventListener("resize", () => canvasUtils.resizeCanvas());

canvasUtils.resizeCanvas()


const ship = new Ship(canvas.width / 2, canvas.height / 2)

let counter = 0

const targetFPS = 60;
const threshold = 1000 / targetFPS; // 1 second / 60fps = 16.67ms threshold
let lastFrameTime = performance.now();
let lastSecondTime = performance.now();
let fps = 0;
let fpsCounter = 0;

Utils.init();

function animate(currentTime = performance.now()) {
    if(Input.Reset) console.log("Reset");

    // if (currentTime - lastFrameTime < threshold) {
    //     requestAnimationFrame(animate);
    //     return;
    // }
    lastFrameTime = currentTime;

    if (performance.now() - lastSecondTime > 1000) {
        fps = fpsCounter;
        lastSecondTime = performance.now();
        fpsCounter = 0;
    }

    ++fpsCounter;


    if (++counter % 600 === 0) {
        Utils.cleanup()
    }

    view.clearRect(0, 0, canvas.width, canvas.height)

    view.font = "20px Arial";
    view.fillStyle = "white";
    view.fillText(`FPS: ${fps}`, 4, 20);

    for (const b of Body.bodies) {
        b.update();
    }

    for (const p of Photon.photons) {
        p.update();
    }

    ship.checkCollisions(Body.bodies)
    checkBodyCollisions(Body.bodies, Photon.photons);

    for (const b of Body.bodies) {
        b.draw();
    }

    for (const p of Photon.photons) {
        p.draw();
    }

    for (const e of Ship.boosts) {
        e.draw();
    }
    for (const e of Explosion.explosions) {
        e.draw();
    }

    ship.draw();

    requestAnimationFrame(animate)
}

function checkBodyCollisions(bds, photons) {
    for (const b of bds) {
        if (b.active) {
            for (const p of photons) {
                if (p.ttl === 0) continue;
                if (Utils.checkCollision(b, p)) {
                    b.active = false;
                    p.die();
                    Explosion.explosions.push(new Explosion(b.x, b.y));

                    if (b.radius > 40) {
                        Body.bodies.push(new Body(b.radius * 0.75, b.x, b.y));
                        Body.bodies.push(new Body(b.radius * 0.75, b.x, b.y));
                    }
                }
            }
        }
    }
}

animate()
