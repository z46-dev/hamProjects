import { canvas, ctx, lerp } from "../canvas.js";

const block = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    speed: 100,
    width: 75,
    height: 45,
    color: `hsl(${Math.random() * 360 | 0}, 50%, 50%)`
};

const angle = Math.PI * 2 * Math.random();
block.vx = Math.cos(angle);
block.vy = Math.sin(angle);

let bg = "#000000";

function drawLoop() {
    requestAnimationFrame(drawLoop);

    ctx.globalAlpha = .2;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    block.x += block.vx * block.speed;
    block.y += block.vy * block.speed;

    let k = 0;
    if (block.x - block.width <= 0 || block.x + block.width >= canvas.width) {
        block.vx *= -1;
        block.color = `hsl(${Math.random() * 360 | 0}, 50%, 50%)`
        k ++;
    }

    if (block.y - block.height <= 0 || block.y + block.height >= canvas.height) {
        block.vy *= -1;
        block.color = `hsl(${Math.random() * 360 | 0}, 50%, 50%)`
        k ++;
    }

    if (k === 2) {
        bg = "#" + (Math.random() * 0xFFFFFF).toString(16).slice(0, 6);
    }

    ctx.fillStyle = block.color;
    ctx.fillRect(block.x - block.width, block.y - block.height, block.width * 2, block.height * 2);
}

drawLoop();