'use strict';

export default {
    points: {
        values: [10, 50, 100, 150, 200, 500, 1000],
        defaultValue: 50
    },
    players: {
        name: 'Players',
        min: 2,
        max: 5,
        value: 2,
        colors: [
            '#A90003',
            '#129A00',
            '#0001E8',
            '#A9009E',
            '#FFA700'
        ]
    },
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
        value: 0.2,
        step: 0.005
    },
    evolveFirstStep: {
        name: 'Evolve first step',
        min: 1,
        max: 1000,
        value: 50
    },
    evolvePerStep: {
        name: 'Evolve per step',
        min: 1,
        max: 20,
        value: 10
    }
};
