'use strict';

const fs = require('fs');

const TourManager = require('../../../lib/genetic/tour/tour-manager');
const MatrixGenerator = require('../../../lib/branch-and-bound/matrix-generator');
const TspGenetic = require('../../../lib/genetic');
const TournamentSelection = require('../../../lib/genetic/selection-factory/tournament');
const NextPrevCrossover = require('../../../lib/genetic/crossover-factory/next-prev');
const FisherYatesMutation = require('../../../lib/genetic/mutation-factory/fisher-yates');
const TspByStep = require('../../../lib/genetic/step-by-step');
const {optionsGenerator} = require('../utils');

test();

function test() {
    const matrix = MatrixGenerator.generateNonInfMatrix(200, 1, 1000);
    const tourManager = new TourManager(matrix);

    const options = {
        populationSize: [30, 50, 100, 150, 200],
        mutationRate: [0, 0.01, 0.02, 0.05, 0.1],
        evolveFirstStep: [1, 50, 100, 300],
        evolvePerStep: [1, 2, 5, 10],
        tournamentSize: [5]
    };
    const generator = optionsGenerator(options);

    for (let option of generator) {
        const tspByStep = createTspByStep(tourManager, option);
        const tspGenetic = createTspGenetic(tourManager, option);

        const time = testByStep(tspByStep, option);
        testGenetic(tspGenetic, time);
    }
}

function testByStep(tsp, option) {
    const start = Date.now();

    do {
        tsp.nextStep();
    } while (!tsp.isFinished);

    const time = Date.now() - start;

    printByStep(option, tsp.getBestTour().getDistance(), time);
    return time;
}

function printByStep(option, distance, time) {
    const formattedTime = `${Math.floor(time / 1000)}s ${time % 1000}ms`;
    const data = `${JSON.stringify(option)}\r\nDistance: ${distance} ; Time: ${formattedTime}`;

    try {
        fs.appendFileSync('data.txt', `${data}\r\n`);
        console.log(data);
    } catch (e) {
        console.log(data);
    }
}

function testGenetic(tsp, time) {
    const start = Date.now();

    let execTime = 0;
    while (execTime < time) {
        tsp.evolve();
        execTime = Date.now() - start;
    }

    printGenetic(tsp.getBestTour().getDistance());
}

function printGenetic(distance) {
    const data = `Genetic: ${distance}`;
    try {
        fs.appendFileSync('data.txt', `${data}\r\n\r\n`);
        console.log(data);
    } catch (e) {
        console.log(data);
    }
}

function createTspByStep(tourManager, options) {
    return new TspByStep(tourManager, options);
}

function createTspGenetic(tourManager, options) {
    const {populationSize, mutationRate, tournamentSize} = options;
    const tsp = new TspGenetic(tourManager, {populationSize, mutationRate});

    tsp.setCrossover(new NextPrevCrossover());
    tsp.setMutation(new FisherYatesMutation());
    tsp.setSelection(new TournamentSelection(tournamentSize));

    return tsp;
}
