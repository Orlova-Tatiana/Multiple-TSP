'use strict';

const TourManager = require('../tour/tour-manager');
const MatrixGenerator = require('../../branch-and-bound/matrix-generator');
const TspByStep = require('./index');

const matrix = MatrixGenerator.generateNonInfMatrix(50);
const options1 = {mutationRate: 0.015, populationSize: 50};
const options2 = {mutationRate: 0.015, populationSize: 50, evolvePerStep: 10};

test(matrix, options1);
test(matrix, options2);

function test(matrix, options) {
    const tsp = new TspByStep(new TourManager(matrix), options);

    do {
        tsp.nextStep();
    } while (!tsp.isFinished);

    console.log(tsp.getBestTour().toString(), tsp.getBestTour().getDistance());
}
