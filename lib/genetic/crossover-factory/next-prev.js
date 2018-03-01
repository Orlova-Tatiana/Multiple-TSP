'use strict';

const Tour = require('../tour');
const {randomInt} = require('../../utils');

module.exports = class NextPrevCrossoverStrategy {
    exec(parent1, parent2, tourManager) {
        const child1 = this._crossover(parent1, parent2, tourManager, this._next);
        const child2 = this._crossover(parent1, parent2, tourManager, this._prev);
        return [child1, child2];
    }

    _crossover(parent1, parent2, tourManager, move) {
        const child = new Tour(tourManager);
        const path1 = parent1.getPath();
        const path2 = parent2.getPath();

        let c = randomInt(0, tourManager.N - 1);
        let childI = 0;
        child.setVertex(childI++, c);

        while (path1.length > 1) {
            const v1 = move(path1, c);
            const v2 = move(path2, c);
            this._remove(path1, c);
            this._remove(path2, c);
            c = tourManager.distance(c, v1) < tourManager.distance(c, v2) ? v1 : v2;

            child.setVertex(childI++, c);
        }

        return child;
    }

    _next(arr, value) {
        let i = arr.indexOf(value);
        if (i === -1) {
            return -1;
        }
        return arr[(i + 1) % arr.length];
    }

    _prev(arr, value) {
        let i = arr.indexOf(value);
        i = i - 1;
        if (i === -1) {
            i = arr.length - 1;
        }
        return arr[i];
    }

    _remove(arr, value) {
        arr.splice(arr.indexOf(value), 1);
    }
};
