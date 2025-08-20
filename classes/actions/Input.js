import Keyboard from "./Keyboard.js";

export class Input extends Keyboard {
    static get Left() { return !!Keyboard.keys.KeyA }
    static get Right() { return !!Keyboard.keys.KeyD }
    static get Thrust() { return !!Keyboard.keys.KeyW || !!Keyboard.keys.Space }
    static get Fire() { return Keyboard.keyOnce("Enter") }
    static get Reset() { return Keyboard.keyOnce("KeyR") }
}