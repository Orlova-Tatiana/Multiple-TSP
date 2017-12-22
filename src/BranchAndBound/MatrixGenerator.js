"use strict";
require("../util");

function MatrixGenerator() {
}

Object.defineProperty(MatrixGenerator, "cycle4", {
    get: function () {
        return [
            [Infinity, 1, Infinity, Infinity],
            [Infinity, Infinity, 2, Infinity],
            [Infinity, Infinity, Infinity, 3],
            [4, Infinity, Infinity, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, "cycle3back", {
    get: function () {
        return [
            [Infinity, 1, 50],
            [1, Infinity, 1],
            [200, 50, Infinity]
        ];
    }
});

Object.defineProperty(MatrixGenerator, "cycleWith2SubCycles", {
    get: function () {
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

Object.defineProperty(MatrixGenerator, "cycleWith4SubCycles", {
    get: function () {
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

Object.defineProperty(MatrixGenerator, "backAndForth", {
    get: function () {
        return [
            [Infinity, 1, Infinity],
            [1, Infinity, 1],
            [Infinity, 1, Infinity]
        ];
    }
});

MatrixGenerator.generateNonInfMatrix = function (size, min = 1, max = 256) {
    let matrix = new Array(size).fill(0).map(_ => new Array(size));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            matrix[i][j] = i == j ? 0 : Number.randomInt(min, max);
        }
    }
    return matrix;
};

module.exports = MatrixGenerator;