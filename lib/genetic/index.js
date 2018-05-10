'use strict';

const Population = require('./population');
const {shuffle} = require('../utils');

module.exports = class TspGenetic {
    constructor(tourManager, options = {}) {
        options = this._defaultOptions(options);
        this._elitism = options.elitism;
        this._mutationRate = options.mutationRate;

        this._tourManager = tourManager;
        this._population = this._generatePopulation(options.populationSize);
        this._bestTour = this._population.getFittest();

        this._iter = 0;
        this._mutationCount = 0;

        this._selectionStrategy = null;
        this._crossoverStrategy = null;
        this._mutationStrategy = null;
    }

    _defaultOptions(options) {
        return Object.assign(
            {
                elitism: true,
                populationSize: 30,
                mutationRate: 0.015
            },
            options
        );
    }

    _generatePopulation(size) {
        return new Population(size, this._tourManager)._generatePopulation();
    }

    evolve() {
        this._population = this._evolvePopulation(this._population);
        this._iter++;
    }

    _evolvePopulation(population) {
        const newPopulation = new Population(population.size, this._tourManager);

        let offset = 0;
        if (this._elitism) {
            newPopulation.saveTour(0, this._bestTour);
            offset = 1;
        }

        for (let i = offset; i < population.size; i++) {
            newPopulation.saveTour(i, this._selection(population));
        }

        const queue = this._randomInterval(population.size);
        for (let i = 0; i < queue.length - 1; i += 2) {
            const parent1 = newPopulation.getTour(queue[i]);
            const parent2 = newPopulation.getTour(queue[i + 1]);
            const children = this._crossover(parent1, parent2);
            newPopulation.saveTour(queue[i], children[0]);
            newPopulation.saveTour(queue[i + 1], children[1]);
        }

        this._saveBestTour(newPopulation.getFittest());

        newPopulation.forEachTour((tour) => this._mutate(tour));

        return newPopulation;
    }

    _randomInterval(n) {
        const arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = i;
        }
        return shuffle(arr);
    }

    _selection(population) {
        return this._selectionStrategy.exec(population, this._tourManager);
    }

    _crossover(parent1, parent2) {
        return this._crossoverStrategy.exec(parent1, parent2, this._tourManager);
    }

    _mutate(tour) {
        if (Math.random() < this._mutationRate) {
            this._mutationStrategy.exec(tour);
            this._mutationCount++;
        }
    }

    setSelection(strategy) {
        this._selectionStrategy = strategy;
    }

    setCrossover(strategy) {
        this._crossoverStrategy = strategy;
    }

    setMutation(strategy) {
        this._mutationStrategy = strategy;
    }

    _saveBestTour(tour) {
        if (tour.getDistance() < this._bestTour.getDistance()) {
            this._bestTour = tour.clone();
        }
    }

    getPopulation() {
        return this._population;
    }

    getBestTour() {
        return this._bestTour;
    }

    getTourManager() {
        return this._tourManager;
    }

    iteration() {
        return this._iter;
    }

    mutationCount() {
        return this._mutationCount;
    }
};
