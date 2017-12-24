Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        let j = Number.randomInt(0, i);
        [this[i], this[j]] = [this[j], this[i]];
    }
};

Number.randomInt = function (min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

Number.prototype.round = function (precision) {
    return Math.round(this * Math.pow(10, precision)) / Math.pow(10, precision);
};