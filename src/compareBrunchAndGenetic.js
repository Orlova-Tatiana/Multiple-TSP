"use strict";
let TspBranch = require("./TspBranch");
let {TspGenetic, Population, TourManager} = require("./TspGenetic");
let MatrixGenerator = require("./MatrixGenerator");
let PointsGenerator = require("./PointsGenerator");
let MatrixConverter = require("./MatrixConverter");

//let matrix = MatrixGenerator.generateNonInfMatrix(10);
let points = PointsGenerator.generate(9);
let matrix = MatrixConverter.toDistMatrix(points);

//console.log("Matrix: ", matrix);

console.log("Branch and bound:");
let branch = new TspBranch(matrix);
console.log("cost = " + branch.cost);
console.log("path = " + branch.path.toString());

console.log("Genetic:");
let tourManager = new TourManager(matrix);

let genetic = new TspGenetic(tourManager);
let count = 0;
let EPS = 1e-7;
while (genetic.getBestTour().getDistance() > branch.cost + EPS && count < 10000) {
    genetic.evolve();
    count++;
}

console.log("cost = " + genetic.getBestTour().getDistance());
console.log("iterations = " + count);
console.log("path = " + genetic.getBestTour().toString());