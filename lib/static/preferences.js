'use strict';

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
    getPoints: (size) => get(`${POINTS}-${size}`, null, JSON.parse),
    setPoints: (points) => set(`${POINTS}-${points.length}`, JSON.stringify(points)),

    getElitism: () => get(ELITISM, true, (v) => v === 'true'),
    setElitism: (elitism) => set(ELITISM, elitism),

    getPopulation: () => get(POPULATION, 30, Number.parseInt),
    setPopulation: (population) => set(POPULATION, population),

    getSelection: () => get(SELECTION, 'tournament'),
    setSelection: (selection) => set(SELECTION, selection),

    getCrossover: () => get(CROSSOVER, 'next-prev'),
    setCrossover: (crossover) => set(CROSSOVER, crossover),

    getMutation: () => get(MUTATION, 'reverse'),
    setMutation: (mutation) => set(MUTATION, mutation),

    getMutationRate: () => get(MUTATION_RATE, 0.015, Number.parseFloat),
    setMutationRate: (rate) => set(MUTATION_RATE, rate)
};
