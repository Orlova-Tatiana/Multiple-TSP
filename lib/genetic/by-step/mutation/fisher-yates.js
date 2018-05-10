'use strict';

const {randomInt} = require('../../../utils');

module.exports = class FisherYatesByStepMutationStrategy {
    constructor(mutationRate = 0.05) {
        this._mutationRate = mutationRate;
        this._step = 0;
    }

    setStep(step) {
        this._step = step;
    }

    exec(tour) {
        //Fisher-Yates shuffle
        for (let i = tour.N - 1; i > this._step; i--) {
            if (Math.random() < this._mutationRate) {
                const j = randomInt(this._step + 1, i);
                tour.swap(i, j);
            }
        }
    }
};
