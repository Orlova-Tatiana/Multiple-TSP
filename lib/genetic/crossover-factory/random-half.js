'use strict';

const Tour = require('../tour');

module.exports = class RandomHalfCrossoverStrategy {
    exec(parent1, parent2, tourManager) {
        const child1 = this._crossover(parent1, parent2, tourManager);
        const child2 = this._crossover(parent2, parent1, tourManager);
        return [child1, child2];
    }

    _crossover(parent1, parent2, tourManager) {
        const child = new Tour(tourManager);

        for (let i = 0; i < tourManager.N; i++) {
            if (Math.random() < 0.5) {
                child.setVertex(i, parent1.getVertex(i));
            }
        }

        let childI = 0;
        for (let i = 0; i < tourManager.N; i++) {
            const v = parent2.getVertex(i);
            if (!child.containsVertex(v)) {
                while (child.getVertex(childI) !== undefined) {
                    childI++;
                }
                child.setVertex(childI, v);
            }
        }

        return child;
    }
};
