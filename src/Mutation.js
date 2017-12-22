"use strict";

function FisherYatesMutationStrategy(mutationRate = 0.015) {
    this._mutationRate = mutationRate;
}

FisherYatesMutationStrategy.prototype.exec = function (tour, tourManager) {
    //Fisher-Yates shuffle
    for (let i = tourManager.N - 1; i > 0; i--) {
        if (Math.random() < this._mutationRate) {
            let j = Number.randomInt(0, i);

            let v1 = tour.getVertex(i);
            let v2 = tour.getVertex(j);
            tour.setVertex(i, v2);
            tour.setVertex(j, v1);
        }
    }
};

function NoMutationStrategy() {

}

NoMutationStrategy.prototype.exec = function () {
    //does nothing
};