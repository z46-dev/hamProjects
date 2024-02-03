import { canvas, ctx, uiScale } from "../canvas.js";
import HardwareConfig from "./lib/HardwareConfig.js";

const imgCache = new Map();

function loadImage(name, src) {
    const img = new Image();
    img.src = src;

    img.onload = () => {
        imgCache.set(name, img);
    }

    return img;
}

HardwareConfig.configs.forEach(config => {
    if (config.image) {
        loadImage(config.name, config.image);
    }
});

class Device {
    static id = 0;
    static devices = new Map();

    constructor(config) {
        this.id = Device.id++;

        /**
         * @type {HardwareConfig}
         */
        this.config = config;

        // Draw data
        this.x = 0;
        this.y = 0;

        // Network data
        this.ports = [];

        for (let i = 0; i < this.config.ethernet100mbps; i++) {
            this.ports.push({
                type: "ethernet",
                speed: 100,
                poe: false,
                link: null
            });
        }

        for (let i = 0; i < this.config.ethernet1gbps; i++) {
            this.ports.push({
                type: "ethernet",
                speed: 1000,
                poe: false,
                link: null
            });
        }

        for (let i = 0; i < this.config.ethernet100mbpsPOE; i++) {
            this.ports.push({
                type: "ethernet",
                speed: 100,
                poe: true,
                link: null
            });
        }

        for (let i = 0; i < this.config.ethernet1gbpsPOE; i++) {
            this.ports.push({
                type: "ethernet",
                speed: 1000,
                poe: true,
                link: null
            });
        }

        Device.devices.set(this.id, this);
    }

    draw() {
        if (this.config.drawFunction) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(100, 100);
            this.config.drawFunction(ctx);
            ctx.restore();
            return;
        }

        if (this.config.image && imgCache.has(this.config.name)) {
            const img = imgCache.get(this.config.name);

            const size = 100;
            const width = img.width / img.height * size;
            const height = img.height / img.width * size;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
            return;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x - 50, this.y - 50, 100, 100);
    }
}

function addDevice(name) {
    const device = HardwareConfig.configs.get(name);

    if (!device) {
        console.error(`Unknown device: ${name}`);
        return;
    }

    new Device(device);
}

window.addDevice = addDevice;
window.Device = Device;
window.HardwareConfig = HardwareConfig;

function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = uiScale();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    Device.devices.forEach(device => {
        device.draw();
    });

    ctx.restore();
}

drawLoop();