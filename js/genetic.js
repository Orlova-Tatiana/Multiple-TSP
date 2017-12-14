// const PointsGenerator = require("../PointsGenerator");
// const MatrixConverter = require("../MatrixConverter");
// const {TspGenetic, Population, TourManager} = require("../TspGenetic");

function init(canvas) {
    let points = generatePoints(canvas);
    let matrix = MatrixConverter.toDistMatrix(points);
    let tourManager = new TourManager(matrix);
    let tsp = new TspGenetic(tourManager);

    let population = tsp.generatePopulation(30);
    draw(canvas, points, population.getFittest().getPath());

    let i = 0;
    setTimeout(function next() {
        population = tsp.evolvePopulation(population);
        draw(canvas, points, population.getFittest().getPath());
        setTimeout(next, 0);
    }, 0);
}

function generatePoints(canvas) {
    let width = canvas.width;
    let height = canvas.height;
    return PointsGenerator.generate(50, 5, width - 5, 5, height - 5);
}

function draw(canvas, points, path) {
    points = index(points, path);

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints(ctx, points);
    drawPath(ctx, points);
}

function index(arr, index) {
    let newArr = new Array(index.length);
    for (let i = 0; i < index.length; i++) {
        newArr[i] = arr[index[i]];
    }
    return newArr;
}

function drawPoints(ctx, points) {
    ctx.fillStyle = "black";

    for (let point of points) {
        drawPoint(ctx, point.x, point.y);
    }
}

function drawPoint(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawPath(ctx, points) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    ctx.beginPath();
    let last = points[points.length - 1];
    ctx.moveTo(last.x, last.y);
    for (let point of points) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
}