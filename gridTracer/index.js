import { canvas, ctx, lerp } from "../canvas.js";

// Hexagon grid
const gridWidth = 16;
const gridHeight = 16;
const hexSize = 16;

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
        this.k = 3 + Math.random() * 12 | 0;

        this.beginPoint = Math.random() * Line.directions.length | 0;
        this.endPoint = this.beginPoint + (Math.random() > .5 ? 1 : -1);

        if (this.endPoint > 5) {
            this.endPoint = 0;
        }

        if (this.endPoint < 0) {
            this.endPoint = 5;
        }
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

    // f it this is too annoying let's do math
    findNextStartSide(newX, newY) {
        const us = this.sideOf(this.translate(this.x, this.y), this.endPoint);
        const them = this.translate(newX, newY);

        let index = -1,
            d = Infinity;

        for (let i = 0; i < 6; i ++) {
            const that = this.sideOf(them, i);

            const xDiff = that.x - us.x;
            const yDiff = that.y - us.y;

            const dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

            if (dist < d) {
                d = dist;
                index = i;
            }
        }

        return index;
    }

    draw() {
        // Begin Point and End Point are lines on the hexagon, trace over it
        const begin = this.sideOf(this.translate(this.x, this.y), this.beginPoint);
        const end = this.sideOf(this.translate(this.x, this.y), this.endPoint);

        const x = lerp(begin.x, end.x, Math.min(1, this.t));
        const y = lerp(begin.y, end.y, Math.min(1, this.t));

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    move() {
        this.t += .0334;
        if (this.t > 1 && !this.moved) {
            lines.delete(this);
            if (this.k === 0) {
                return;
            }

            this.moved = true;

            let x = this.x,
                y = this.y;

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

            const newBeginPoint = this.findNextStartSide(x, y);

            const newLine = new Line(x, y);
            newLine.beginPoint = newBeginPoint;
            newLine.endPoint = newBeginPoint + (Math.random() > .5 ? 1 : -1);

            if (newLine.endPoint > 5) {
                newLine.endPoint = 0;
            }
    
            if (newLine.endPoint < 0) {
                newLine.endPoint = 5;
            }

            newLine.k = this.k - 1;

            lines.add(newLine);
        }
    }
}

function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "rgba(0, 0, 0, .025)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    lines.forEach(line => {
        line.draw();
        line.move();
    });

    if (lines.size < 300 && Math.random() > .25) {
        const x = ((Math.random() * gridWidth / 2) | 0) + Math.round(gridWidth / 4);
        const y = ((Math.random() * gridHeight / 2) | 0) + Math.round(gridHeight / 4);

        lines.add(new Line(x, y));
    }
}

draw();