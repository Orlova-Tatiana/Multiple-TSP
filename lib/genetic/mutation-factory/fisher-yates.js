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
                this._swap(tour, i, j);
            }
        }
    }

    _swap(tour, i, j) {
        const v1 = tour.getVertex(i);
        const v2 = tour.getVertex(j);
        tour.setVertex(i, v2);
        tour.setVertex(j, v1);
    }
};
