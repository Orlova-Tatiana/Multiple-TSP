'use strict';

const {randomInt} = require('../../utils');

module.exports = class ReverseMutation {
    exec(tour) {
        let lo, hi;
        do {
            lo = randomInt(0, tour.N - 3);
            hi = randomInt(2, tour.N - 1);
        } while (lo >= hi);

        for (let i = lo, j = hi; i < j; i++, j--) {
            tour.swap(i, j);
        }
    }
};
