"use strict";
let fs = require("fs");
let {TspGenetic, Population, TourManager} = require("./TspGenetic");

function loadMatrix(file) {
    let contents = fs.readFileSync(file, "utf-8");
    contents = contents.split("\r\n");

    let size = parseInt(contents[0]);
    let matrix = new Array(size);
    for (let i = 0; i < size; i++) {
        matrix[i] = contents[i + 1].split(" ").map(s => parseInt(s));
    }

    return matrix;
}

let m = loadMatrix("geneticM.txt");

console.log("Genetic:");
let tourManager = new TourManager(m);

let genetic = new TspGenetic(tourManager);
let pop = genetic.generatePopulation(30);

function clock(start) {
    if (!start) return process.hrtime();
    let end = process.hrtime(start);
    return Math.round((end[0] * 1000) + (end[1] / 1000000));
}

let iter = 100;
let start = clock();
for (let i = 0; ; i++) {
    if (i % iter == 0) {
        console.log(i, "cost =", pop.getFittest().getDistance());
        // console.log("Overall time is", clock(start), "ms");
    }
    pop = genetic.evolvePopulation(pop);
}