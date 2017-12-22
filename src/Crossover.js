"use strict";

function CrossoverSegmentStrategy() {

}

CrossoverSegmentStrategy.prototype.exec = function (parent1, parent2, tourManager) {
    let lo = Number.randomInt(0, tourManager.N - 1);
    let hi = Number.randomInt(0, tourManager.N - 1);
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
};

function CrossoverRandomHalfStrategy() {

}

CrossoverRandomHalfStrategy.prototype.exec = function (parent1, parent2, tourManager) {
    let child = new Tour(tourManager);

    for (let i = 0; i < tourManager.N; i++) {
        if (Math.random() < 0.5)
            child.setVertex(i, parent1.getVertex(i));
    }

    let childI = 0;
    for (let i = 0; i < tourManager.N; i++) {
        let v = parent2.getVertex(i);
        if (!child.containsVertex(v)) {
            while (child.getVertex(childI) !== undefined)
                childI++;
            child.setVertex(childI, v);
        }
    }

    return child;
};