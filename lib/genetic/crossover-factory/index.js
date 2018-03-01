'use strict';

module.exports = {
    create: (name) => {
        const CrossoverStrategy = require(`./${name}`);
        return new CrossoverStrategy();
    }
};
