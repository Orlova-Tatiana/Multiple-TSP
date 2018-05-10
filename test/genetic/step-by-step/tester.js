'use strict';

const fs = require('fs');

const TourManager = require('../../../lib/genetic/tour/tour-manager');
const MatrixGenerator = require('../../../lib/branch-and-bound/matrix-generator');
const TspGenetic = require('../../../lib/genetic');
const TournamentSelection = require('../../../lib/genetic/selection-factory/tournament');
const NextPrevCrossover = require('../../../lib/genetic/crossover-factory/next-prev');
const FisherYatesMutation = require('../../../lib/genetic/mutation-factory/fisher-yates');
const TspByStep = require('../../../lib/genetic/by-step');
const {optionsGenerator, averageStats} = require('../utils');
const optionsFactory = require('./options-factory');

module.exports = class TspByStepTester {
    constructor(optionsName, options) {
        options = this._defaultOptions(options);
        this._compare = options.compareWithOriginal;

        this._tourManagers = this._prepareTourManagers(options.points, options.repeat);

        this._tspOptions = optionsFactory[optionsName]();
        this._fileName = `${__dirname}/${optionsName}.txt`;
    }

    _defaultOptions(options) {
        return Object.assign(
            {
                points: 200,
                repeat: 1,
                compareWithOriginal: false
            },
            options
        );
    }

    _prepareTourManagers(points, repeat) {
        const tourManagers = new Array(repeat);
        for (let i = 0; i < repeat; i++) {
            const matrix = MatrixGenerator.generateNonInfSymmetricMatrix(points, 1, 1000);
            tourManagers[i] = new TourManager(matrix);
        }

        return tourManagers;
    }

    test() {
        const generator = optionsGenerator(this._tspOptions);

        for (let option of generator) {
            let stats = this._repeatTspByStep(option);
            this._printByStep(option, stats);

            if (this._compare) {
                stats = this._repeatTspGenetic(option, stats.time);
                this._printGenetic(stats);
            }
        }
    }

    _repeatTspByStep(option) {
        const stats = this._tourManagers.map((tourManager) => {
            const tspByStep = this._createTspByStep(tourManager, option);
            return this._testByStep(tspByStep, option);
        });

        return averageStats(stats);
    }

    _createTspByStep(tourManager, options) {
        return new TspByStep(tourManager, options);
    }

    _testByStep(tsp) {
        const start = Date.now();

        tsp.nextStep();
        const firstStepDistance = tsp.getBestTour().getDistance();

        do {
            tsp.nextStep();
        } while (!tsp.isFinished);

        const time = Date.now() - start;

        return {
            firstStepDistance,
            distance: tsp.getBestTour().getDistance(),
            time
        };
    }

    _printByStep(option, stats) {
        const {firstStepDistance, distance, time} = stats;

        const formattedTime = `${Math.floor(time / 1000)}s ${time % 1000}ms`;
        const optionData = JSON.stringify(option);
        const resultData = `First step distance: ${firstStepDistance} ; Distance: ${distance} ; Time: ${formattedTime}`;
        const data = `${optionData}\r\n${resultData}\r\n`;

        try {
            fs.appendFileSync(this._fileName, data);
            console.log(data);
        } catch (e) {
            console.log(data);
        }
    }

    _repeatTspGenetic(option, time) {
        const stats = this._tourManagers.map((tourManager) => {
            const tspGenetic = this._createTspGenetic(tourManager, option);
            return this._testGenetic(tspGenetic, time);
        });

        return averageStats(stats);
    }

    _createTspGenetic(options) {
        const {populationSize, mutationRate, tournamentSize} = options;
        const tsp = new TspGenetic(this._tourManager, {populationSize, mutationRate});

        tsp.setCrossover(new NextPrevCrossover());
        tsp.setMutation(new FisherYatesMutation());
        tsp.setSelection(new TournamentSelection(tournamentSize));

        return tsp;
    }

    _testGenetic(tsp, time) {
        const start = Date.now();

        let execTime = 0;
        while (execTime < time) {
            tsp.evolve();
            execTime = Date.now() - start;
        }

        return {
            distance: tsp.getBestTour().getDistance()
        };
    }

    _printGenetic(stats) {
        const {distance} = stats;
        const data = `Genetic: ${distance}`;

        try {
            fs.appendFileSync(this._fileName, `${data}\r\n\r\n`);
            console.log(data);
        } catch (e) {
            console.log(data);
        }
    }
};
