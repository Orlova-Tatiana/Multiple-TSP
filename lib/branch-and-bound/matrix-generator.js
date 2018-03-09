'use strict';

const {randomInt, createEmptyMatrix} = require('../utils');

module.exports = class MatrixGenerator {
    get cycle4() {
        return [
            [Infinity, 1, Infinity, Infinity],
            [Infinity, Infinity, 2, Infinity],
            [Infinity, Infinity, Infinity, 3],
            [4, Infinity, Infinity, Infinity]
        ];
    }

    get cycle3back() {
        return [
            [Infinity, 1, 50],
            [1, Infinity, 1],
            [200, 50, Infinity]
        ];
    }

    get cycleWith2SubCycles() {
        return [
            [Infinity, 1, Infinity, Infinity, Infinity, Infinity],
            [Infinity, Infinity, 1, Infinity, Infinity, Infinity],
            [1, Infinity, Infinity, 100, Infinity, Infinity],
            [Infinity, Infinity, Infinity, Infinity, 1, Infinity],
            [Infinity, Infinity, Infinity, Infinity, Infinity, 1],
            [100, Infinity, Infinity, 1, Infinity, Infinity]
        ];
    }

    get cycleWith4SubCycles() {
        return [
            [Infinity, 1, Infinity, 50, Infinity, Infinity],
            [Infinity, Infinity, 1, Infinity, Infinity, Infinity],
            [1, Infinity, Infinity, 100, Infinity, Infinity],
            [Infinity, Infinity, Infinity, Infinity, 1, Infinity],
            [Infinity, Infinity, Infinity, Infinity, Infinity, 1],
            [100, 50, Infinity, 1, Infinity, Infinity]
        ];
    }

    get backAndForth() {
        return [
            [Infinity, 1, Infinity],
            [1, Infinity, 1],
            [Infinity, 1, Infinity]
        ];
    }

    generateNonInfMatrix(size, min = 1, max = 256) {
        const matrix = createEmptyMatrix(size);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                matrix[i][j] = i === j ? 0 : randomInt(min, max);
            }
        }
        return matrix;
    }
};
