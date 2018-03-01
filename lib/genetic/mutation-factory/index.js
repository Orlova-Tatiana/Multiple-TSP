'use strict';

module.exports = {
    create: (name) => {
        const MutationStrategy = require(`./${name}`);
        return new MutationStrategy();
    }
};
