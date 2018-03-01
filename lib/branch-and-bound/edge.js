'use strict';

module.exports = class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    clone() {
        return new Edge(this.from, this.to);
    }

    toString() {
        return `(${this.from}, ${this.to})`;
    }
};
