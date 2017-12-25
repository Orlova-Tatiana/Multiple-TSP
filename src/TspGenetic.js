"use strict";

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

    Object.defineProperty(this, "N", {
        get: function () {
            return this._tour.length;
        }
    });
}

Tour.prototype = {
    generateTour: function () {
        for (let i = 0; i < this.N; i++)
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
            for (let i = 0; i < this.N - 1; i++)
                this._distance += this._tourManager.distance(this._tour[i], this._tour[i + 1]);
            this._distance += this._tourManager.distance(this._tour[this.N - 1], this._tour[0]);
        }
        return this._distance;
    },

    getPath: function () {
        return this._tour.slice();
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

function TspGenetic(tourManager, options = {elitism: true, populationSize: 30, mutationRate: 0.15}) {
    this._elitism = options.elitism;
    this._mutationRate = options.mutationRate;

    this._tourManager = tourManager;
    this._population = this._generatePopulation(options.populationSize);
    this._bestTour = this._population.getFittest();

    this._iter = 0;
    this._mutationCount = 0;

    this._selectionStrategy = null;
    this._crossoverStrategy = null;
    this._mutationStrategy = null;
}

TspGenetic.prototype = {
    _generatePopulation: function (size) {
        return new Population(size, this._tourManager)._generatePopulation();
    },

    evolve: function () {
        this._population = this._evolvePopulation(this._population);
        this._iter++;
    },

    _evolvePopulation: function (population) {
        let newPopulation = new Population(population.size, this._tourManager);

        let offset = 0;
        if (this._elitism) {
            newPopulation.saveTour(0, population.getFittest());
            offset = 1;
        }

        for (let i = offset; i < population.size; i++)
            newPopulation.saveTour(i, this._selection(population));

        let queue = this._randomInterval(population.size);
        for (let i = 0; i < queue.length - 1; i += 2) {
            let parent1 = newPopulation.getTour(queue[i]);
            let parent2 = newPopulation.getTour(queue[i + 1]);
            let children = this._crossover(parent1, parent2);
            newPopulation.saveTour(queue[i], children[0]);
            newPopulation.saveTour(queue[i + 1], children[1]);
        }

        for (let i = offset; i < newPopulation.size; i++)
            this._mutate(newPopulation.getTour(i));

        this._saveBestTour(newPopulation.getFittest());
        return newPopulation;
    },

    _randomInterval: function (n) {
        let arr = new Array(n);
        for (let i = 0; i < n; i++)
            arr[i] = i;
        arr.shuffle();
        return arr;
    },

    _selection: function (population) {
        return this._selectionStrategy.exec(population, this._tourManager);
    },

    _crossover: function (parent1, parent2) {
        return this._crossoverStrategy.exec(parent1, parent2, this._tourManager);
    },

    _mutate: function (tour) {
        if (Math.random() < this._mutationRate) {
            this._mutationStrategy.exec(tour);
            this._mutationCount++;
        }
    },

    setSelection: function (strategy) {
        this._selectionStrategy = strategy;
    },

    setCrossover: function (strategy) {
        this._crossoverStrategy = strategy;
    },

    setMutation: function (strategy) {
        this._mutationStrategy = strategy;
    },

    _saveBestTour: function (tour) {
        if (tour.getDistance() < this._bestTour.getDistance())
            this._bestTour = tour;
    },

    getPopulation: function () {
        return this._population;
    },

    getBestTour: function () {
        return this._bestTour;
    },

    getTourManager: function () {
        return this._tourManager;
    },

    iteration: function () {
        return this._iter;
    },

    mutationCount: function () {
        return this._mutationCount;
    }
};