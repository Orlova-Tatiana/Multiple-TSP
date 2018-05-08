'use strict';

const TspGenetic = require('../index');
const NextPrevCrossover = require('./crossover/next-prev');
const FisherYatesMutation = require('./mutation/fisher-yates');
const TournamentSelection = require('../selection-factory/tournament');

module.exports = class TspByStep {
    constructor(tourManager, options = {}) {
        options = this._defaultOptions(options);

        this._tsp = new TspGenetic(tourManager, options);
        this._tourManager = tourManager;

        this._crossover = new NextPrevCrossover();
        this._mutation = new FisherYatesMutation();
        this._tsp.setCrossover(this._crossover);
        this._tsp.setSelection(new TournamentSelection(options.tournamentSize));
        this._tsp.setMutation(this._mutation);

        this._step = 0;
        this._evolveFirstStep = options.evolveFirstStep;
        this._evolvePerStep = options.evolvePerStep;
        this._fixVertex(options.start, 0);
    }

    _defaultOptions(options) {
        return Object.assign(
            {
                start: 1,
                evolveFirstStep: 1,
                evolvePerStep: 1,
                tournamentSize: 5
            },
            options
        );
    }

    nextStep() {
        if (this.isFinished) {
            return;
        }

        const steps = this._step === 0 ? this._evolveFirstStep : this._evolvePerStep;
        for (let i = 0; i < steps; i++) {
            this._tsp.evolve();
        }
        this._step++;

        const bestTour = this._tsp.getBestTour();
        this._fixVertex(bestTour.getVertex(this._step), this._step);
        this._crossover.setStep(this._step);
        this._mutation.setStep(this._step);

        return this.isFinished;
    }

    get isFinished() {
        return this._step >= this._tourManager.N - 2;
    }

    _fixVertex(value, pos) {
        const population = this._tsp.getPopulation();
        population.forEachTour((tour) => {
            if (tour.getVertex(pos) !== value) {
                tour.swap(pos, tour.findVertex(value));
            }
        });
    }

    getBestTour() {
        return this._tsp.getBestTour();
    }

    getTourManager() {
        return this._tourManager;
    }

    get step() {
        return this._step;
    }
};
