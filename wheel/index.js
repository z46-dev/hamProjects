import { canvas, ctx, lerp, uiScale } from "../canvas.js";

const particles = {};

let angle = Math.random() * Math.PI * 2,
    particleAmount = 20,
    id = 1;

class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 15;
        this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        this.distance = 0;
        this.realDistance = 350;
        this.angle = angle;
        this.id = id++;
        angle += Math.PI * 2 / particleAmount / 1.5;
    }
    move() {
        this.distance = lerp(this.distance, this.realDistance, .1);
        this.angle += .0025 * this.id;
        this.x = Math.cos(this.angle) * this.distance;
        this.y = Math.sin(this.angle) * this.distance;
    }
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.x, -this.y);
        ctx.closePath();
        ctx.lineWidth = Math.sqrt(this.size);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
    }
}
for (let i = 0; i < particleAmount; i++) {
    particles[i] = new Particle();
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(0, 0, 0, .175)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scale = uiScale();
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    for (const id in particles) {
        const particle = particles[id];
        particle.move();
        particle.draw();
    }
    ctx.restore();
}

drawLoop();