import BoostParticle from "../effects/BoostParticle.js"
class Boost {
    constructor(x, y, angle, count) {
        this.particles = []
        for (let i = 0; i < count; i++) {

            this.particles.push(new BoostParticle(x, y, angle))

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

export default Boost