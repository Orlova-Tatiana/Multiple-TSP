'use strict';

const {randomInt} = require('../../utils');

module.exports = class FisherYatesMutationStrategy {
    constructor(mutationRate = 0.05) {
        this._mutationRate = mutationRate;
    }

    exec(tour) {
        //Fisher-Yates shuffle
        for (let i = tour.N - 1; i > 0; i--) {
            if (Math.random() < this._mutationRate) {
                const j = randomInt(0, i);
                tour.swap(i, j);
            }
        }
    }
};
