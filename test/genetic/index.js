'use strict';

const fs = require('fs');

const TspGenetic = require('../../lib/genetic/index');
const TourManager = require('../../lib/genetic/tour/tour-manager');
const CrossoverFactory = require('../../lib/genetic/crossover-factory');
const MutationFactory = require('../../lib/genetic/mutation-factory');
const SelectionFactory = require('../../lib/genetic/selection-factory');
const MatrixGenerator = require('../../lib/branch-and-bound/matrix-generator');
const {optionsGenerator} = require('./utils');

test();

function test() {
    const matrix = MatrixGenerator.generateNonInfSymmetricMatrix(500, 1, 1000);
    const tourManager = new TourManager(matrix);

    const options = {
        populationSize: [30, 50, 100, 150, 200],
        mutationRate: [0, 0.01, 0.02, 0.05, 0.1],
        crossover: ['next-prev'],
        mutation: ['reverse', 'segment', 'fisher-yates'],
        selection: ['tournament', 'roulette']
    };
    const generator = optionsGenerator(options);

    for (let option of generator) {
        const tsp = createTsp(tourManager, option);
        testTimestamps(tsp, option, [1000, 2000, 5000, 10000, 15000, 20000, 25000, 30000]);
    }
}

function createTsp(tourManager, options) {
    const {populationSize, mutationRate} = options;
    const tsp = new TspGenetic(tourManager, {elitism: true, populationSize, mutationRate});

    tsp.setCrossover(CrossoverFactory.create(options.crossover));
    tsp.setMutation(MutationFactory.create(options.mutation));
    tsp.setSelection(SelectionFactory.create(options.selection));

    return tsp;
}

function testTimestamps(tsp, option, timestamps) {
    const start = Date.now();
    const distances = [];

    let timeIndex = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const timePassed = Date.now() - start;
        while (timeIndex < timestamps.length && timestamps[timeIndex] < timePassed) {
            distances.push(tsp.getBestTour().getDistance());
            timeIndex++;
        }
        if (timeIndex === timestamps.length) {
            break;
        }

        tsp.evolve();
    }

    print(option, distances);
}

function print(option, distances) {
    const data = JSON.stringify(option) + '\n' + distances.join(' ');
    try {
        fs.appendFileSync('data.txt', data + '\n');
    } catch (e) {
        console.log(data);
    }
}
