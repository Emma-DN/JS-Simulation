

class canvasUtils {
    static canvas;
    static view;
    static resizeCanvas() {
        this.canvas.height = innerHeight;
        this.canvas.width = innerWidth;
        this.setupCanvas();
    }

    static setupCanvas() {
        this.view.strokeStyle = "white";
        this.view.lineWidth = 2;
        this.view.lineCap = "round";
        this.view.fillStyle = "white";
    }
}

export default canvasUtils