import { canvas, ctx, lerp, uiScale } from "../canvas.js";

class Particle {
    static id = 0;
    static particles = new Map();

    static gravity = .05;

    constructor(x, y, size) {
        this.id = Particle.id++;

        this.x = x;
        this.y = y;

        this.size = size;

        this.velocityX = 0;
        this.velocityY = 0;
        this.antiGravity = 0;

        this.hue = Math.random() * 360;
        this.fade = 1;

        Particle.particles.set(this.id, this);
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.fade -= .005 * (Math.sin(this.antiGravity * Math.PI * 2) * .5 + .5);

        this.velocityY += Particle.gravity - this.antiGravity;

        if (this.y > canvas.height || this.fade < .01) {
            Particle.particles.delete(this.id);
        }
    }

    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.globalAlpha = this.fade;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Firework {
    static id = 0;
    static fireworks = new Map();

    constructor() {
        this.id = Firework.id++;

        const scale = uiScale();

        this.x = Math.random() * canvas.width / scale;
        this.y = canvas.height / scale;

        this.size = 3 + Math.random() * 4;

        this.velocityDirection = Math.random() * Math.PI * .5 + Math.PI * .25 + Math.PI;
        this.velocityLength = Math.random() * 10 + 30;

        this.hue = Math.random() * 360;

        Firework.fireworks.set(this.id, this);
    }

    update() {
        this.x += Math.cos(this.velocityDirection) * this.velocityLength;
        this.y += Math.sin(this.velocityDirection) * this.velocityLength;

        this.velocityLength *= .95;

        if (this.velocityLength < .05) {
            Firework.fireworks.delete(this.id);

            switch (Math.random() * 3 | 0) {
                case 0:
                    Firework.basicExplosion(this);
                    break;
                case 1:
                    Firework.ringExplosion(this);
                    break;
                case 2:
                    Firework.delayedExplosion(this);
                    break;
            }
        }
    }

    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * @param {Firework} firework 
     */
    static basicExplosion(firework) {
        for (let i = 0; i < 8 + Math.random() * 32 | 0; i++) {
            const particle = new Particle(firework.x, firework.y, firework.size / 2);
            particle.velocityX = Math.random() * 6 - 3;
            particle.velocityY = Math.random() * 6 - 3;
            particle.hue = firework.hue + Math.random() * 30 - 15;
            particle.antiGravity = Math.random() * .03;
        }
    }

    /**
     * @param {Firework} firework 
     */
    static ringExplosion(firework) {
        let hue = firework.hue + Math.random() * 30 - 15;

        for (let i = 0; i < 1 + Math.random() * 3 | 0; i++) {
            const ringWidth = Math.random() * 2 + .5;
            const ringHeight = Math.random() * 2 + .5;
            const ringAngle = Math.random() * Math.PI * 2;
            const ringCount = 8 + Math.random() * 16 | 0;

            for (let j = 0; j < ringCount; j++) {
                const particle = new Particle(firework.x, firework.y, firework.size / 2);
                particle.velocityX = Math.cos(ringAngle + j / ringCount * Math.PI * 2) * ringWidth;
                particle.velocityY = Math.sin(ringAngle + j / ringCount * Math.PI * 2) * ringHeight;
                particle.hue = hue + Math.random() * 30 - 15;
                particle.antiGravity = Particle.gravity * .99;
            }

            hue += 30;
        }
    }

    /**
     * @param {Firework} firework 
     */
    static delayedExplosion(firework) {
        const count = 8 + Math.random() * 16 | 0;
        const delay = 20 + Math.random() * 31 | 0;

        let hue = firework.hue + Math.random() * 30 - 15;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = new Particle(firework.x, firework.y, firework.size / 2);
                const angle = Math.PI * 2 / count * i;

                particle.velocityX = Math.cos(angle) * 3;
                particle.velocityY = Math.sin(angle) * 3;

                particle.hue = hue;

                hue += Math.random() * 10;
            }, i * delay);
        }
    }
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = uiScale();

    ctx.save();
    ctx.scale(scale, scale);

    Firework.fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    Particle.particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    ctx.restore();

    if (Firework.fireworks.size < 8 && Math.random() < .1) {
        new Firework();
    }
}

drawLoop();