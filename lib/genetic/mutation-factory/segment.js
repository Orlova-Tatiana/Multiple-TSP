/* eslint-disable no-bitwise */
'use strict';

const {randomInt} = require('../../utils');

module.exports = class SegmentMutation {
    exec(tour) {
        let lo, hi;
        do {
            lo = randomInt(0, (tour.N - 1) >> 1);
            hi = randomInt(0, tour.N - 1);
        } while (lo >= hi);

        const path = tour.getPath();
        let tourI = 0;
        for (let i = lo; i < hi; i++) {
            tour.setVertex(tourI++, path[i]);
        }
        for (let i = 0; i < lo; i++) {
            tour.setVertex(tourI++, path[i]);
        }
        for (let i = hi; i < tour.N; i++) {
            tour.setVertex(tourI++, path[i]);
        }
    }
};
