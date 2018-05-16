'use strict';

export default {
    elitism: true,
    points: {
        values: [50, 100, 150, 200, 500, 1000],
        defaultValue: 50
    },
    population: {
        name: 'Популяция',
        min: 10,
        max: 200,
        value: 30
    },
    mutationRate: {
        name: 'Вероятность мутации',
        min: 0,
        max: 1,
        value: 0.015,
        step: 0.005
    },
    selection: {
        name: 'Селекция',
        options: [
            {value: 'tournament', text: 'Турнир'},
            {value: 'roulette', text: 'Рулетка'}
        ],
        value: 'tournament'
    },
    crossover: {
        name: 'Кроссовер',
        options: [
            {value: 'segment', text: 'Отрезками'},
            {value: 'random-half', text: 'Случайная половина'},
            {value: 'next-prev', text: 'Ближайший'}
        ],
        value: 'next-prev'
    },
    mutation: {
        name: 'Мутация',
        options: [
            {value: 'fisher-yates', text: 'Фишер – Йетс'},
            {value: 'reverse', text: 'Переворот'},
            {value: 'segment', text: 'Отрезками'}
        ],
        value: 'reverse'
    }
};
