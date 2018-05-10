'use strict';

const TspByStep = require('../by-step');

module.exports = class Player {
    constructor(tourManager, options) {
        this._tsp = new TspByStep(tourManager, options);
    }

    doInit() {
        return this._tsp.currentVertex;
    }

    doTurn() {
        this._tsp.nextStep();
        return this._tsp.currentVertex;
    }

    onVertexChoose(v) {
        this._tsp.getPopulation().forEachTour((tour) => {
            tour.removeVertex(v);
        });
    }
};
