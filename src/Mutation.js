"use strict";

function FisherYatesMutationStrategy(mutationRate = 0.05) {
    this._mutationRate = mutationRate;
}

FisherYatesMutationStrategy.prototype.exec = function (tour) {
    //Fisher-Yates shuffle
    for (let i = tour.N - 1; i > 0; i--) {
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

function ReverseMutation() {
}

ReverseMutation.prototype.exec = function (tour) {
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

function SegmentMutation() {
}

SegmentMutation.prototype.exec = function (tour) {
    let lo, hi;
    do {
        lo = Number.randomInt(0, (tour.N - 1) >> 1);
        hi = Number.randomInt(0, tour.N - 1);
    } while (lo >= hi);

    let path = tour.getPath();
    let tourI = 0;
    for (let i = lo; i < hi; i++)
        tour.setVertex(tourI++, path[i]);
    for (let i = 0; i < lo; i++)
        tour.setVertex(tourI++, path[i]);
    for (let i = hi; i < tour.N; i++)
        tour.setVertex(tourI++, path[i]);
};