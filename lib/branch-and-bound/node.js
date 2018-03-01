'use strict';

const {cloneMatrix} = require('../utils');

module.exports = class TspBranchNode {
    constructor(path, reducedMatrix, cost, vertex) {
        this.path = path;
        this.reducedMatrix = reducedMatrix;
        this.cost = cost;
        this.vertex = vertex;

        Object.defineProperty(this, 'level', {
            get: () => this.path.length
        });
    }

    clone() {
        return new TspBranchNode(this.clonePath(), cloneMatrix(this.reducedMatrix), this.cost, this.vertex);
    }

    clonePath() {
        return this.path.map(edge => edge.clone());
    }
};
