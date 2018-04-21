'use strict';

const Selector = require('./selector');
const MutationFactory = require('../../genetic/mutation-factory');
const Preferences = require('../preferences');

const NAME = 'Mutation';
const OPTIONS = [
    {value: 'fisher-yates', text: 'Fisher Yates'},
    {value: 'reverse', text: 'Reverse'},
    {value: 'segment', text: 'Segment'}
];

module.exports = class MutationSelector {
    constructor() {
        this._selector = new Selector(NAME, OPTIONS);
        this._mutation = Preferences.getMutation();
        this._init();
    }

    _init() {
        const select = this._selector.select;
        select.val(this._mutation);
        select.on('change', () => {
            this._mutation = select.val();
            Preferences.setMutation(this._mutation);
        });
    }

    setup(tsp) {
        tsp.setMutation(MutationFactory.create(this._mutation));
    }

    get root() {
        return this._selector.root;
    }
};
