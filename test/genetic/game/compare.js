'use strict';

const Game = require('../../../lib/genetic/game');
const Player = require('../../../lib/genetic/game/player');
const MatrixGenerator = require('../../../lib/branch-and-bound/matrix-generator');
const TourManager = require('../../../lib/genetic/tour/tour-manager');
const Tsp = require('../../../lib/genetic');
const Selection = require('../../../lib/genetic/selection-factory/tournament');
const Crossover = require('../../../lib/genetic/crossover-factory/next-prev');
const Mutation = require('../../../lib/genetic/mutation-factory/fisher-yates');

test();

function test() {
    const matrix = MatrixGenerator.generateNonInfSymmetricMatrix(100, 1, 100);
    const tourManager = new TourManager(matrix);

    const commonOptions = {
        evolveFirstStep: 500,
        evolvePerStep: 10
    };
    const player1 = new Player(tourManager, Object.assign(commonOptions, {start: 0}));
    const player2 = new Player(tourManager, Object.assign(commonOptions, {start: 1}));

    const game = new Game(tourManager, [player1, player2]);

    game.init();
    while (!game.isFinished) {
        game.doTurn();
    }

    runTsp(tourManager);
}

function runTsp(tourManager) {
    const tsp = new Tsp(tourManager);
    tsp.setCrossover(new Crossover());
    tsp.setSelection(new Selection());
    tsp.setMutation(new Mutation());

    let iterations = 1000;
    while (iterations-- !== 0) {
        tsp.evolve();
    }

    console.log('TSP', tsp.getBestTour().getDistance());
}
