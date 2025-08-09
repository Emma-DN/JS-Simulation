import Particle from "./Particle.js"

class Explosion {
    static explosions = [];
    constructor(x, y, count = 400) {
        this.particles = []

        for (let i = 0; i < count; i++) {

            this.particles.push(new Particle(x, y))

        }
    }

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

export default Explosion