import { canvas, ctx, lerp, uiScale } from "../canvas.js";

class Particle {
    static id = 0;
    static particles = new Map();

    constructor() {
        this.id = Particle.id++;

        const scale = uiScale();

        this.x = Math.random() * canvas.width / scale - canvas.width / scale / 2;
        this.y = Math.random() * canvas.height / scale - canvas.height / scale / 2;

        this.size = 1;

        this.velocityDirection = Math.random() * Math.PI * 2;
        this.velocityLength = Math.random() * 2 + 1;
        this.isIdle = false;

        Particle.particles.set(this.id, this);
    }

    update(gx, gy) {
        this.x = lerp(this.x, gx, .1);
        this.y = lerp(this.y, gy, .1);
    }

    idlyUpdate(gW, gH) {
        this.x += Math.cos(this.velocityDirection) * this.velocityLength;
        this.y += Math.sin(this.velocityDirection) * this.velocityLength;

        this.velocityLength *= .95;

        if (this.velocityLength < .05) {
            this.velocityDirection = Math.random() * Math.PI * 2;
            this.velocityLength = Math.random() * 2 + 1;
        }

        if (this.x < -gW / 2 || this.x > gW / 2 || this.y < -gH / 2 || this.y > gH / 2) {
            this.x = Math.random() * gW - gW / 2;
            this.y = Math.random() * gH - gH / 2;
        }
    }

    draw() {
        if (this.isIdle) {
            ctx.globalAlpha = .5;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 2048; i++) new Particle();

function buildLetters(letters) {
    const cvs = new OffscreenCanvas(64 * letters.length, 64);
    const c = cvs.getContext("2d");

    c.font = "bold 64px monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(letters, cvs.width / 2, 32);

    const data = c.getImageData(0, 0, cvs.width, cvs.height).data;

    const pixels = [];
    const gap = 4;

    let x = 0,
        y = 0,
        xI = Infinity,
        yI = Infinity,
        xM = -Infinity,
        yM = -Infinity;

    for (let i = 0; i < data.length; i += 4 * gap) {
        if (data[i + 3] > 0) {
            pixels.push({
                x: x,
                y: y
            });

            xI = Math.min(xI, x);
            yI = Math.min(yI, y);
            xM = Math.max(xM, x);
            yM = Math.max(yM, y);
        }

        x += gap;

        if (x >= cvs.width) {
            x = 0;
            y += gap;
            i += gap * cvs.width * 4;
        }
    }

    return {
        width: xM - xI,
        height: yM - yI,
        points: pixels.map(({ x, y }) => ({
            x: x - xI,
            y: y - yI
        }))
    };
}

const goals = [];

function change(text) {
    const stuff = buildLetters(text);
    goals.width = stuff.width;
    goals.height = stuff.height;
    goals.points = stuff.points;

    if (Particle.particles.size > goals.points.length + 250) {
        let i = 0;

        for (const p of Particle.particles.values()) {
            if (i >= goals.points.length + 250) {
                Particle.particles.delete(p.id);
            }

            i++;
        }
    }

    if (Particle.particles.size < goals.points.length + 125) {
        for (let i = Particle.particles.size; i < goals.points.length + 250; i++) new Particle();
    }
}

change("Press enter to change the text!");

function drawLoop() {
    requestAnimationFrame(drawLoop);

    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";

    const scale = uiScale();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    let i = 0;
    Particle.particles.forEach(p => {
        if (i >= goals.points.length) {
            p.isIdle = true;
            p.idlyUpdate(canvas.width / scale, canvas.height / scale);
        } else {
            p.isIdle = false;
            const goal = goals.points[i % goals.points.length];
            p.update(goal.x - goals.width / 2, goal.y - goals.height / 2);
        }

        p.draw();

        i++;
    });

    ctx.restore();
}

drawLoop();

window.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        change(prompt("Enter the text to display:"));
    }
});