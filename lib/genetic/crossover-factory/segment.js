'use strict';

const Tour = require('../tour');
const {randomInt} = require('../../utils');

module.exports = class SegmentCrossoverStrategy {
    exec(parent1, parent2, tourManager) {
        const child1 = this._crossover(parent1, parent2, tourManager);
        const child2 = this._crossover(parent2, parent1, tourManager);
        return [child1, child2];
    }

    _crossover(parent1, parent2, tourManager) {
        let lo = randomInt(0, tourManager.N - 1);
        let hi = randomInt(0, tourManager.N - 1);
        [lo, hi] = [Math.min(lo, hi), Math.max(lo, hi)];

        const child = new Tour(tourManager);
        for (let i = lo; i <= hi; i++) {
            child.setVertex(i, parent1.getVertex(i));
        }

        let childI = 0;
        for (let i = 0; i < tourManager.N; i++) {
            const v = parent2.getVertex(i);
            if (!child.containsVertex(v)) {
                if (childI === lo) {
                    childI = hi + 1;
                }
                child.setVertex(childI, v);
                childI++;
            }
        }

        return child;
    }
};
