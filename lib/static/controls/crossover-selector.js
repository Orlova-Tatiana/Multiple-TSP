'use strict';

const Selector = require('./selector');
const CrossoverFactory = require('../../genetic/crossover-factory');
const Preferences = require('../preferences');

const NAME = 'Crossover';
const OPTIONS = [
    {value: 'segment', text: 'Segment'},
    {value: 'random-half', text: 'Random Half'},
    {value: 'next-prev', text: 'Previous/Next'}
];

module.exports = class CrossoverSelector {
    constructor() {
        this._selector = new Selector(NAME, OPTIONS);
        this._crossover = Preferences.getCrossover();
        this._init();
    }

    _init() {
        const select = this._selector.select;
        select.val(this._crossover);
        select.on('change', () => {
            this._crossover = select.val();
            Preferences.setCrossover(this._crossover);
        });
    }

    setup(tsp) {
        tsp.setCrossover(CrossoverFactory.create(this._crossover));
    }

    get root() {
        return this._selector.root;
    }
};
