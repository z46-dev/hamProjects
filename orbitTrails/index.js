import { canvas, ctx, lerp, uiScale } from "../canvas.js";

const particleCount = 360;

class Particle {
    static id = 0;
    static hue = 0;

    /**
     * @type {Map<number, Particle>}
     */
    static particles = new Map();

    constructor() {
        this.id = Particle.id ++;

        this.angle = Math.PI * 2 * .75 * this.id / particleCount;
        this.orbit = 25 + Math.random() * 300;

        this.size = 2 + this.orbit / 100 * Math.random();
        this.$speed = .005 + Math.random() * .01;
        this.speed = 0;

        this.color = this.id % 36;
        this.alpha = .5 + Math.random() * .5;

        this.x = Math.cos(this.angle) * Math.max(canvas.width, canvas.height) * 2;
        this.y = Math.sin(this.angle) * Math.max(canvas.width, canvas.height) * 2;

        Particle.particles.set(this.id, this);
    }

    move(centerX, centerY) {
        this.angle += this.speed;
        this.x = lerp(this.x, Math.cos(this.angle) * this.orbit + centerX, .05);
        this.y = lerp(this.y, Math.sin(this.angle) * this.orbit + centerY, .05);
        this.alpha = Math.sin(this.id + performance.now() / 1000) * .5 + .5;
        this.color = (Particle.hue + (.5 * this.id)) % 360;

        this.speed = Math.sin(this.id + performance.now() / 1000) * this.$speed + this.$speed * .5;
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

for (let i = 0; i < particleCount; i++) {
    new Particle();
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = uiScale();
    ctx.save();
    ctx.scale(scale, scale);

    const centerX = canvas.width / 2 / scale;
    const centerY = canvas.height / 2 / scale;

    Particle.particles.forEach(particle => {
        particle.move(centerX, centerY);
        particle.draw();
    });

    ctx.restore();

    Particle.hue = (Particle.hue + (Math.sin(performance.now() / 2500) * .5 + .5)) % 360;
}

drawLoop();

window.Particle = Particle;