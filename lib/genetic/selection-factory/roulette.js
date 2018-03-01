'use strict';

module.exports = class RouletteSelectionStrategy {
    constructor() {
        this._wheel = null;
        this._population = null;
    }

    exec(population) {
        let wheel = this._getWheel(population);

        let max = wheel[population.size - 1];
        let rand = Math.random() * max;

        let i = 0;
        while (wheel[i] < rand) {
            i++;
        }

        return population.getTour(i);
    }

    _getWheel(population) {
        if (this._population === population) {
            return this._wheel;
        }

        let wheel = new Array(population.size);
        wheel[0] = population.getTour(0).getFitness();
        for (let i = 1; i < population.size; i++) {
            wheel[i] = wheel[i - 1] + population.getTour(i).getFitness();
        }

        this._wheel = wheel;
        this._population = population;
        return wheel;
    }
};
