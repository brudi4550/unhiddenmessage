const hash = getHashInfo();
var mainCanvas;
var mainCtx;
var W;
var H;
var qW;
var qH;
var nrOfGradients = 4;
var minGradientSaturation = 90;
var gradientStartRadius = 300;
var gradientEndRadius = 400;
var mainShapeCnv;
var maxWidth = 500;
var maxHeight = 800;

var currIdx = 0;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function setup() {
    mainCanvas = createCanvas(maxWidth, maxHeight);
    mainCtx = drawingContext;
    mainCanvas.parent('canvas');
    noStroke();
    noLoop();
    noiseSeed(nxtVal() + nxtVal() + nxtVal());
    W = mainCanvas.width;
    H = mainCanvas.height;
    qW = mainCanvas.width / 4;
    qH = mainCanvas.height / 4;
}

function draw() {
    var backgroundCnv = getGradientBackground();
    mainCtx.drawImage(backgroundCnv, 0, 0);
    mainShapeCnv = getBlobMainShape();
    mainCtx.drawImage(mainShapeCnv, 0, 0);
    var secondaryShapeCnv = getCirclesSecondaryShape();
    mainCtx.drawImage(secondaryShapeCnv, 0, 0);
    windowResized();
}

function getGradientBackground() {
    var cnv = document.createElement('canvas');
    cnv.width = W;
    cnv.height = H;
    const ctx = cnv.getContext('2d');

    qW = W / 4;
    qH = H / 4;
    var gradientsOnXAxis = 2;
    var gradientsOnYAxis = 2;
    var gradientBackgrounds = [];

    for (let i = 0; i < gradientsOnXAxis; i++) {
        for (let j = 0; j < gradientsOnYAxis; j++) {
            var singleColorCn = document.createElement('canvas');
            singleColorCn.width = W;
            singleColorCn.height = H;
            const gradientCtx = singleColorCn.getContext('2d');
            var xRegionCenter = qW + (i * W / 2);
            var startX = xRegionCenter + map(nxtVal(), 0, 255, -50, 50);
            var yRegionCenter = qH + (j * H / 2);
            var startY = yRegionCenter + map(nxtVal(), 0, 255, -70, 70);
            var endX = startX + map(nxtVal(), 0, 255, -50, 50);
            var endY = startY + map(nxtVal(), 0, 255, -50, 50);
            var hue = map(nxtVal(), 0, 255, 0, 360);
            var saturation = map(nxtVal(), 0, 255, minGradientSaturation, 100)
            var radgrad = ctx.createRadialGradient(startX, startY, gradientStartRadius, endX, endY, gradientEndRadius);
            radgrad.addColorStop(0, `hsla(${hue}, ${saturation}%, 50%, 1`);
            radgrad.addColorStop(1, 'hsla(0,0%,100%,0)');
            gradientCtx.fillStyle = radgrad;
            gradientCtx.fillRect(0, 0, W, H);
            gradientBackgrounds.push(singleColorCn);
        }
    }

    order = [];
    var i = 0;
    while (order.length != gradientBackgrounds.length) {
        var elem = Math.round(map(nxtVal(), 0, 255, 0, gradientBackgrounds.length - 1));
        var contained = false;
        for (let j = 0; j < order.length; j++) {
            if (order[j] == elem) {
                contained = true;
            }
        }
        if (!contained) {
            order[i] = elem;
            i++;
        }
    }

    ctx.globalCompositeOperation = 'saturation';
    var blur = map(nxtVal(), 0, 255, 50, 150);
    ctx.filter = `blur(${blur}px)`;
    for (let i = 0; i < order.length; i++) {
        ctx.drawImage(gradientBackgrounds[order[i]], 0, 0);
    }

    //single color background to fill gaps
    var singleColorCnv = document.createElement('canvas');
    singleColorCnv.width = W;
    singleColorCnv.height = H;
    const singleColorCtx = singleColorCnv.getContext('2d');
    var hue = map(nxtVal(), 0, 255, 0, 360);
    var saturation = map(nxtVal(), 0, 255, minGradientSaturation, 100)
    singleColorCtx.fillStyle = `hsla(${hue}, ${saturation}%, 50%, 1)`;
    singleColorCtx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(singleColorCnv, 0, 0);

    return cnv;
}

