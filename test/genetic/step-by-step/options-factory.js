'use strict';

module.exports.default = () => {
    return {
        populationSize: [30, 50, 100, 150, 200],
        mutationRate: [0.015],
        evolveFirstStep: [50, 100, 300, 500],
        evolvePerStep: [1, 2, 5, 10],
        tournamentSize: [5]
    };
};

module.exports.mutation = () => {
    return {
        populationSize: [150],
        mutationRate: [0.015, 0.05, 0.1, 0.2],
        evolveFirstStep: [300],
        evolvePerStep: [2],
        tournamentSize: [5],
        fisherYatesMutationRate: [0.05, 0.1, 0.2, 0.5]
    };
};
