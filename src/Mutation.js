"use strict";

function FisherYatesMutationStrategy(mutationRate = 0.015) {
    this._mutationRate = mutationRate;
}

FisherYatesMutationStrategy.prototype.exec = function (tour) {
    //Fisher-Yates shuffle
    for (let i = tour.N; i > 0; i--) {
        if (Math.random() < this._mutationRate) {
            let j = Number.randomInt(0, i);
            this._swap(tour, i, j);
        }
    }
};

FisherYatesMutationStrategy.prototype._swap = function (tour, i, j) {
    let v1 = tour.getVertex(i);
    let v2 = tour.getVertex(j);
    tour.setVertex(i, v2);
    tour.setVertex(j, v1);
};

function NoMutationStrategy() {

}

NoMutationStrategy.prototype.exec = function () {
    //does nothing
};

function ReverseMutation(mutationRate = 0.015) {
    this._mutationRate = mutationRate;
}

ReverseMutation.prototype.exec = function (tour) {
    if (Math.random() < this._mutationRate)
        this._mutate(tour);
};

ReverseMutation.prototype._mutate = function (tour) {
    let lo, hi;
    do {
        lo = Number.randomInt(0, tour.N - 3);
        hi = Number.randomInt(2, tour.N - 1);
    } while (lo >= hi);

    for (let i = lo, j = hi; i < j; i++, j--) {
        this._swap(tour, i, j);
    }
};

ReverseMutation.prototype._swap = function (tour, i, j) {
    let v1 = tour.getVertex(i);
    let v2 = tour.getVertex(j);
    tour.setVertex(i, v2);
    tour.setVertex(j, v1);
};