'use strict';

export default {
    elitism: true,
    population: {
        name: 'Population',
        min: 10,
        max: 200,
        value: 30
    },
    mutationRate: {
        name: 'Mutation rate',
        min: 0,
        max: 1,
        value: 0.015,
        step: 0.005
    },
    selection: {
        name: 'Selection',
        options: [
            {value: 'tournament', text: 'Tournament'},
            {value: 'roulette', text: 'Roulette'}
        ],
        value: 'tournament'
    },
    crossover: {
        name: 'Crossover',
        options: [
            {value: 'segment', text: 'Segment'},
            {value: 'random-half', text: 'Random Half'},
            {value: 'next-prev', text: 'Previous/Next'}
        ],
        value: 'next-prev'
    },
    mutation: {
        name: 'Mutation',
        options: [
            {value: 'fisher-yates', text: 'Fisher Yates'},
            {value: 'reverse', text: 'Reverse'},
            {value: 'segment', text: 'Segment'}
        ],
        value: 'reverse'
    }
};
