'use strict';

module.exports = class PlayerTour {
    constructor(tourManager) {
        this._tourManager = tourManager;
        this._tour = [];
        this._distance = 0;
        this._finished = false;
    }

    getVertex(pos) {
        return this._tour[pos];
    }

    addVertex(v) {
        if (this.N !== 0) {
            this._distance += this._tourManager.distance(this._tour[this.N - 1], v);
        }

        this._tour.push(v);
    }

    finish() {
        this._finished = true;
        this._distance += this._tourManager.distance(this._tour[this.N - 1], this._tour[0]);
        this.addVertex = undefined;
    }

    get isFinished() {
        return this._finished;
    }

    get distance() {
        return this._distance;
    }

    get N() {
        return this._tour.length;
    }

    toString() {
        return this._tour.join('|');
    }
};