function getBlobMainShape() {
    const [num, radius] = [1000, 150 + nxtVal() / 3]
    const pi2 = Math.PI * 2
    const angle = pi2 / num;
    const factor = 0.4;
    var cnv = document.createElement('canvas');
    cnv.width = W;
    cnv.height = H;
    const ctx = cnv.getContext('2d');
    ctx.fillStyle = 'black';
    mainShapePoints = [];
    for (var i = 0; i < num; i++) {
        var x = Math.cos(angle * i);
        var y = Math.sin(angle * i);
        var noiseVal = noise(x * factor, y * factor);
        n = map(noiseVal, 0, 1, 50, radius);
        p = createVector(x, y).mult(n);
        mainShapePoints.push(new Point(p.x + W / 2, p.y + H / 2));
    }
    ctx.beginPath();
    ctx.moveTo(mainShapePoints[0].x, mainShapePoints[0].y);
    for (var i = 0; i < mainShapePoints.length; i++) {
        var nextIdx = mainShapePoints[i + 1] == undefined ? 0 : i + 1;
        ctx.lineTo(mainShapePoints[nextIdx].x, mainShapePoints[nextIdx].y);
    }
    ctx.fill();
    return cnv;
}

function getCirclesSecondaryShape() {
    var cnv = document.createElement('canvas');
    cnv.width = W;
    cnv.height = H;
    const ctx = cnv.getContext('2d');
    ctx.fillStyle = 'black';
    var xStepDistance = map(nxtVal(), 0, 255, 20, 30);
    var yStepDistance = map(nxtVal(), 0, 255, 20, 30);
    var wantedStartX = map(nxtVal(), 0, 255, 50, W / 2 - 150);
    var endX = W - wantedStartX;
    var wantedXDistance = endX - wantedStartX;
    var wantedStartY = map(nxtVal(), 0, 255, 50, H / 2 - 150);
    var endY = H - wantedStartY;
    var wantedYDistance = endY - wantedStartY;
    var nrOfXSteps = Math.floor(wantedXDistance / xStepDistance);
    var nrOfYSteps = Math.floor(wantedYDistance / yStepDistance);
    var restX = wantedXDistance % xStepDistance;
    var restY = wantedYDistance % yStepDistance;
    var actualStartX = wantedStartX + (restX / 2);
    var actualStartY = wantedStartY + (restY / 2);
    var currX = actualStartX;
    var currY = actualStartY;
    for (let i = 0; i <= nrOfXSteps; i++) {
        for (let j = 0; j <= nrOfYSteps; j++) {
            var radius = map(nxtVal(), 0, 255, 0, 5);
            ctx.beginPath();
            ctx.ellipse(currX, currY, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            currY += yStepDistance;
        }
        currX += xStepDistance;
        currY = actualStartY;
    }
    var helperCnv = document.createElement('canvas');
    helperCnv.width = W;
    helperCnv.height = H;
    const helperCtx = helperCnv.getContext('2d');
    var transparentFactor = map(nxtVal(), 0, 255, 20, 300);
    helperCtx.drawImage(mainShapeCnv, 0 - transparentFactor / 2, 0 - transparentFactor / 2, W + transparentFactor, H + transparentFactor);
    helperCtx.drawImage(helperCnv, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(helperCnv, 0, 0);
    return cnv;
}

function nxtVal() {
    if (hash[currIdx] == undefined) {
        currIdx = 0;
    }
    var elem = hash[currIdx];
    currIdx++;
    return elem;
}

function getHashInfo() {
    var hash = document.getElementById("masterpiece").getAttribute("data-hash");
    hash = JSON.parse(hash);
    return hash.data
}

function downloadMessage() {
    saveCanvas(mainCanvas, 'unhiddenmessage', 'jpg');
}

function windowResized() {
    const container = document.getElementById('canvas');
    const canvas = document.getElementById('defaultCanvas0');
    const currWidth = canvas.style.width.replace("px", "");
    const currHeight = canvas.style.height.replace("px", "");
    const newWidth = container.offsetWidth;
    if (newWidth < maxWidth) {
        const factor = newWidth / currWidth;
        const newHeight = currHeight * factor;
        canvas.style.width = container.offsetWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }
}
