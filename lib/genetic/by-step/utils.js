'use strict';

module.exports.reverse = (arr, from = 0, to = arr.length - 1) => {
    for (let i = from, j = to; i < j; i++, j--) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

module.exports.scrollTo = (arr, start) => {
    const index = arr.indexOf(start);
    return arr.slice(index).concat(arr.slice(0, index));
};
