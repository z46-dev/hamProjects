export default class HardwareConfig {
    static TYPE_UNKNOWN = 0;
    static TYPE_MODEM = 1;
    static TYPE_ROUTER = 2;
    static TYPE_SWITCH = 3;
    static TYPE_FIREWALL = 4;
    static TYPE_WIRELESSAP = 5;
    static TYPE_SERVER = 6;
    static TYPE_WORKSTATION = 7;
    static TYPE_PRINTER = 8;
    static TYPE_STORAGE = 9;
    static TYPE_HUB = 10;
    static TYPE_VOIP_PHONE = 11;
    static TYPE_CAMERA = 12;

    /**
     * @type {Map<string, HardwareConfig>}
     */
    static configs = new Map();

    constructor(name, type = HardwareConfig.TYPE_UNKNOWN) {
        this.name = name;
        this.type = type;
        this.image = undefined;
        this.drawFunction = undefined;

        // Standard Ethernet Ports
        this.ethernet100mbps = 0;
        this.ethernet1gbps = 0;

        // Ethernet Ports with Power Over Ethernet
        this.ethernet100mbpsPOE = 0;
        this.ethernet1gbpsPOE = 0;
        this.ethernet10gbpsPOE = 0;
        this.ethernet40gbpsPOE = 0;

        // Power config
        this.poeSupported = false;

        HardwareConfig.configs.set(name, this);
    }
}

const modem = new HardwareConfig("Modem", HardwareConfig.TYPE_MODEM);
modem.ethernet1gbps = 1;

const router = new HardwareConfig("Router", HardwareConfig.TYPE_ROUTER);
router.ethernet1gbps = 4;
router.ethernet1gbpsPOE = 4;
router.poeSupported = true;

const switch1gbps = new HardwareConfig("1Gbps Switch - 24p", HardwareConfig.TYPE_SWITCH);
switch1gbps.ethernet1gbps = 24;
/**
 * @param {CanvasRenderingContext2D} ctx 
 */
switch1gbps.drawFunction = function(ctx) {
    ctx.fillStyle = "#585B5A";
    ctx.strokeStyle = "#404141";
    ctx.lineWidth = .05;

    // Box
    ctx.beginPath();
    ctx.rect(-1, -.3, 2, .6);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Ports
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(-.7 + i * .55, -.2, .5, .4);
        ctx.strokeStyle = "#AAAAAA";
        ctx.beginPath();
        ctx.moveTo(-.7 + i * .55, 0);
        ctx.lineTo(-.7 + i * .55 + .5, 0);
        ctx.stroke();

        ctx.fillStyle = "#585B5A";
        for (let j = 0; j < 4; j++) {
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, -.15, .075, .075);
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, .075, .075, .075);
        }
    }

    // Lights
    ctx.fillStyle = "#AAEEAA";
    ctx.fillRect(-.9, -.1, .075, .075);
    ctx.fillStyle = "#AAEEAA";
    ctx.fillRect(-.9, .05, .075, .075);
}

const switch1gbpspoe = new HardwareConfig("1Gbps Switch - 24poe", HardwareConfig.TYPE_SWITCH);
switch1gbpspoe.ethernet1gbpsPOE = 24;
/**
 * @param {CanvasRenderingContext2D} ctx 
 */
switch1gbpspoe.drawFunction = function(ctx) {
    ctx.fillStyle = "#585B5A";
    ctx.strokeStyle = "#404141";
    ctx.lineWidth = .05;

    // Box
    ctx.beginPath();
    ctx.rect(-1, -.3, 2, .6);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Ports
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(-.7 + i * .55, -.2, .5, .4);
        ctx.strokeStyle = "#AAAAAA";
        ctx.beginPath();
        ctx.moveTo(-.7 + i * .55, 0);
        ctx.lineTo(-.7 + i * .55 + .5, 0);
        ctx.stroke();

        ctx.fillStyle = "#585B5A";
        for (let j = 0; j < 4; j++) {
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, -.15, .075, .075);
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, .075, .075, .075);
        }
    }

    // Lights
    ctx.fillStyle = "#EEEEAA";
    ctx.fillRect(-.9, -.1, .075, .075);
    ctx.fillStyle = "#EEEEAA";
    ctx.fillRect(-.9, .05, .075, .075);
}

const firewall = new HardwareConfig("1Gbps Switch - 12p, 12poe", HardwareConfig.TYPE_SWITCH);
firewall.ethernet1gbps = 12;
firewall.ethernet1gbpsPOE = 12;
/**
 * @param {CanvasRenderingContext2D} ctx 
 */
firewall.drawFunction = function(ctx) {
    ctx.fillStyle = "#585B5A";
    ctx.strokeStyle = "#404141";
    ctx.lineWidth = .05;

    // Box
    ctx.beginPath();
    ctx.rect(-1, -.3, 2, .6);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Ports
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(-.7 + i * .55, -.2, .5, .4);
        ctx.strokeStyle = "#AAAAAA";
        ctx.beginPath();
        ctx.moveTo(-.7 + i * .55, 0);
        ctx.lineTo(-.7 + i * .55 + .5, 0);
        ctx.stroke();

        ctx.fillStyle = "#585B5A";
        for (let j = 0; j < 4; j++) {
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, -.15, .075, .075);
            ctx.fillRect(-.7 + i * .55 + .075 + .1 * j, .075, .075, .075);
        }
    }

    // Lights
    ctx.fillStyle = "#AAEEAA";
    ctx.fillRect(-.9, -.1, .075, .075);
    ctx.fillStyle = "#EEEEAA";
    ctx.fillRect(-.9, .05, .075, .075);
}

const wirelessAP = new HardwareConfig("Wireless AP", HardwareConfig.TYPE_WIRELESSAP);
wirelessAP.ethernet1gbps = 1;
wirelessAP.poeSupported = true;
/**
 * @param {CanvasRenderingContext2D} ctx 
 */
wirelessAP.drawFunction = function(ctx) {
    ctx.fillStyle = "#585B5A";
    ctx.strokeStyle = "#404141";
    ctx.lineWidth = .05;

    // Box
    ctx.beginPath();
    ctx.roundRect(-.5, -.5, 1, 1, .05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal Box
    ctx.beginPath();
    ctx.roundRect(-.3, -.3, .6, .6, .05);
    ctx.closePath();
    ctx.stroke();
}

const server = new HardwareConfig("Server", HardwareConfig.TYPE_SERVER);
server.ethernet1gbps = 2;
/**
 * @param {CanvasRenderingContext2D} ctx 
 */
server.drawFunction = function(ctx) {
    ctx.fillStyle = "#585B5A";
    ctx.strokeStyle = "#404141";
    ctx.lineWidth = .05;

    // Box
    ctx.beginPath();
    ctx.rect(-.5, -.3, 1, .6);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Lights
    ctx.fillStyle = "#AAEEAA";
    ctx.fillRect(-.45, -.25, .1, .1);
    ctx.fillStyle = "#AAEEAA";
    ctx.fillRect(-.45, -.05, .1, .1);
}