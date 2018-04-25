'use strict';

import globalOptions from './globalOptions';

const PREFIX = 'tanysha-tsp-';
const POINTS = `${PREFIX}points`;
const ELITISM = `${PREFIX}elitism`;
const POPULATION = `${PREFIX}population`;
const SELECTION = `${PREFIX}selection`;
const CROSSOVER = `${PREFIX}crossover`;
const MUTATION = `${PREFIX}mutation`;
const MUTATION_RATE = `${PREFIX}mutation_rate`;

function get(key, defaultValue, parse) {
    const value = localStorage.getItem(key);
    if (value) {
        return parse ? parse(value) : value;
    }
    return defaultValue;
}

function set(key, value) {
    localStorage.setItem(key, value);
}

module.exports = {
    getPoints: () => get(POINTS, null, JSON.parse),
    setPoints: (points) => set(POINTS, JSON.stringify(points)),

    getElitism: () => get(ELITISM, globalOptions.elitism, (v) => v === 'true'),
    setElitism: (elitism) => set(ELITISM, elitism),

    getPopulation: () => get(POPULATION, globalOptions.population.value, Number.parseInt),
    setPopulation: (population) => set(POPULATION, population),

    getSelection: () => get(SELECTION, globalOptions.selection.value),
    setSelection: (selection) => set(SELECTION, selection),

    getCrossover: () => get(CROSSOVER, globalOptions.crossover.value),
    setCrossover: (crossover) => set(CROSSOVER, crossover),

    getMutation: () => get(MUTATION, globalOptions.mutation.value),
    setMutation: (mutation) => set(MUTATION, mutation),

    getMutationRate: () => get(MUTATION_RATE, globalOptions.mutationRate.value, Number.parseFloat),
    setMutationRate: (rate) => set(MUTATION_RATE, rate)
};
