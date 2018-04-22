'use strict';

const {randomInt, createEmptyMatrix} = require('../../utils');

module.exports.printNumber = (number, precision = 3) => {
    const str = number.toString();
    const point = str.indexOf('.');
    const integer = point === -1 ? str : str.substring(0, point);

    if (precision === 0) {
        return integer;
    }

    const fracture = point === -1 ? '' : str.substr(point + 1, Math.min(precision, str.length - point - 1));
    const zeroes = '0'.repeat(precision - fracture.length);
    return integer + '.' + fracture + zeroes;
};

module.exports.generatePoints = (size, min = 1, max = 256, minY = min, maxY = max) => {
    const points = new Array(size);
    const set = new Set();

    for (let i = 0; i < size; i++) {
        const x = randomInt(min, max);
        const y = randomInt(minY, maxY);
        const point = {x: x, y: y};

        const str = JSON.stringify(point);
        if (set.has(str)) {
            i--;
            continue;
        }

        points[i] = point;
        set.add(str);
    }
    return points;
};

module.exports.convertToDistMatrix = (points) => {
    const n = points.length;
    const matrix = createEmptyMatrix(n);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = i === j ? 0 : distance(points[i], points[j]);
        }
    }

    return matrix;
};

function distance(p1, p2) {
    let x = p1.x - p2.x;
    let y = p1.y - p2.y;
    return Math.sqrt(x * x + y * y);
}
