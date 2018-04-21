'use strict';

const $ = require('jquery');

module.exports = class Selector {
    constructor(name, options) {
        this._name = name;
        this._options = options;

        this._elem = this._render();
    }

    get root() {
        return this._elem;
    }

    get select() {
        return this._elem.find('select');
    }

    _render() {
        return $('<div>')
            .addClass('form-group')
            .append(
                $('<legend>')
                    .text(this._name)
            )
            .append(
                $('<select>')
                    .addClass('form-control')
                    .append(this._renderOptions())
            );
    }

    _renderOptions() {
        return this._options.map((option) => {
            return $('<option>')
                .val(option.value)
                .text(option.text);
        });
    }
};
