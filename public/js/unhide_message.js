const hash = getHashInfo();
const H = getHeightSetting();
const W = getWidthSetting();
const qH = H / 4;
const qW = W / 4;

var mainCanvas;
var mainCtx;
var mainShapePoints = [];
var mainShapeRadius;

var currIdx = 0;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function setup() {
    mainCanvas = createCanvas(W, H);
    mainCtx = drawingContext;
    mainCanvas.parent('canvas');
    noStroke();
    noLoop();
    noiseSeed(nxtVal() + nxtVal() + nxtVal());
}

function draw() {
    var backgroundCnv = getGradientBackground();
    mainCtx.drawImage(backgroundCnv, 0, 0);
    var mainShape = map(nxtVal(), 0, 255, 0, 3);
    if (mainShape < 1) {
            mainShapeCnv = getBlobShape();
    } else if (mainShape < 2) {
            mainShapeCnv = getPolygonShape();
    } else {
            mainShapeCnv = getArcShape();
    }
    mainCtx.drawImage(mainShapeCnv, 0, 0);
    //redo secondaryShape selection like above, dont use switch case
    var secondaryShape = Math.abs(Math.trunc(map(nxtVal(), 0, 255, -0.49, 3.49)));
    var secondaryShapeCnv;
    secondaryShape = 0;
    switch (secondaryShape) {
        case 0:
            secondaryShapeCnv = getOrderedCircles();
            break;
        case 1:
            secondaryShapeCnv = getLetters();
            break;
        case 2:
            secondaryShapeCnv = getOutwardCircles();
            break;
        case 3:
            secondaryShapeCnv = getHearts();
            break;
    }
    mainCtx.drawImage(secondaryShapeCnv, 0, 0);
    windowResized();
}

