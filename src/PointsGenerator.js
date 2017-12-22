"use strict";

function PointsGenerator() {
}

PointsGenerator.generate = function (size, min = 1, max = 256, minY = min, maxY = max) {
    let points = new Array(size);
    let set = new Set();

    for (let i = 0; i < size; i++) {
        let x = Number.randomInt(min, max);
        let y = Number.randomInt(minY, maxY);
        let point = {x: x, y: y};

        let str = JSON.stringify(point);
        if (set.has(str)) {
            i--;
            continue;
        }

        points[i] = point;
        set.add(str);
    }
    return points;
};