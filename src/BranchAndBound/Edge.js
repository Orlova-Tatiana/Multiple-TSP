"use strict";

function Edge(from, to) {
    this.from = from;
    this.to = to;

    this.clone = function () {
        return new Edge(from, to);
    };

    this.toString = function () {
        return `(${this.from}, ${this.to})`;
    }
}

module.exports = Edge;