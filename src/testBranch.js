"use strict";
let Edge = require("./Edge");
let TspBranch = require("./TspBranch");
let MatrixGenerator = require("./MatrixGenerator");

function measureTime(func) {

    function clock(start) {
        if (!start) return process.hrtime();
        let end = process.hrtime(start);
        return Math.round((end[0] * 1000) + (end[1] / 1000000));
    }

    return {
        test: function () {
            let start = clock();
            func.apply(this, arguments);
            let time = clock(start);
            console.log("Overall time is", time, "ms");
        }
    }
}

let timer = measureTime(function () {
    let matrix = MatrixGenerator.generateNonInfMatrix.apply(this, arguments);
    console.log(matrix);
    let tsp = new TspBranch(matrix);
    console.log(tsp.cost);
    console.log(tsp.path == null ? null : tsp.path.join(","));
});

timer.test(10, 1, 256);