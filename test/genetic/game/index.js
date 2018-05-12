'use strict';

const Game = require('../../../lib/genetic/game');
const Player = require('../../../lib/genetic/game/player');
const MatrixGenerator = require('../../../lib/branch-and-bound/matrix-generator');
const TourManager = require('../../../lib/genetic/tour/tour-manager');
const logger = require('./logger');

test();

function test() {
    const matrix = MatrixGenerator.generateNonInfSymmetricMatrix(20, 1, 100);
    const tourManager = new TourManager(matrix);

    const commonOptions = {
        evolveFirstStep: 1000,
        evolvePerStep: 10
    };
    const player1 = new Player(tourManager, Object.assign(commonOptions, {start: 0}));
    const player2 = new Player(tourManager, Object.assign(commonOptions, {start: 1}));
    const player3 = new Player(tourManager, Object.assign(commonOptions, {start: 2}));

    const game = new Game(tourManager, [player1, player2, player3]);
    logger(game);

    game.init();
    while (!game.isFinished) {
        game.doTurn();
    }
}
