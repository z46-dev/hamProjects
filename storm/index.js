import { canvas, ctx, uiScale } from "../canvas.js";

class Lightning {
    static id = 0;
    static lightnings = new Map();
    constructor() {
        this.id = Lightning.id++;

        const scale = uiScale();
        this.sX = canvas.width / scale * Math.random();
        this.sY = 0;
        this.eX = this.sX + Math.random() * 200 - 100;
        this.eY = canvas.height / scale;

        this.step = canvas.height / 15;
        this.accum = 0;

        this.points = [{
            x: this.sX,
            y: this.sY
        }];

        Lightning.lightnings.set(this.id, this);
    }

    update() {
        this.accum += this.step;

        const k = this.accum / this.eY;

        const variance = 75 * Math.sin(k * Math.PI);

        this.points.push({
            x: this.sX + (this.eX - this.sX) * k + Math.random() * variance - variance / 2,
            y: this.accum
        });

        if (Math.random() > .95 && Lightning.lightnings.size < 10) {
            const branch = new Lightning();
            branch.sX = this.sX;
            branch.sY = this.points[this.points.length - 1].y;

            branch.eX = this.eX + Math.random() * 50 - 25;
            branch.eY = this.eY - Math.random() * 50;
        }

        if (this.accum > this.eY) {
            Lightning.lightnings.delete(this.id);
        }
    }

    draw() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
    }
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(25, 25, 50, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = uiScale();

    ctx.save();
    ctx.scale(scale, scale);

    Lightning.lightnings.forEach(lightning => {
        lightning.update();
        lightning.draw();
    });

    ctx.restore();

    if (Lightning.lightnings.size < 1 && Math.random() < .005) {
        new Lightning();
    }
}

drawLoop();