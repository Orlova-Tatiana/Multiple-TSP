'use strict';

const Game = require('../../../lib/genetic/game');
const Player = require('../../../lib/genetic/game/player');
const TourManager = require('../../../lib/genetic/tour/tour-manager');
const Tsp = require('../../../lib/genetic');
const Selection = require('../../../lib/genetic/selection-factory/tournament');
const Crossover = require('../../../lib/genetic/crossover-factory/next-prev');
const Mutation = require('../../../lib/genetic/mutation-factory/fisher-yates');
const utils = require('../../../lib/react/modules/utils');

test();

function test() {
    const points = utils.generatePoints(100, 1, 100);
    const matrix = utils.convertToDistMatrix(points);
    const tourManager = new TourManager(matrix);

    const game = runMultiple(tourManager);

    runTsp(tourManager, 'TSP for all points');

    for (let i = 0; i < game.playersCount; i++) {
        const tour = game.getTour(i);
        const playerPoints = slice(points, tour.path);
        const matrix = utils.convertToDistMatrix(playerPoints);
        const tourManager = new TourManager(matrix);

        runTsp(tourManager, `TSP for Player ${i + 1} points`);
    }
}

function runMultiple(tourManager) {
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

    return game;
}

function runTsp(tourManager, message) {
    const tsp = new Tsp(tourManager);
    tsp.setCrossover(new Crossover());
    tsp.setSelection(new Selection());
    tsp.setMutation(new Mutation());

    let iterations = 500;
    while (iterations-- !== 0) {
        tsp.evolve();
    }

    console.log(`${message}:`, tsp.getBestTour().getDistance());
}

function slice(arr, indecies) {
    const newArr = [];
    indecies.forEach((index) => newArr.push(arr[index]));
    return newArr;
}
