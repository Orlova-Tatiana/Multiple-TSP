'use strict';

const PriorityQueue = require('priorityqueuejs');

const PlayerTour = require('./player-tour');
const PlayerEmitter = require('./player-emitter');
const {range} = require('./utils');

module.exports = class Game {
    constructor(tourManager, players) {
        this._tourManager = tourManager;
        this._players = players;
        this._tours = players.map(() => new PlayerTour(tourManager));
        this._verticies = {
            empty: new Set(range(0, tourManager.N - 1)),
            visited: new Set()
        };
        this._queue = new PriorityQueue((p1, p2) => p2.time - p1.time);
        this._emitter = new PlayerEmitter(players);
        this._finished = false;
    }

    init() {
        this._players.forEach((player, index) => {
            const vertex = player.doInit();
            const queueObject = {
                time: 0,
                index: index + 1,
                player,
                tour: this._tours[index]
            };

            if (this._validateVertexSoft(queueObject, vertex)) {
                this._addVertex(queueObject, vertex);
                this._queue.enq(queueObject);
                this._emitter.postpone(player, vertex);

                console.log(`Стартовая вершина игрока №${index + 1}: ${vertex}`);
            }
        });

        this._emitter.notify();
    }

    doTurn() {
        if (this.isFinished) {
            return;
        }

        const queueObject = this._queue.deq();
        const {player, tour} = queueObject;
        const vertex = player.doTurn();

        if (this._validateVertex(queueObject, vertex)) {
            this._addVertex(queueObject, vertex);
            queueObject.time = tour.distance;
            this._queue.enq(queueObject);
            this._emitter.notify(player, vertex);

            console.log(`Игрок №${queueObject.index} выбрал вершину ${vertex}, придёт в нее в ${queueObject.time} минут`);
        }

        if (this._verticies.empty.size === 0) {
            console.log('Конец игры!');
            this._finish();
            return;
        }
        if (this._queue.isEmpty()) {
            console.log('Все игроки выбыли! Конец игры!');
            this._finish();
        }
    }

    _finish() {
        this._finished = true;

        while (this._queue.size() !== 0) {
            const queueObject = this._queue.deq();
            queueObject.tour.finish();
            this._logPlayerResult(queueObject);
        }
    }

    _logPlayerResult({index, tour}) {
        console.log(`Результаты игрока №${index}:`);
        console.log(`Пройденный путь: ${tour.toString()}`);
        console.log(`Пройденное расстояние: ${tour.distance}`);
        console.log('----------------------------------');
    }

    get isFinished() {
        return this._finished;
    }

    _addVertex({tour}, v) {
        this._verticies.empty.delete(v);
        this._verticies.visited.add(v);
        tour.addVertex(v);
    }

    _validateVertexSoft({index}, v) {
        if (!Number.isInteger(v) || v < 0 || v >= this._tourManager.N) {
            console.log(`Игрок №${index} вернул неверный номер вершины и отстранён от игры!`);
            return false;
        }
        return true;
    }

    _validateVertex({index}, v) {
        if (!this._validateVertexSoft({index}, v)) {
            return false;
        }

        if (!this._verticies.empty.has(v)) {
            console.log(`Игрок №${index} вернул вершину №${v}, которая уже была посещена, и остранён от игры!`);
            return false;
        }
        return true;
    }
};
