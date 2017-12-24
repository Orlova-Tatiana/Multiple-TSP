"use strict";

function SegmentCrossoverStrategy() {

}

SegmentCrossoverStrategy.prototype.exec = function (parent1, parent2, tourManager) {
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

function RandomHalfCrossoverStrategy() {

}

RandomHalfCrossoverStrategy.prototype.exec = function (parent1, parent2, tourManager) {
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

function NextCrossoverStrategy() {

}

NextCrossoverStrategy.prototype.exec = function (parent1, parent2, tourManager) {
    let child = new Tour(tourManager);
    let path1 = parent1.getPath();
    let path2 = parent2.getPath();

    let c = Number.randomInt(0, tourManager.N - 1);
    let childI = 0;
    child.setVertex(childI++, c);

    while (path1.length > 1) {
        let v1 = this._next(path1, c);
        let v2 = this._next(path2, c);
        this._remove(path1, c);
        this._remove(path2, c);
        c = tourManager.distance(c, v1) < tourManager.distance(c, v2) ? v1 : v2;

        child.setVertex(childI++, c);
    }

    return child;
};

NextCrossoverStrategy.prototype._next = function (arr, value) {
    let i = arr.indexOf(value);
    if (i == -1)
        return -1;
    return arr[(i + 1) % arr.length];
};

NextCrossoverStrategy.prototype._remove = function (arr, value) {
    arr.splice(arr.indexOf(value), 1);
};