"use strict";

function TournamentStrategy(tournamentSize = 5) {
    this._tournamentSize = tournamentSize;
}

TournamentStrategy.prototype.exec = function (population, tourManager) {
    let tournament = new Population(this._tournamentSize, tourManager);
    for (let i = 0; i < this._tournamentSize; i++) {
        let randI = Number.randomInt(0, population.size - 1);
        tournament.saveTour(i, population.getTour(randI));
    }
    return tournament.getFittest();
};

function RouletteStrategy() {
    this._wheel = null;
    this._population = null;
}

RouletteStrategy.prototype._getWheel = function (population) {
    if (this._population === population)
        return this._wheel;

    let wheel = new Array(population.size);
    wheel[0] = population.getTour(0).getFitness();
    for (let i = 1; i < population.size; i++)
        wheel[i] = wheel[i - 1] + population.getTour(i).getFitness();

    this._wheel = wheel;
    this._population = population;
    return wheel;
};

RouletteStrategy.prototype.exec = function (population) {
    let wheel = this._getWheel(population);

    let max = wheel[population.size - 1];
    let rand = Math.random() * max;

    let i = 0;
    while (wheel[i] < rand) {
        i++;
    }

    return population.getTour(i);
};