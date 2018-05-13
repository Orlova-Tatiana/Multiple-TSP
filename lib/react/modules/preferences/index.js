'use strict';

module.exports.get = (key, defaultValue, parse) => {
    const value = localStorage.getItem(key);
    if (value) {
        return parse ? parse(value) : value;
    }
    return defaultValue;
};

module.exports.set = (key, value) => {
    localStorage.setItem(key, value);
};
