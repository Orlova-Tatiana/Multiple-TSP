'use strict';

module.exports = class TourManager {
    constructor(matrix) {
        this._matrix = matrix;
    }

    get N() {
        return this._matrix.length;
    }

    distance(from, to) {
        return this._matrix[from][to];
    }
};