function getGradientBackground() {
    var cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');

    var gradientsOnXAxis = 2;
    var gradientsOnYAxis = 2;
    var gradientBackgrounds = [];
    var hue = map(nxtVal(), 0, 255, 0, 360);
    var colorScheme = map(nxtVal(), 0, 255, 0, 1);

    for (let i = 0; i < gradientsOnXAxis; i++) {
        for (let j = 0; j < gradientsOnYAxis; j++) {
            var singleColorCn = getNewCanvas();
            const gradientCtx = singleColorCn.getContext('2d');
            var xRegionCenter = qW + (i * W / 2);
            var startX = xRegionCenter + map(nxtVal(), 0, 255, -(W * 0.2), W * 0.2);
            var yRegionCenter = qH + (j * H / 2);
            var startY = yRegionCenter + map(nxtVal(), 0, 255, -(H * 0.2), H * 0.2);
            var endX = startX + map(nxtVal(), 0, 255, -(W * 0.2), W * 0.2);
            var endY = startY + map(nxtVal(), 0, 255, -(H * 0.2), H * 0.2);
            var gradientStartRadius = W / 2;
            var gradientEndRadius = W;
            var radgrad = ctx.createRadialGradient(startX, startY, gradientStartRadius, endX, endY, gradientEndRadius);
            var lightness = map(nxtVal(), 0, 255, 30, 70);
            radgrad.addColorStop(0, `hsla(${hue}, 100%, ${lightness}%, 1`);
            radgrad.addColorStop(1, 'hsla(0,0%,100%,0)');
            if (colorScheme > 0.5) {
                //analog
                hue += 30;
            } else {
                //triadic
                hue += 120;
            }
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
    ctx.drawImage(getBackgroundColorBlob(hue), 0, 0);
    return cnv;
}

function getBackgroundColorBlob(lastHue) {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    var x = map(nxtVal(), 0, 255, 10, W - 10);
    var y = map(nxtVal(), 0, 255, 10, H - 10);
    var radius = map(nxtVal(), 0, 255, 400, 1000);
    ctx.fillStyle = `hsla(${lastHue}, 100%, 50%, 1`;
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
    mainShapeRadius = W * 0.25 + nxtVal() / 3;
    const pi2 = Math.PI * 2;
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
    mainShapeRadius = map(nxtVal(), 0, 255, W * 0.2, W * 0.4);
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
        var nrOfPoints = map(nxtVal(), 0, 255, 0, mainShapePoints.length / 2);
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
    mainShapeRadius = radius = W * 0.25 + nxtVal() / 3;
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
    var xStepDistance = map(nxtVal(), 0, 255, W * 0.04, W * 0.06);
    var yStepDistance = map(nxtVal(), 0, 255, W * 0.04, W * 0.06);
    var wantedStartX = map(nxtVal(), 0, 255, W * 0.1, W / 2 - W * 0.25);
    var endX = W - wantedStartX;
    var wantedXDistance = endX - wantedStartX;
    var wantedStartY = map(nxtVal(), 0, 255, W * 0.1, H / 2 - W * 0.25);
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
            var radius = map(nxtVal(), 0, 255, 0, W * 0.01);
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

function getLetters() {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    var columns = 10;
    var rows = 20;
    var wordInUpper = nxtVal() % 2 == 0;
    var wordRow;
    if (wordInUpper) {
        var wordRow = Math.round(map(nxtVal(), 0, 255, 0, 3));
    } else {
        var wordRow = Math.round(map(nxtVal(), 0, 255, rows - 4 - 3, rows - 4));
    }
    var word = getWord();
    var wordColumnStart = Math.floor(map(nxtVal(), 0, 255, 0, columns - 2 - word.length));
    var wordColumnEnd = wordColumnStart + word.length;
    var boxWidth = W / columns;
    var boxHeight = H / rows;
    var k = 0;
    for (let i = 0; i <= columns - 4; i++) {
        for (let j = 0; j <= rows - 4; j++) {
            var fontSize = Math.floor(boxWidth * boxHeight / 60);
            ctx.font = `${fontSize}px \'Press Start 2P\', cursive`;
            var x = boxWidth * (i + 2);
            var y = boxHeight * (j + 2);
            var n = map(nxtVal(), 0, 255, 0, 25);
            var chr = String.fromCharCode(65 + n);
            if (j == wordRow && i >= wordColumnStart && i < wordColumnEnd) {
                chr = word.charAt(k)
                k++;
            }
            ctx.fillText(chr, x, y);
        }
    }
    redrawMainShapeOverSecondary(cnv);
    return cnv;
}

function getOutwardCircles() {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    var currCircleRadius = mainShapeRadius + map(nxtVal(), 0, 255, 10, 20);
    var cx = W / 2;
    var cy = H / 2;
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, currCircleRadius, currCircleRadius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        var angle = map(nxtVal(), 0, 255, 0, 360);
        var xStart = cx + currCircleRadius * Math.cos(angle * (Math.PI / 180));
        var yStart = cy + currCircleRadius * Math.sin(angle * (Math.PI / 180));
        var endCircleRadius = currCircleRadius + 500;
        var xEnd = cx + endCircleRadius * Math.cos(angle * (Math.PI / 180));
        var yEnd = cy + endCircleRadius * Math.sin(angle * (Math.PI / 180));
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
        currCircleRadius += map(nxtVal(), 0, 255, 10, 50);
    }
    return cnv;
}

function getHearts() {
    const cnv = getNewCanvas();
    const ctx = cnv.getContext('2d');
    var startCircleRadius = mainShapeRadius + map(nxtVal(), 0, 255, 10, 20);
    var endCircleRadius = startCircleRadius + map(nxtVal(), 0, 255, 20, 40);
    var angleSteps = map(nxtVal(), 0, 255, 20, 120);
    var i = 0;
    while (360 % angleSteps != 0) {
        angleSteps = Math.floor(getOverflowingValue(20, 120, map(nxtVal(), 0, 255, 20, 120), i));
        i++;
    }
    var currAngle = map(nxtVal(), 0, 255, 0, 360);
    for (let i = 0; i < 5; i++) {
        var angleSum = 0;
        var controlPointRadius = (endCircleRadius - startCircleRadius) * 1.5;
        currAngle = getOverflowingValue(0, 360, currAngle, 10);
        while (angleSum <= 360) {
            var xStart = W / 2 + startCircleRadius * Math.cos(currAngle * (Math.PI / 180));
            var yStart = H / 2 + startCircleRadius * Math.sin(currAngle * (Math.PI / 180));
            var xEnd = W / 2 + endCircleRadius * Math.cos(currAngle * (Math.PI / 180));
            var yEnd = H / 2 + endCircleRadius * Math.sin(currAngle * (Math.PI / 180));
            var controlPoint11Angle = getOverflowingValue(0, 360, currAngle, -50);
            var controlPoint12Angle = getOverflowingValue(0, 360, currAngle, -20);
            var xCp1 = xStart + controlPointRadius * Math.cos(controlPoint11Angle * (Math.PI / 180));
            var yCp1 = yStart + controlPointRadius * Math.sin(controlPoint11Angle * (Math.PI / 180));
            var xCp2 = xStart + controlPointRadius * Math.cos(controlPoint12Angle * (Math.PI / 180));
            var yCp2 = yStart + controlPointRadius * Math.sin(controlPoint12Angle * (Math.PI / 180));
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.bezierCurveTo(xCp1, yCp1, xCp2, yCp2, xEnd, yEnd);
            var controlPoint21Angle = getOverflowingValue(0, 360, currAngle, 50);
            var controlPoint22Angle = getOverflowingValue(0, 360, currAngle, 20);
            var xCp1 = xStart + controlPointRadius * Math.cos(controlPoint21Angle * (Math.PI / 180));
            var yCp1 = yStart + controlPointRadius * Math.sin(controlPoint21Angle * (Math.PI / 180));
            var xCp2 = xStart + controlPointRadius * Math.cos(controlPoint22Angle * (Math.PI / 180));
            var yCp2 = yStart + controlPointRadius * Math.sin(controlPoint22Angle * (Math.PI / 180));
            ctx.moveTo(xStart, yStart);
            ctx.bezierCurveTo(xCp1, yCp1, xCp2, yCp2, xEnd, yEnd);
            if (nxtVal() % 2 == 0) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            currAngle = getOverflowingValue(0, 360, currAngle, angleSteps);
            angleSum += angleSteps;
        }
        startCircleRadius += 70;
        endCircleRadius += 70;
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
    var scale = map(nxtVal(), 0, 255, 1.1, 1.3);
    helperCtx.setTransform(scale, 0, 0, scale, W / 2, H / 2);
    helperCtx.drawImage(helperCnv, -W / 2, -H / 2);
    helperCtx.setTransform(1, 0, 0, 1, 0, 0);
    const ctx = cnv.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(helperCnv, 0, 0);
}

function getWord() {
    const words = [
        'LOVE', 'PEACE', 'CALM', 'STORM', 'BROKEN', 'SILENCE', 'ANGST', 'SOUL', 'MEANING', 'CHAOS', 'ORDER', 'FIGHT', 'PAIN', 'RISE', 'CALLING', 'WORTH', 'SUFFER', 'HOPE',
        'HELP', 'SELF', 'BODY', 'DARK', 'LIGHT', 'FEAR', 'ANGEL', 'DREAM', 'SURPASS', 'FAITH', 'BLOOD', 'LUST', 'ANGER', 'BEING', 'FORCE', 'TRUST', 'HATE', 'SEEING', 'MORTAL',
        'REALM', 'FORM', 'TRIUMPH', 'LOSS', 'NOWHERE', 'FREAK', 'MIND', 'CRAZY', 'HURT', 'CRY', 'FEELING', 'THOUGHT', 'MENACE', 'TONIGHT', 'TODAY', 'WHERE', 'HERE', 'CLARITY'
    ]
    return words.at(Math.round(map(nxtVal(), 0, 255, 0, words.length - 1)));
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

function getHeightSetting() {
    var height;
    var settingFound = localStorage.getItem('currentHeightSetting') != 'null';
    if (localStorage.getItem('currentHeightSetting') != 'null' &&
        localStorage.getItem('currentHeightSetting') != null) {
        height = localStorage.getItem('currentHeightSetting');
    } else {
        height = 800;
        localStorage.setItem('currentHeightSetting', 800);
    }
    return height;
}

function getWidthSetting() {
    var width;
    var settingFound = localStorage.getItem('currentWidthSetting') != 'null';
    if (localStorage.getItem('currentWidthSetting') != 'null' &&
        localStorage.getItem('currentWidthSetting') != null) {
        width = localStorage.getItem('currentWidthSetting');
    } else {
        width = 500;
        localStorage.setItem('currentWidthSetting', 500);
    }
    return width;
}

function windowResized() {
    const container = document.getElementById('canvas');
    const canvas = document.getElementById('defaultCanvas0');
    const currWidth = canvas.style.width.replace("px", "");
    const currHeight = canvas.style.height.replace("px", "");
    const newWidth = container.offsetWidth;
    if (newWidth < width) {
        const factor = newWidth / currWidth;
        const newHeight = currHeight * factor;
        canvas.style.width = container.offsetWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }
}
