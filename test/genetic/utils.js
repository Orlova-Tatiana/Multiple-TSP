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
