'use strict';

const TspByStep = require('../by-step');

module.exports = class Player {
    constructor(tourManager, options) {
        this._tsp = new TspByStep(tourManager, options);
        this._start = this._tsp.currentVertex;
    }

    doInit() {
        return this._start;
    }

    doTurn() {
        this._tsp.nextStep();
        return this._tsp.currentVertex;
    }

    onVertexChoose(v) {
        if (v === this._start) {
            return;
        }

        this._tsp.getPopulation().forEachTour((tour) => {
            tour.removeVertex(v);
        });
    }
};
