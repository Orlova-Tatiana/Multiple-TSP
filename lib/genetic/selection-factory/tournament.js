'use strict';

const Population = require('../population');
const {randomInt} = require('../../utils');

module.exports = class TournamentSelectionStrategy {
    constructor(tournamentSize = 5) {
        this._tournamentSize = tournamentSize;
    }

    exec(population, tourManager) {
        let tournament = new Population(this._tournamentSize, tourManager);
        for (let i = 0; i < this._tournamentSize; i++) {
            let randI = randomInt(0, population.size - 1);
            tournament.saveTour(i, population.getTour(randI));
        }
        return tournament.getFittest();
    }
};
