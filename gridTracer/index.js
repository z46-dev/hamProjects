import { canvas, ctx, lerp } from "../canvas.js";

// Hexagon grid
const gridWidth = 32;
const gridHeight = 32;
const hexSize = 16;

function drawHex(x, y) {
    const drawX = canvas.width / 2 + (x - gridWidth / 2) * hexSize * 1.5;
    const drawY = canvas.height / 2 + (y - gridHeight / 2) * hexSize * Math.sqrt(3) + (x % 2 ? hexSize : 0);

    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i;
        const x = drawX + hexSize * Math.cos(angle);
        const y = drawY + hexSize * Math.sin(angle);
        ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.stroke();
}

const lines = new Set();

// To trace a path
class Line {
    static directions = [
        [1, 0],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [0, -1],
        [1, -1]
    ];

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.t = 0;

        this.beginPoint = Math.random() * Line.directions.length | 0;
        this.endPoint = this.beginPoint + (Math.random() > .5 ? 1 : -1);
    }

    translate(x, y) {
        return {
            x: canvas.width / 2 + (x - gridWidth / 2) * hexSize * 1.5,
            y: canvas.height / 2 + (y - gridHeight / 2) * hexSize * Math.sqrt(3) + (x % 2 ? hexSize : 0)
        };
    }

    sideOf(point, i) {
        const angle = Math.PI / 3 * i;
        return {
            x: point.x + Math.cos(angle) * hexSize,
            y: point.y + Math.sin(angle) * hexSize
        };
    }

    draw() {
        // Begin Point and End Point are lines on the hexagon, trace over it
        const begin = this.sideOf(this.translate(this.x, this.y), this.beginPoint);
        const end = this.sideOf(this.translate(this.x, this.y), this.endPoint);

        const x = lerp(begin.x, end.x, Math.min(1, this.t));
        const y = lerp(begin.y, end.y, Math.min(1, this.t));

        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    move() {
        this.t += .025;
        if (this.t > 1 && !this.moved) {
            this.moved = true;

            let x = this.x,
                y = this.y;

                let newBeginPoint = (this.endPoint + 3) % 6; // Set to the opposite side

                switch (this.endPoint) {
                    case 0:
                        x++;
                        break;
                    case 1:
                        y++;
                        break;
                    case 2:
                        x--;
                        y++;
                        break;
                    case 3:
                        x--;
                        break;
                    case 4:
                        y--;
                        break;
                    case 5:
                        x++;
                        y--;
                        break;
                }
            
                const newLine = new Line(x, y);
                newLine.beginPoint = newBeginPoint;
                newLine.endPoint = newLine.beginPoint + (Math.random() > 0.5 ? 1 : -1);

            lines.add(newLine);
        } else if (this.t > 5) {
            lines.delete(this);
        }
    }
}

for (let i = 0; i < 125; i++) {
    const x = Math.random() * gridWidth | 0;
    const y = Math.random() * gridHeight | 0;

    lines.add(new Line(x, y));
}

function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    lines.forEach(line => {
        line.draw();
        line.move();
    });
}

draw();