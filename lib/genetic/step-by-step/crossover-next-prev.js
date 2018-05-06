'use strict';

const Tour = require('../tour');
const {reverse} = require('./utils');

module.exports = class NextPrevByStepCrossoverStrategy {
    constructor() {
        this._step = 0;
    }

    setStep(step) {
        this._step = step;
    }

    exec(parent1, parent2, tourManager) {
        const child1 = this._next(parent1, parent2, tourManager);
        const child2 = this._prev(parent1, parent2, tourManager);
        return [child1, child2];
    }

    _next(parent1, parent2, tourManager) {
        const path1 = parent1.getPath();
        const path2 = parent2.getPath();
        const child = this._crossover(path1, path2, tourManager);
        return new Tour(tourManager, child);
    }

    _prev(parent1, parent2, tourManager) {
        const path1 = this._reverse(parent1.getPath());
        const path2 = this._reverse(parent2.getPath());
        const child = this._crossover(path1, path2, tourManager);
        return new Tour(tourManager, this._reverse(child));
    }

    _reverse(path) {
        reverse(path, 0, this._step);
        reverse(path, this._step + 1);
        return path;
    }

    _crossover(path1, path2, tourManager) {
        const child = new Array(path1.length);

        let c = path1[0];
        let childI = 0;
        child[childI++] = c;

        while (path1.length > 1) {
            const v1 = this._move(path1, c);
            const v2 = this._move(path2, c);
            this._remove(path1, c);
            this._remove(path2, c);
            c = tourManager.distance(c, v1) < tourManager.distance(c, v2) ? v1 : v2;

            child[childI++] = c;
        }

        return child;
    }

    _move(arr, value) {
        let i = arr.indexOf(value);
        if (i === -1) {
            return -1;
        }
        return arr[(i + 1) % arr.length];
    }

    _remove(arr, value) {
        arr.splice(arr.indexOf(value), 1);
    }
};
