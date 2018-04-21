'use strict';

const Selector = require('./selector');
const SelectionFactory = require('../../genetic/selection-factory');
const Preferences = require('../preferences');

const NAME = 'Selection';
const OPTIONS = [
    {value: 'tournament', text: 'Tournament'},
    {value: 'roulette', text: 'Roulette'}
];

module.exports = class SelectionSelector {
    constructor() {
        this._selector = new Selector(NAME, OPTIONS);
        this._selection = Preferences.getSelection();
        this._init();
    }

    _init() {
        const select = this._selector.select;
        select.val(this._selection);
        select.on('change', () => {
            this._selection = select.val();
            Preferences.setSelection(this._selection);
        });
    }

    setup(tsp) {
        tsp.setSelection(SelectionFactory.create(this._selection));
    }

    get root() {
        return this._selector.root;
    }
};
