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

}

export default Keyboard