'use strict';

const {randomInt, createEmptyMatrix} = require('../utils');

const MatrixGenerator = {};

Object.defineProperty(MatrixGenerator, 'cycle4', {
    get: () => {
        return [
            [Infinity, 1, Infinity, Infinity],
            [Infinity, Infinity, 2, Infinity],
            [Infinity, Infinity, Infinity, 3],
            [4, Infinity, Infinity, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, 'cycle3back', {
    get: () => {
        return [
            [Infinity, 1, 50],
            [1, Infinity, 1],
            [200, 50, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, 'cycleWith2SubCycles', {
    get: () => {
        return [
            [Infinity, 1, Infinity, Infinity, Infinity, Infinity],
            [Infinity, Infinity, 1, Infinity, Infinity, Infinity],
            [1, Infinity, Infinity, 100, Infinity, Infinity],
            [Infinity, Infinity, Infinity, Infinity, 1, Infinity],
            [Infinity, Infinity, Infinity, Infinity, Infinity, 1],
            [100, Infinity, Infinity, 1, Infinity, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, 'cycleWith4SubCycles', {
    get: () => {
        return [
            [Infinity, 1, Infinity, 50, Infinity, Infinity],
            [Infinity, Infinity, 1, Infinity, Infinity, Infinity],
            [1, Infinity, Infinity, 100, Infinity, Infinity],
            [Infinity, Infinity, Infinity, Infinity, 1, Infinity],
            [Infinity, Infinity, Infinity, Infinity, Infinity, 1],
            [100, 50, Infinity, 1, Infinity, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, 'backAndForth', {
    get: () => {
        return [
            [Infinity, 1, Infinity],
            [1, Infinity, 1],
            [Infinity, 1, Infinity]
        ];
    }
});

MatrixGenerator.generateNonInfMatrix = (size, min = 1, max = 256) => {
    const matrix = createEmptyMatrix(size);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            matrix[i][j] = i === j ? 0 : randomInt(min, max);
        }
    }
    return matrix;
};

module.exports = MatrixGenerator;
