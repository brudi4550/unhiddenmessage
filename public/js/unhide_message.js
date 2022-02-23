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
var mainShapePoints = [];
var mainShapeRadius;
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
    var mainShape = Math.abs(Math.trunc(map(nxtVal(), 0, 255, -0.49, 2.49)));
    switch (mainShape) {
        case 0:
            mainShapeCnv = getBlobShape();
            break;
        case 1:
            mainShapeCnv = getPolygonShape();
            break;
        case 2:
            mainShapeCnv = getArcShape();
            break;
    }
    mainCtx.drawImage(mainShapeCnv, 0, 0);
    var secondaryShape = Math.abs(Math.trunc(map(nxtVal(), 0, 255, -0.49, 2.49)));
    console.log(secondaryShape);
    var secondaryShapeCnv;
    switch (secondaryShape) {
        case 0:
            secondaryShapeCnv = getOrderedCircles();
            break;
        case 1:
            secondaryShapeCnv = getLines();
            break;
        case 2:
            secondaryShapeCnv = getOutwardCircles();
            break;
    }
    mainCtx.drawImage(secondaryShapeCnv, 0, 0);
    windowResized();
}

function getGradientBackground() {
    var cnv = getNewCanvas();
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
    //necessary coeff bc not every hash has a guarenteed value in every order range
    var add = 1;
    while (order.length != gradientBackgrounds.length) {
        var overflowingVal = getOverflowingValue(0, 255, nxtVal(), add);
        add++;
        var elem = Math.round(map(overflowingVal, 0, 255, 0, gradientBackgrounds.length - 1));
        var contained = false;
        for (let i = 0; i < order.length; i++) {
            if (order[i] == elem) {
                contained = true;
            }
        }
        if (!contained) {
            order.push(elem);
        }
    }

    ctx.globalCompositeOperation = 'saturation';
    ctx.filter = 'blur(100px)';
    for (let i = 0; i < order.length; i++) {
        ctx.drawImage(gradientBackgrounds[order[i]], 0, 0);
    }
    ctx.filter = 'blur(30px)';
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(getBackgroundColorBlob(), 0, 0);
    return cnv;
}

