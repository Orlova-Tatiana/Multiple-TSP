'use strict';

module.exports = class TourManager {
    constructor(matrix) {
        this._matrix = matrix;

        Object.defineProperty(this, 'N', {
            get: () => this._matrix.length
        });
    }

    distance(from, to) {
        return this._matrix[from][to];
    }
};
