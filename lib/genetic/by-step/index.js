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
        this._mutation = new FisherYatesMutation(options.fisherYatesMutationRate);
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
                tournamentSize: 5,
                mutationRate: 0.2,
                fisherYatesMutationRate: 0.1
            },
            options,
            {
                elitism: false // элитизм использовать нельзя
            }
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

        const bestTour = this.getBestTour();
        this._fixVertex(bestTour.getVertex(this._step), this._step);
        this._crossover.setStep(this._step);
        this._mutation.setStep(this._step);

        return this.isFinished;
    }

    get isFinished() {
        return this._step >= this._tourManager.N - 1;
    }

    _fixVertex(value, pos) {
        const population = this.getPopulation();
        population.forEachTour((tour) => {
            if (tour.getVertex(pos) !== value) {
                tour.swap(pos, tour.findVertex(value));
            }
        });
    }

    getBestTour() {
        return this.getPopulation().getFittest(); //bestTour использовать нельзя
    }

    getPopulation() {
        return this._tsp.getPopulation();
    }

    getTourManager() {
        return this._tourManager;
    }

    get currentVertex() {
        return this.getBestTour().getVertex(this.step);
    }

    get step() {
        return this._step;
    }
};
