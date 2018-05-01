'use strict';

import React from 'react';

import utils from '../modules/utils';

export default class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            iteration: 0,
            distance: 0,
            averageDistance: 0,
            newPaths: 0,
            withoutNewPaths: 0,
            repeatedPaths: 0
        };
        this._cache = {};
    }

    update(tsp) {
        this.setState({
            iteration: tsp.iteration(),
            distance: utils.printNumber(tsp.getBestTour().getDistance()),
            averageDistance: utils.printNumber(this._averageDistance(tsp)),
            newPaths: this._newPaths(tsp),
            withoutNewPaths: this._withoutNewPaths(tsp),
            repeatedPaths: this._repeatedPaths(tsp)
        });
    }

    _averageDistance(tsp) {
        if (this._cache.lastAverageUpdateTime && performance.now() - this._cache.lastAverageUpdateTime < 100) {
            return this._cache.lastAverageUpdateResult; //return every 100 ms
        }

        const population = tsp.getPopulation();
        let sum = 0;
        for (let i = 0; i < population.size; i++) {
            sum += population.getTour(i).getDistance();
        }

        const aver = sum / population.size;
        this._cache.lastAverageUpdateResult = aver;
        this._cache.lastAverageUpdateTime = performance.now();
        return aver;
    }

    _newPaths(tsp) {
        if (!this._cache.bestTour) {
            this._cache.newPaths = 0;
        }

        if (this._cache.bestTour !== tsp.getBestTour()) {
            this._cache.bestTour = tsp.getBestTour();
            this._cache.newPaths++;
        }
        return this._cache.newPaths;
    }

    _withoutNewPaths(tsp) {
        if (!this._cache.bestTour2 || this._cache.bestTour2 !== tsp.getBestTour()) {
            this._cache.bestTour2 = tsp.getBestTour();
            this._cache.lastStableIter = tsp.iteration();
        }

        return tsp.iteration() - this._cache.lastStableIter;
    }

    _repeatedPaths(tsp) {
        if (this._cache.lastRepeatedUpdateTime && performance.now() - this._cache.lastRepeatedUpdateTime < 100) {
            return this._cache.repeatedCount; //return every 100 ms
        }

        const population = tsp.getPopulation();
        const set = new Set();

        for (let i = 0; i < population.size; i++) {
            let tour = population.getTour(i);
            set.add(tour.toString());
        }

        const same = population.size - set.size;
        this._cache.repeatedCount = same;
        this._cache.lastRepeatedUpdateTime = performance.now();
        return same;
    }

    render() {
        const {iteration, distance, averageDistance, newPaths, withoutNewPaths, repeatedPaths} = this.state;
        const stats = [
            {name: 'Итерация', value: iteration},
            {name: 'Расстояние', value: distance},
            {name: 'Среднее расстояние', value: averageDistance},
            {name: 'Новых путей', value: newPaths},
            {name: 'Без новых путей', value: withoutNewPaths},
            {name: 'Повторяющихся путей', value: repeatedPaths}
        ];

        return stats.map(({name, value}) => {
            return (
                <div className="row" key={name}>
                    <label>
                        <b>{name}</b>: {value}
                    </label>
                </div>
            );
        });
    }
}
