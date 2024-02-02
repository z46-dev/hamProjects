import { canvas, ctx, lerp } from "../canvas.js";

class Particle {
    static id = 0;
    static particles = new Map();

    constructor() {
        this.id = Particle.id++;

        this.x = Math.random() * canvas.width | 0;
        this.y = Math.random() * canvas.height | 0;
        this.size = 1;

        Particle.particles.set(this.id, this);
    }

    update(gx, gy) {
        this.x = lerp(this.x, gx, .1);
        this.y = lerp(this.y, gy, .1);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

for (let i = 0; i < 2048; i++) new Particle();

function buildLetters(letters) {
    const cvs = new OffscreenCanvas(64 * letters.length, 64);
    const c = cvs.getContext("2d");

    c.font = "bold 32px monospace";
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

const goals = buildLetters("Type something to change!");

window.change = function change(text) {
    const stuff = buildLetters(text);
    goals.width = stuff.width;
    goals.height = stuff.height;
    goals.points = stuff.points;

    if (Particle.particles.size < goals.points.length * 1.5) {}
}

function drawLoop() {
    requestAnimationFrame(drawLoop);

    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let i = 0;
    Particle.particles.forEach(p => {
        if (i >= goals.points.length) {
            const a = Math.PI * 2 * (p.id - goals.points.length) / (Particle.particles.size - goals.points.length) + performance.now() / 1000;
            const variance = Math.sin(performance.now() / 2000 + p.id / 10) * .05 + 1;
            p.update(Math.cos(a) * goals.width / 1.75 * variance, Math.sin(a) * goals.height / .75 * variance);
        } else {
            const goal = goals.points[i % goals.points.length];
            p.update(goal.x - goals.width / 2, goal.y - goals.height / 2);
        }

        p.draw();

        i++;
    });

    ctx.restore();
}

drawLoop();