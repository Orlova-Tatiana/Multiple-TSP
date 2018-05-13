'use strict';

import globalOptions from '../global-options/multiple-tsp';
import {set, get} from './index';

const PREFIX = 'tanysha-multiple-tsp-';
const POINTS = `${PREFIX}points`;
const PLAYERS = `${PREFIX}players`;
const POPULATION = `${PREFIX}population`;
const MUTATION_RATE = `${PREFIX}mutation_rate`;

module.exports = {
    getPoints: () => get(POINTS, null, JSON.parse),
    setPoints: (points) => set(POINTS, JSON.stringify(points)),

    getPlayers: () => get(PLAYERS, globalOptions.players.value, Number.parseInt),
    setPlayers: (players) => set(PLAYERS, players),

    getPopulation: () => get(POPULATION, globalOptions.population.value, Number.parseInt),
    setPopulation: (population) => set(POPULATION, population),

    getMutationRate: () => get(MUTATION_RATE, globalOptions.mutationRate.value, Number.parseFloat),
    setMutationRate: (rate) => set(MUTATION_RATE, rate)
};
