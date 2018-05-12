'use strict';

const {printNumber} = require('../../../lib/react/modules/utils');

module.exports = (game) => {
    game.on('init', ({index, vertex}) => {
        console.log(`Стартовая вершина игрока №${index}: ${vertex}`);
    });

    game.on('turn', ({index, vertex, time}) => {
        console.log(`Игрок №${index} выбрал вершину ${vertex}, придёт в нее в ${printNumber(time, 2)}`);
    });

    game.on('disqualify', ({state, index, vertex}) => {
        switch (state) {
            case 'init':
                console.log(`Игрок №${index} вернул неверный номер вершины и отстранён от игры!`);
                return;
            case 'turn':
                console.log(`Игрок №${index} вернул вершину №${vertex}, которая уже была посещена, и остранён от игры!`);
        }
    });

    game.on('result', ({index, tour}) => {
        console.log(`Результаты игрока №${index}:`);
        console.log(`Пройденный путь: ${tour.toString()}`);
        console.log(`Пройденное расстояние: ${printNumber(tour.distance, 2)}`);
        console.log('----------------------------------');
    });

    game.on('end', ({success}) => {
        success ?
            console.log('Конец игры!') :
            console.log('Все игроки выбыли! Конец игры!');
    });
};
