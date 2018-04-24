'use strict';

module.exports.shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = module.exports.randomInt(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports.randomInt = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

module.exports.createEmptyMatrix = (size) => {
    return new Array(size).fill(0).map(() => new Array(size));
};

module.exports.cloneMatrix = (matrix) => {
    return matrix.map(row => row.slice());
};

module.exports.arrayEqual = (arr1, arr2) => {
    if (arr1 === arr2) {
        return true;
    }
    if (!arr1 && !arr2) {
        return true;
    }
    if (!arr1 || !arr2) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};
