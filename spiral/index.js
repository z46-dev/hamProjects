import { canvas, ctx, lerp } from "../canvas.js";

const particles = {};
let id = 0,
    orbit = 1,
    orbitStep = .1,
    particleAmount = 128,
    hue = Math.random() * 360;

class Particle {
    constructor() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.orbit = orbit;
        this.distance = 0;
        this.size = 10 - (id / particleAmount) * 5;
        this.alpha = Math.random() * .5 + .5;
        this.color = 0;
        this.angle = Math.PI * 2 / (particleAmount * .25) * id;
        this.id = id++;
        particles[this.id] = this;

        orbit += orbitStep;
    }
    move() {
        this.distance = lerp(this.distance, this.orbit * 17.5, .01);
        this.angle += .01;
        this.x = innerWidth / 2 + Math.cos(this.angle) * this.distance;
        this.y = innerHeight / 2 + Math.sin(this.angle) * this.distance;
        this.color = (hue + (.5 * this.id)) % 360;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
        ctx.fill();
        ctx.restore();
    }
}
for (let i = 0; i < particleAmount; i++) {
    new Particle();
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const id in particles) {
        const particle = particles[id];
        particle.move();
        particle.draw();
    }

    hue = (hue + (Math.sin(performance.now() / 1000) * .5 + .5)) % 360;
}

drawLoop();