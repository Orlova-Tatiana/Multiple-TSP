'use strict';

module.exports = {
    create: (name) => {
        const SelectionStrategy = require(`./${name}`);
        return new SelectionStrategy();
    }
};
