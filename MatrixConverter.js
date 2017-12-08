"use strict";

function MatrixConverter() {
}

MatrixConverter._distance = function (p1, p2) {
    let x = p1.x - p2.x;
    let y = p1.y - p2.y;
    return Math.sqrt(x * x + y * y);
};

MatrixConverter.toDistMatrix = function (points) {
    let n = points.length;
    let matrix = new Array(n).fill(0).map(_ => new Array(n));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = i == j ? 0 : MatrixConverter._distance(points[i], points[j]);
        }
    }

    return matrix;
};

module.exports = MatrixConverter;