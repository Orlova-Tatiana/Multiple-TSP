'use strict';

const {printNumber} = require('../../../lib/react/modules/utils');

module.exports = (game) => {
    game.on('init', ({index, vertex}) => {
        console.log(`Стартовая вершина игрока №${index + 1}: ${vertex}`);
    });

    game.on('turn', ({index, next, nextTime}) => {
        console.log(`Игрок №${index + 1} выбрал вершину ${next}, придёт в нее в ${printNumber(nextTime, 2)}`);
    });

    game.on('disqualify', ({state, index, next}) => {
        switch (state) {
            case 'init':
                console.log(`Игрок №${index + 1} вернул неверный номер вершины: ${next} и отстранён от игры!`);
                return;
            case 'turn':
                console.log(`Игрок №${index + 1} вернул вершину №${next}, которая уже была посещена, и остранён от игры!`);
        }
    });

    game.on('result', ({index, tour}) => {
        console.log(`Результаты игрока №${index + 1}:`);
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
