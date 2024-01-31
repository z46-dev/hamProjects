import { canvas, ctx } from "../canvas.js";
const snowflakes = {};
let id = 0;
class Snowflake {
    constructor() {
        this.x = Math.random() * innerWidth;
        this.y = 0;
        this.vx = Math.cos(Math.random() * Math.PI * 2);
        this.vy = Math.random() * 2 + 1;
        this.color = "#EEFEFF";
        this.alpha = Math.random();
        this.size = Math.random() * 5 + 5;
        this.id = id++;
        snowflakes[this.id] = this;
    }
    move() {
        this.x += this.vx * 3;
        this.y += this.vy * 3;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            delete snowflakes[this.id];
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(0, 0, 0, .175)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (Object.keys(snowflakes).length < 50 && Math.random() > .9) {
        new Snowflake();
    }
    for (const id in snowflakes) {
        const snowflake = snowflakes[id];
        snowflake.move();
        snowflake.draw();
    }
}

drawLoop();