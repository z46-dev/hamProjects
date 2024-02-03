import { canvas, ctx, lerp, uiScale } from "../canvas.js";

class Lightning {
    static id = 0;
    static lightnings = new Map();

    static subSegmentCount = 5;

    static Vector2D = class {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        direction() {
            return Math.atan2(this.y, this.x);
        }
    }

    constructor(sx, sy, ex, ey) {
        this.id = Lightning.id++;

        this.start = new Lightning.Vector2D(sx, sy);
        this.end = new Lightning.Vector2D(ex, ey);

        this.segments = [this.start, this.end];

        for (let i = 0; i < Lightning.subSegmentCount; i++) {
            const segment = new Lightning.Vector2D(
                lerp(this.start.x, this.end.x, (i + 1) / (Lightning.subSegmentCount + 1)),
                lerp(this.start.y, this.end.y, (i + 1) / (Lightning.subSegmentCount + 1))
            );

            this.segments.splice(this.segments.length - 1, 0, segment);
        }

        Lightning.lightnings.set(this.id, this);
    }

    update() {
        const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
        for (let i = 1; i < this.segments.length - 1; i++) {
            const x = lerp(this.start.x, this.end.x, i / (this.segments.length - 1));
            const y = lerp(this.start.y, this.end.y, i / (this.segments.length - 1));

            const variance = Math.sin(i * Math.sin(i + performance.now() / 1000) + performance.now() / 50) * 20;

            this.segments[i].x = x + Math.cos(angle + Math.PI / 2) * variance;
            this.segments[i].y = y + Math.sin(angle + Math.PI / 2) * variance;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        this.segments.forEach(segment => ctx.lineTo(segment.x, segment.y));
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

new Lightning(100, 100, 500, 500);

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(25, 25, 50, .5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = uiScale();

    ctx.save();
    ctx.scale(scale, scale);

    Lightning.lightnings.forEach(lightning => {
        lightning.update();
        lightning.draw();
    });
    
    ctx.restore();
}

drawLoop();