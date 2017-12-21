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
    this._tourManager = tourManager;
    this._tour = new Array(tourManager.N);
    this._distance = 0; //cache
}

Tour.prototype = {
    generateTour: function () {
        for (let i = 0; i < this._tourManager.N; i++)
            this._tour[i] = i;
        this._tour.shuffle();
    },

    getVertex: function (pos) {
        return this._tour[pos];
    },

    setVertex: function (pos, v) {
        this._tour[pos] = v;
        this._distance = 0; //clear cache
    },

    getFitness: function () {
        return 1 / this.getDistance();
    },

    getDistance: function () {
        if (this._distance == 0) {
            for (let i = 0; i < this._tourManager.N - 1; i++)
                this._distance += this._tourManager.distance(this._tour[i], this._tour[i + 1]);
            this._distance += this._tourManager.distance(this._tour[this._tourManager.N - 1], this._tour[0]);
        }
        return this._distance;
    },

    getPath: function () {
        return this._tour;
    },

    containsVertex: function (v) {
        return this._tour.includes(v);
    },

    toString: function () {
        return this._tour.join("|");
    }
};

function Population(size, tourManager) {
    this._tourManager = tourManager;
    this._tours = new Array(size);

    Object.defineProperty(this, "size", {
        get: function () {
            return size;
        }
    });
}

Population.prototype = {
    _generatePopulation: function () {
        for (let i = 0; i < this.size; i++) {
            this._tours[i] = new Tour(this._tourManager);
            this._tours[i].generateTour();
        }
        return this;
    },

    saveTour: function (pos, tour) {
        this._tours[pos] = tour;
    },

    getTour: function (pos) {
        return this._tours[pos];
    },

    getFittest: function () {
        let fittest = this._tours[0];
        for (let i = 1; i < this.size; i++)
            if (fittest.getFitness() <= this._tours[i].getFitness())
                fittest = this._tours[i];
        return fittest;
    }
};

TspGenetic.MUTATION_RATE = 0.015;
TspGenetic.TOURNAMENT_SIZE = 5;
TspGenetic.ELITISM = true;

function TspGenetic(tourManager) {
    this._tourManager = tourManager;
    this._population = this._generatePopulation(30);
    this._iter = 0;
}

TspGenetic.prototype = {
    evolve: function () {
        this._population = this._evolvePopulation(this._population);
        this._iter++;
    },

    getBestTour: function () {
        return this._population.getFittest();
    },

    iteration: function () {
        return this._iter;
    },

    _generatePopulation: function (size) {
        return new Population(size, this._tourManager)._generatePopulation();
    },

    _evolvePopulation: function (population) {
        let newPopulation = new Population(population.size, this._tourManager);

        let offset = 0;
        if (TspGenetic.ELITISM) {
            newPopulation.saveTour(0, population.getFittest());
            offset = 1;
        }

        for (let i = offset; i < population.size; i++) {
            let parent1 = this._selection(population);
            let parent2 = this._selection(population);
            let child = this._crossover(parent1, parent2);
            newPopulation.saveTour(i, child);
        }

        for (let i = offset; i < newPopulation.size; i++)
            this._mutate(newPopulation.getTour(i));

        return newPopulation;
    },

    _selection: function (population) {
        return this._tournament(population);
    },

    _roulette: function (population) {
        let wheel = new Array(population.size);
        wheel[0] = population.getTour(0).getFitness();
        for (let i = 1; i < population.size; i++)
            wheel[i] = wheel[i - 1] + population.getTour(i).getFitness();

        let max = wheel[population.size - 1];
        let rand = Math.random() * max;

        let i = 0;
        while (wheel[i] < rand) {
            i++;
        }

        return population.getTour(i);
    },

    _tournament: function (population) {
        let tournament = new Population(TspGenetic.TOURNAMENT_SIZE, this._tourManager);
        for (let i = 0; i < TspGenetic.TOURNAMENT_SIZE; i++) {
            let randI = Number.randomInt(0, population.size - 1);
            tournament.saveTour(i, population.getTour(randI));
        }
        return tournament.getFittest();
    },

    _crossover: function (parent1, parent2) {
        let lo = Number.randomInt(0, this._tourManager.N - 1);
        let hi = Number.randomInt(0, this._tourManager.N - 1);
        [lo, hi] = [Math.min(lo, hi), Math.max(lo, hi)];

        let child = new Tour(this._tourManager);
        for (let i = lo; i <= hi; i++)
            child.setVertex(i, parent1.getVertex(i));

        let childI = 0;
        for (let i = 0; i < this._tourManager.N; i++) {
            let v = parent2.getVertex(i);
            if (!child.containsVertex(v)) {
                if (childI == lo)
                    childI = hi + 1;
                child.setVertex(childI, v);
                childI++;
            }
        }

        return child;
    },

    _mutate: function (tour) {
        //Fisher-Yates shuffle
        for (let i = this._tourManager.N - 1; i > 0; i--) {
            if (Math.random() < TspGenetic.MUTATION_RATE) {
                let j = Number.randomInt(0, i);

                let v1 = tour.getVertex(i);
                let v2 = tour.getVertex(j);
                tour.setVertex(i, v2);
                tour.setVertex(j, v1);
            }
        }
    }
};

//EXPORTS
module.exports.TourManager = TourManager;
module.exports.TspGenetic = TspGenetic;
module.exports.Population = Population;
module.exports.Tour = Tour;