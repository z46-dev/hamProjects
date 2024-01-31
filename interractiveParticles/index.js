import { canvas, ctx, lerp } from "../canvas.js";

let interval = null;

const particleCount = 2048;
const xPositions = new Float32Array(particleCount);
const yPositions = new Float32Array(particleCount);
const xVelocities = new Float32Array(particleCount);
const yVelocities = new Float32Array(particleCount);
const tickers = new Uint16Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    xPositions[i] = Math.random() * canvas.width | 0;
    yPositions[i] = Math.random() * canvas.height | 0;
    xVelocities[i] = (Math.random() * 10 | 0) - 5;
    yVelocities[i] = (Math.random() * 10 | 0) - 5;
    tickers[i] = Math.random() * (2 ** 12 - 1) | 0;
}

let mouseX = 0,
    mouseY = 0,
    button = -1;

window.addEventListener("mousedown", function (event) {
    button = event.button;
});

window.addEventListener("mouseup", function (event) {
    button = -1;
});

window.addEventListener("mousemove", function (event) {
    mouseX = event.clientX * window.devicePixelRatio;
    mouseY = event.clientY * window.devicePixelRatio;
});

function main() {
    requestAnimationFrame(main);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < particleCount; i++) {
        const x = xPositions[i] + xVelocities[i];
        const y = yPositions[i] + yVelocities[i];

        if (x < 0) {
            xPositions[i] = 0;
            xVelocities[i] *= -1;
        } else if (x > canvas.width) {
            xPositions[i] = canvas.width;
            xVelocities[i] *= -1;
        } else {
            xPositions[i] = x;
        }

        if (y < 0) {
            yPositions[i] = 0;
            yVelocities[i] *= -1;
        } else if (y > canvas.height) {
            yPositions[i] = canvas.height;
            yVelocities[i] *= -1;
        } else {
            yPositions[i] = y;
        }

        const xx = xPositions[i] | 0;
        const yy = yPositions[i] | 0;

        switch (button) {
            case 0: {
                const angle = Math.atan2(mouseY - yy, mouseX - xx);
                xVelocities[i] = lerp(xVelocities[i], Math.cos(angle) * 5 | 0, .01);
                yVelocities[i] = lerp(yVelocities[i], Math.sin(angle) * 5 | 0, .01);
                tickers[i] = 1;
            } break;
            case 2: {
                const angle = Math.atan2(mouseY - yy, mouseX - xx) + Math.PI;
                xVelocities[i] = lerp(xVelocities[i], Math.cos(angle) * 5 | 0, .01);
                yVelocities[i] = lerp(yVelocities[i], Math.sin(angle) * 5 | 0, .01);
                tickers[i] = 1;
            } break;
            default: {
                tickers[i]--;
                if (tickers[i] === 0) {
                    tickers[i] = Math.random() * (2 ** 12 - 1) | 0;

                    xVelocities[i] = (Math.random() * 10 | 0) - 5;
                    yVelocities[i] = (Math.random() * 10 | 0) - 5;
                }
            } break;
        }

        const index = (yy * canvas.width + xx) * 4;
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

main();