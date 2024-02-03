export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true
});

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
}

window.addEventListener("resize", resize);
resize();

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function uiScale() {
    if (canvas.height > canvas.width) {
        return canvas.height / 1080;
    }

    return canvas.width / 1920;
}