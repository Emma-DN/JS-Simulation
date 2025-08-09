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

export default Keyboard