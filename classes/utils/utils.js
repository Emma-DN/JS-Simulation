import Body from "../entities/Body.js"
import Ship from "../entities/Ship.js"
import Photon from "../actions/Photon.js"
import Explosion from "../effects/Explosion.js"
class Utils {
    
    static random(min, max) {
        return Math.random() * (max - min) + min
    }

    static cleanup() {
        Body.bodies = Body.bodies.filter(b => b.active)
        Photon.photons = Photon.photons.filter(p => p.ttl > 0)
        for (const e of Ship.boosts) e.cleanup()
        for (const e of Explosion.explosions) e.cleanup()
        Ship.boosts = Ship.boosts.filter(e => e.particles.length > 0)
        Explosion.explosions = Explosion.explosions.filter(e => e.particles.length > 0)
    }

    static init(){
        for (let index = 0; index < Body.count; index++) {
            Body.bodies.push(new Body())
        }
    }

    static checkCollision(b1, b2) {
        return b1.radius + b2.radius > Math.hypot(b1.x - b2.x, b1.y - b2.y)
    }
}


export default Utils