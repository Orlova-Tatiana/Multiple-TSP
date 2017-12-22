"use strict";
let Edge = require("./Edge");

function TspNodeBranch(path, reducedMatrix, cost, vertex) {
    this.path = path;
    this.reducedMatrix = reducedMatrix;
    this.cost = cost;
    this.vertex = vertex;

    Object.defineProperty(this, "level", {
        get: function () {
            return this.path.length;
        }
    });
}

TspNodeBranch.prototype = {
    clonePath: function () {
        return this.path.map(edge => edge.clone());
    },
    cloneMatrix: function () {
        return this.reducedMatrix.map(row => row.slice());
    },
    clone: function () {
        return new TspNodeBranch(this.clonePath(), this.cloneMatrix(), this.cost, this.vertex);
    }
};

function TspBranch(costMatrix) {
    costMatrix = cloneMatrix(costMatrix);
    const LENGTH = costMatrix.length;

    function cloneMatrix(matrix) {
        return matrix.map(row => row.slice());
    }

    function solve(startVertex = 0) {
        let initMatrix = cloneMatrix(costMatrix);
        let startCost = reduceMatrixAndCalculateCost(initMatrix);
        let nodes = [new TspNodeBranch([], initMatrix, startCost, startVertex)];

        while (nodes.length) {
            let curNode = findNodeWithLeastCost(nodes);
            nodes.splice(nodes.indexOf(curNode), 1);

            let from = curNode.vertex;
            if (curNode.level == LENGTH - 1) {
                if (curNode.reducedMatrix[from][startVertex] != Infinity) {
                    curNode.path.push(new Edge(from, startVertex));
                    return curNode;
                } else {
                    continue;
                }
            }

            for (let to = 0; to < LENGTH; to++) {
                if (curNode.reducedMatrix[from][to] != Infinity) {
                    let nextNode = newNode(curNode, from, to);
                    nodes.push(nextNode);
                }
            }
        }

        return new TspNodeBranch(null, null, Infinity, -1);
    }

    function findNodeWithLeastCost(nodes) {
        return nodes.reduce((prev, next) => (prev.cost < next.cost) ? prev : next);
    }

    function newNode(prevNode, from, to) {
        let node = prevNode.clone();

        node.path.push(new Edge(from, to));
        node.vertex = to;

        node.cost += node.reducedMatrix[from][to];
        visitEdge(node.reducedMatrix, from, to);
        node.cost += reduceMatrixAndCalculateCost(node.reducedMatrix);

        return node;
    }

    function visitEdge(matrix, from, to) {
        for (let k = 0; k < LENGTH; k++) {
            matrix[from][k] = Infinity;
            matrix[k][to] = Infinity;
        }
        matrix[to][from] = Infinity;
    }

    function reduceMatrixAndCalculateCost(matrix) {
        let cost = reduceRowsAndGetLowerBound(matrix);
        cost += reduceColumnsAndGetLowerBound(matrix);
        return cost;
    }

    function reduceRowsAndGetLowerBound(matrix) {
        let lowerBound = 0;
        for (let row of matrix) {
            let min = Math.min(...row);

            if (min != Infinity && min != 0) {
                lowerBound += min;
                row.forEach((value, i) => row[i] = value - min);
            }
        }

        return lowerBound;
    }

    function reduceColumnsAndGetLowerBound(matrix) {
        let lowerBound = 0;
        for (let j = 0; j < LENGTH; j++) {
            let min = Infinity;
            for (let i = 0; i < LENGTH; i++)
                min = Math.min(min, matrix[i][j]);

            if (min != Infinity && min != 0) {
                lowerBound += min;
                for (let i = 0; i < LENGTH; i++)
                    matrix[i][j] -= min;
            }
        }

        return lowerBound;
    }

    //API
    let solution = null;
    Object.defineProperty(this, "cost", {
        get: function () {
            if (solution == null)
                solution = solve();
            return solution.cost;
        }
    });
    Object.defineProperty(this, "path", {
        get: function () {
            if (solution == null)
                solution = solve();
            return solution.path == null ? null : solution.clonePath();
        }
    });
}

//EXPORT
module.exports = TspBranch;