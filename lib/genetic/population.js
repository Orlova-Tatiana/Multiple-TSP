'use strict';

const Tour = require('./tour');

module.exports = class Population {
    constructor(size, tourManager) {
        this._tourManager = tourManager;
        this._tours = new Array(size);

        Object.defineProperty(this, 'size', {
            get: () => size
        });
    }

    _generatePopulation() {
        for (let i = 0; i < this.size; i++) {
            this._tours[i] = new Tour(this._tourManager);
            this._tours[i].generateTour();
        }
        return this;
    }

    saveTour(pos, tour) {
        this._tours[pos] = tour;
    }

    getTour(pos) {
        return this._tours[pos];
    }

    forEachTour(callback) {
        this._tours.forEach(callback);
    }

    getFittest() {
        let fittest = this._tours[0];
        this.forEachTour((tour) => {
            if (fittest.getFitness() <= tour.getFitness()) {
                fittest = tour;
            }
        });

        return fittest;
    }

    toString() {
        return this._tours.map((tour) => `${tour} -> ${tour.getDistance()}`).join('\n');
    }
};
