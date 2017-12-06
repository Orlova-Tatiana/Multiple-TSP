"use strict";
require("./util");

function TourManager(matrix) {
    let self = this;
    this._matrix = matrix;

    Object.defineProperty(this, "N", {
        get: function () {
            return self._matrix.length;
        }
    });
}

TourManager.prototype.distance = function (from, to) {
    return this._matrix[from][to];
};

function Tour(tourManager) {
    let tour = new Array(tourManager.N);
    let distance = 0; //cache

    this.generateTour = function () {
        for (let i = 0; i < tourManager.N; i++)
            tour[i] = i;
        tour.shuffle();
    };

    this.getVertex = function (pos) {
        return tour[pos];
    };

    this.setVertex = function (pos, v) {
        tour[pos] = v;
        distance = 0; //clear cache
    };

    this.getFitness = function () {
        return 1 / this.getDistance();
    };

    this.getDistance = function () {
        if (distance == 0) {
            for (let i = 0; i < tourManager.N - 1; i++)
                distance += tourManager.distance(tour[i], tour[i + 1]);
            distance += tourManager.distance(tour[tourManager.N - 1], tour[0]);
        }
        return distance;
    };

    this.containsVertex = function (v) {
        return tour.includes(v);
    };

    this.toString = function () {
        return tour.join("|");
    }
}

function Population(size, tourManager) {
    let tours = new Array(size);

    this._generatePopulation = function () {
        for (let i = 0; i < size; i++) {
            tours[i] = new Tour(tourManager);
            tours[i].generateTour();
        }
        return this;
    };

    this.saveTour = function (pos, tour) {
        tours[pos] = tour;
    };

    this.getTour = function (pos) {
        return tours[pos];
    };

    this.getFittest = function () {
        let fittest = tours[0];
        for (let i = 1; i < this.size; i++)
            if (fittest.getFitness() <= tours[i].getFitness())
                fittest = tours[i];
        return fittest;
    };

    Object.defineProperty(this, "size", {
        get: function () {
            return size;
        }
    });
}

TspGenetic.MUTATION_RATE = 0.015;
TspGenetic.TOURNAMENT_SIZE = 5;
TspGenetic.ELITISM = true;

function TspGenetic(tourManager) {
    this.generatePopulation = function (size) {
        return new Population(size, tourManager)._generatePopulation();
    };

    this.evolvePopulation = function (population) {
        let newPopulation = new Population(population.size, tourManager);

        let offset = 0;
        if (TspGenetic.ELITISM) {
            newPopulation.saveTour(0, population.getFittest());
            offset = 1;
        }

        for (let i = offset; i < population.size; i++) {
            let parent1 = tournament(population);
            let parent2 = tournament(population);
            let child = crossover(parent1, parent2);
            newPopulation.saveTour(i, child);
        }

        for (let i = offset; i < newPopulation.size; i++)
            mutate(newPopulation.getTour(i));

        return newPopulation;
    };

    function tournament(population) {
        let tournament = new Population(TspGenetic.TOURNAMENT_SIZE, tourManager);
        for (let i = 0; i < TspGenetic.TOURNAMENT_SIZE; i++) {
            let randI = Number.randomInt(0, population.size - 1);
            tournament.saveTour(i, population.getTour(randI));
        }
        return tournament.getFittest();
    }

    function crossover(parent1, parent2) {
        let lo = Number.randomInt(0, TourManager.N - 1);
        let hi = Number.randomInt(0, TourManager.N - 1);
        [lo, hi] = [Math.min(lo, hi), Math.max(lo, hi)];

        let child = new Tour(tourManager);
        for (let i = lo; i <= hi; i++)
            child.setVertex(i, parent1.getVertex(i));

        let childI = 0;
        for (let i = 0; i < tourManager.N; i++) {
            let v = parent2.getVertex(i);
            if (!child.containsVertex(v)) {
                if (childI == lo)
                    childI = hi + 1;
                child.setVertex(childI, v);
                childI++;
            }
        }

        return child;
    }

    function mutate(tour) {
        //Fisher-Yates shuffle
        for (let i = tourManager.N - 1; i > 0; i--) {
            if (Math.random() < TspGenetic.MUTATION_RATE) {
                let j = Number.randomInt(0, i);

                let v1 = tour.getVertex(i);
                let v2 = tour.getVertex(j);
                tour.setVertex(i, v2);
                tour.setVertex(j, v1);
            }
        }
    }
}

//EXPORTS
module.exports.TourManager = TourManager;
module.exports.TspGenetic = TspGenetic;
module.exports.Population = Population;
module.exports.Tour = Tour;