function getBackgroundColorBlob() {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    var x = map(nxtVal(), 0, 255, 10, W - 10);
    var y = map(nxtVal(), 0, 255, 10, H - 10);
    var radius = map(nxtVal(), 0, 255, 400, 1000);
    var hue = map(nxtVal(), 0, 255, 0, 360);
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 1`;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
    return cnv;
}

/*
    MAIN SHAPES
*/
function getBlobShape() {
    const num = 1000;
    mainShapeRadius = 150 + nxtVal() / 3;
    const pi2 = Math.PI * 2
    const angle = pi2 / num;
    const factor = 0.4;
    var cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    ctx.fillStyle = 'black';
    for (var i = 0; i < num; i++) {
        var x = Math.cos(angle * i);
        var y = Math.sin(angle * i);
        var noiseVal = noise(x * factor, y * factor);
        n = map(noiseVal, 0, 1, 50, mainShapeRadius);
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

function getPolygonShape() {
    var cnv = getNewCanvas();
    var ctx = cnv.getContext('2d');
    var cx = W / 2;
    var cy = H / 2;
    mainShapeRadius = map(nxtVal(), 0, 255, 40, 200);
    var currAngle = map(nxtVal(), 0, 255, 0, 360);
    var angleSteps = map(nxtVal(), 0, 255, 40, 120);
    var i = 0;
    while (360 % angleSteps != 0) {
        angleSteps = Math.floor(getOverflowingValue(40, 120, map(nxtVal(), 0, 255, 40, 120), i));
        i++;
    }
    var x = startX = cx + mainShapeRadius * Math.cos(currAngle / 180 * Math.PI);
    var y = startY = cy + mainShapeRadius * Math.sin(currAngle / 180 * Math.PI);
    ctx.moveTo(x, y);
    ctx.beginPath();
    mainShapePoints.push(new Point(x, y));
    for (let i = 0; i <= (360 / angleSteps); i++) {
        ctx.lineTo(x, y);
        currAngle = getOverflowingValue(0, 360, currAngle, angleSteps);
        x = cx + mainShapeRadius * Math.cos(currAngle / 180 * Math.PI);
        y = cy + mainShapeRadius * Math.sin(currAngle / 180 * Math.PI);
        mainShapePoints.push(new Point(x, y));
    }
    for (let i = 0; i < mainShapePoints.length; i++) {
        var currX = mainShapePoints[i].x;
        var currY = mainShapePoints[i].y;
        ctx.moveTo(currX, currY);
        var nrOfPoints = map(nxtVal(), 0, 255, 0, mainShapePoints.length);
        for (let j = 0; j < nrOfPoints; j++) {
            var connect = Math.floor(map(nxtVal(), 0, 255, 0, mainShapePoints.length - 1));
            ctx.lineTo(mainShapePoints[connect].x, mainShapePoints[connect].y);
            ctx.moveTo(currX, currY);
        }
    }
    ctx.stroke();
    return cnv;
}

function getArcShape() {
    var cnv = getNewCanvas();
    var ctx = cnv.getContext('2d');
    mainShapeRadius = radius = 150 + nxtVal() / 3;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        let x = W / 2;
        let y = H / 2;
        radius -= map(nxtVal(), 0, 255, 10, 30);
        if (radius > 0) {
            let startAngle = map(nxtVal(), 0, 255, 0, 360);
            let endAngle = map(nxtVal(), 0, 255, 0, startAngle);
            ctx.arc(x, y, radius, startAngle, endAngle, false);
            ctx.stroke();
        }
    }
    const fullPi2 = Math.PI * 2;
    const num = 1000;
    const fullAngle = fullPi2 / num;
    for (let i = 0; i < num; i++) {
        x = W / 2 + mainShapeRadius * Math.cos(fullAngle * i);
        y = H / 2 + mainShapeRadius * Math.sin(fullAngle * i);
        mainShapePoints.push(new Point(x, y));
    }
    return cnv;
}

/*
    SECONDARY SHAPES
*/
function getOrderedCircles() {
    var cnv = getNewCanvas();
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
    redrawMainShapeOverSecondary(cnv);
    return cnv;
}

function getLines() {
    var cnv = getNewCanvas();
    var ctx = cnv.getContext('2d');
    var nrOfLines = map(nxtVal(), 0, 255, 5, 10);
    var nrOfLinesStartingFromLeft = Math.round((W / H) * nrOfLines);
    var nrOfLineStartingFromTop = nrOfLines - nrOfLinesStartingFromLeft;
    for (let i = 0; i < nrOfLinesStartingFromLeft; i++) {
        var startX = -10;
        var startY = map(nxtVal(), 0, 255, 0, H);
        if (map(nxtVal(), 0, 255, 0, 1) < (W / H)) {
            var endX = W + 10;
            var endY = map(nxtVal(), 0, 255, 0, H);
        } else {
            var endX = map(nxtVal(), 0, 255, 0, W);
            var endY = H + 10;
        }
        var cpx1 = map(nxtVal(), 0, 255, 0, W);
        var cpy1 = map(nxtVal(), 0, 255, 0, H);
        var cpx2 = map(nxtVal(), 0, 255, 0, W);
        var cpy2 = map(nxtVal(), 0, 255, 0, H);
        ctx.beginPath();
        ctx.lineWidth = map(nxtVal(), 0, 255, 0.5, 2.5);
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, endX, endY);
        ctx.stroke();
    }

    for (let i = 0; i < nrOfLineStartingFromTop; i++) {
        var startX = map(nxtVal(), 0, 255, 0, W);
        var startY = -10;
        if (map(nxtVal(), 0, 255, 0, 1) < (W / H)) {
            var endX = W + 10;
            var endY = map(nxtVal(), 0, 255, 0, H);
        } else {
            var endX = map(nxtVal(), 0, 255, 0, W);
            var endY = H + 10;
        }
        var cpx1 = map(nxtVal(), 0, 255, 0, W);
        var cpy1 = map(nxtVal(), 0, 255, 0, H);
        var cpx2 = map(nxtVal(), 0, 255, 0, W);
        var cpy2 = map(nxtVal(), 0, 255, 0, H);
        ctx.beginPath();
        ctx.lineWidth = map(nxtVal(), 0, 255, 0.5, 2.5);
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, endX, endY);
        ctx.stroke();
    }
    redrawMainShapeOverSecondary(cnv);
    return cnv;
}

function getOutwardCircles() {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    var currCircleRadius = mainShapeRadius + map(nxtVal(), 0, 255, 20, 100);
    var x = W / 2;
    var y = H / 2;
    const factor = 5;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y, currCircleRadius, currCircleRadius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
        x += noise(x) * factor;
        y += noise(y) * factor;
        currCircleRadius += map(nxtVal(), 0, 255, 10, 50);
    }
    return cnv;
}

function redrawMainShapeOverSecondary(cnv) {
    const helperCnv = getNewCanvas();
    const helperCtx = helperCnv.getContext('2d');
    helperCtx.beginPath();
    helperCtx.moveTo(mainShapePoints[0].x, mainShapePoints[0].y);
    for (let i = 1; i < mainShapePoints.length; i++) {
        helperCtx.lineTo(mainShapePoints[i].x, mainShapePoints[i].y);
    }
    helperCtx.lineTo(mainShapePoints[0].x, mainShapePoints[0].y);
    helperCtx.fill();
    var transparentFactor = map(nxtVal(), 0, 255, 100, 200);
    helperCtx.drawImage(helperCnv, 0 - transparentFactor / 2, 0 - transparentFactor / 2, W + transparentFactor, H + transparentFactor);
    const ctx = cnv.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(helperCnv, 0, 0);
}

function getOverflowingValue(rangeStart, rangeEnd, value, add) {
    var res = value + add;
    if (res > rangeEnd) {
        var diff = res - rangeEnd;
        var res = rangeStart + diff;
    }
    return res;
}

function getNewCanvas() {
    var cnv = document.createElement('canvas');
    cnv.width = W;
    cnv.height = H;
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
    return hash.data;
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
