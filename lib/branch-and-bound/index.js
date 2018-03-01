'use strict';

const TspBranchNode = require('./branch-node');
const Edge = require('./edge');
const {cloneMatrix} = require('../utils');

module.exports = class TspBranch {
    constructor(costMatrix) {
        this._costMatrix = cloneMatrix(costMatrix);
        this._LENGTH = costMatrix.length;

        this._defineAPI();
    }

    _defineAPI() {
        let solution = null;
        const getSolution = () => {
            if (solution === null) {
                solution = this.solve();
            }
            return solution;
        };

        Object.defineProperty(this, 'cost', {
            get: () => getSolution().cost
        });
        Object.defineProperty(this, 'path', {
            get: getSolution().path === null ? null : getSolution().clonePath()
        });
    }

    solve(startVertex = 0) {
        const initMatrix = cloneMatrix(this._costMatrix);
        const startCost = this._reduceMatrixAndCalculateCost(initMatrix);
        const nodes = [new TspBranchNode([], initMatrix, startCost, startVertex)];

        while (nodes.length) {
            const curNode = this._findNodeWithLeastCost(nodes);
            nodes.splice(nodes.indexOf(curNode), 1);

            const from = curNode.vertex;
            if (curNode.level === this._LENGTH - 1) {
                if (curNode.reducedMatrix[from][startVertex] !== Infinity) {
                    curNode.path.push(new Edge(from, startVertex));
                    return curNode;
                } else {
                    continue;
                }
            }

            for (let to = 0; to < this._LENGTH; to++) {
                if (curNode.reducedMatrix[from][to] !== Infinity) {
                    const nextNode = this._newNode(curNode, from, to);
                    nodes.push(nextNode);
                }
            }
        }

        return new TspBranchNode(null, null, Infinity, -1);
    }

    _findNodeWithLeastCost(nodes) {
        return nodes.reduce((prev, next) => (prev.cost < next.cost) ? prev : next);
    }

    _newNode(prevNode, from, to) {
        let node = prevNode.clone();

        node.path.push(new Edge(from, to));
        node.vertex = to;

        node.cost += node.reducedMatrix[from][to];
        this._visitEdge(node.reducedMatrix, from, to);
        node.cost += this._reduceMatrixAndCalculateCost(node.reducedMatrix);

        return node;
    }

    _visitEdge(matrix, from, to) {
        for (let k = 0; k < this._LENGTH; k++) {
            matrix[from][k] = Infinity;
            matrix[k][to] = Infinity;
        }
        matrix[to][from] = Infinity;
    }

    _reduceMatrixAndCalculateCost(matrix) {
        let cost = this._reduceRowsAndGetLowerBound(matrix);
        cost += this._reduceColumnsAndGetLowerBound(matrix);
        return cost;
    }

    _reduceRowsAndGetLowerBound(matrix) {
        let lowerBound = 0;
        for (let row of matrix) {
            let min = Math.min(...row);

            if (min !== Infinity && min !== 0) {
                lowerBound += min;
                row.forEach((value, i) => row[i] = value - min);
            }
        }

        return lowerBound;
    }

    _reduceColumnsAndGetLowerBound(matrix) {
        let lowerBound = 0;
        for (let j = 0; j < this._LENGTH; j++) {
            let min = Infinity;
            for (let i = 0; i < this._LENGTH; i++) {
                min = Math.min(min, matrix[i][j]);
            }

            if (min !== Infinity && min !== 0) {
                lowerBound += min;
                for (let i = 0; i < this._LENGTH; i++) {
                    matrix[i][j] -= min;
                }
            }
        }

        return lowerBound;
    }
};
