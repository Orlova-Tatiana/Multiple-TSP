'use strict';

module.exports.range = (from, to) => {
    const len = Math.abs(from - to) + 1;
    const seq = new Array(len);
    const dir = to > from ? 1 : -1;

    let index = 0;
    for (let i = from; i !== to; i += dir) {
        seq[index++] = i;
    }
    seq[index++] = to;

    return seq;
};
