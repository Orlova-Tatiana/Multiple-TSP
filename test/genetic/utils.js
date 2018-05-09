'use strict';

module.exports.optionsGenerator = (options) => {
    const option = {};
    const keys = Object.keys(options);

    function* iterate(i) {
        if (i === keys.length) {
            yield option;
        } else {
            const key = keys[i];
            const values = options[key];
            for (let value of values) {
                option[key] = value;
                yield *iterate(i + 1);
            }
        }
    }

    return iterate(0);
};

module.exports.sumStats = (stats) => {
    const result = {};

    stats.forEach((stat) => {
        Object.keys(stat).forEach((key) => {
            if (key in result) {
                result[key] += stat[key];
            } else {
                result[key] = stat[key];
            }
        });
    });

    return result;
};

module.exports.averageStats = (stats) => {
    const result = module.exports.sumStats(stats);
    const count = stats.length;

    Object.keys(result).forEach((key) => {
        result[key] = Math.floor(result[key] / count);
    });

    return result;
};
