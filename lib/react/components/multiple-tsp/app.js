'use strict';

import React from 'react';
import Header from '../header';
import GraphCanvas from './graph-canvas';
import PointsGroup from '../points-group';
import Slider from '../slider';
import OptionsInfo from '../options-info';
import utils from '../../modules/utils';
import globalOptions from '../../modules/global-options/multiple-tsp';
import Preferences from '../../modules/preferences/multiple-tsp';

import TourManager from '../../../genetic/tour/tour-manager';
import Game from '../../../genetic/game';
import Player from '../../../genetic/game/player';

export default class App extends React.Component {
    constructor() {
        super();
        this.onPointsChanged = this.onPointsChanged.bind(this);
        this.onPlayersChanged = this.onPlayersChanged.bind(this);
        this.onPopulationChanged = this.onPopulationChanged.bind(this);
        this.onMutationRateChanged = this.onMutationRateChanged.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNext = this.onNext.bind(this);

        const {points} = globalOptions;
        this.state = {
            points: Preferences.getPoints() || this._generatePoints(points.defaultValue),
            players: Preferences.getPlayers(),
            population: Preferences.getPopulation(),
            mutationRate: Preferences.getMutationRate(),
            inited: false
        };

        this.canvas = React.createRef();
    }

    _generatePoints(size) {
        const points = utils.generatePoints(size, 5, 800 - 5, 5, 600 - 5);
        Preferences.setPoints(points);
        return points;
    }

    onPointsChanged(size) {
        this.setState({points: this._generatePoints(size)});
    }

    onPlayersChanged(players) {
        Preferences.setPlayers(players);
        this.setState({players});
    }

    onPopulationChanged(population) {
        Preferences.setPopulation(population);
        this.setState({population});
    }

    onMutationRateChanged(mutationRate) {
        Preferences.setMutationRate(mutationRate);
        this.setState({mutationRate});
    }

    onStart() {
        this._game = this._prepareGame();
        this.canvas.current.setGame(this._game);
        this._game.init();

        this.setState({inited: true});
    }

    onNext() {
        if (!this._game.isFinished) {
            this._game.doTurn();
        }
    }

    onReset() {
        this._game = null;
        this.canvas.current.drawPoints();

        this.setState({inited: false});
    }

    _prepareGame() {
        const {points, population, mutationRate, players: playersCount} = this.state;

        const matrix = utils.convertToDistMatrix(points);
        const tourManager = new TourManager(matrix);
        const options = {
            evolveFirstStep: 10,
            evolvePerStep: 10,
            population,
            mutationRate
        };

        const players = new Array(playersCount).fill(0).map(() => {
            const start = utils.randomInt(0, points.length - 1);
            return new Player(tourManager, Object.assign(options, {start}));
        });

        return new Game(tourManager, players);
    }

    render() {
        return (
            <div className="container p-0" id="app">
                <Header title="Multiple TSP"/>
                <div className="row">
                    <div className="col-auto">
                        <GraphCanvas ref={this.canvas} width={800} height={600} points={this.state.points}/>
                    </div>
                    <div className="col d-flex align-items-start flex-column">
                        {
                            this.state.inited ? this.renderAlgoInfo() : this.renderOptions()
                        }
                        <div className="row mt-auto w-100">
                            <div className="col p-0 text-center">
                                <button
                                    className="btn btn-sm m-1"
                                    onClick={() => this.state.inited ? this.onNext() : this.onStart()}>
                                    {this.state.inited ? 'Next' : 'Start'}
                                </button>
                                {
                                    this.state.inited ?
                                        <button className="btn btn-sm m-1" onClick={this.onReset}>Reset</button> :
                                        undefined
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderAlgoInfo() {
        return (
            <React.Fragment>
                {this.renderOptionsInfo()}
                <hr style={{width: '100%'}} />
            </React.Fragment>
        );
    }

    renderOptionsInfo() {
        const {points, players, population, mutationRate} = this.state;

        return (
            <OptionsInfo points={points.length} players={players} population={population} mutationRate={mutationRate}/>
        );
    }

    renderOptions() {
        const {points, players, population, mutationRate} = globalOptions;

        return (
            <React.Fragment>
                <div className="row">
                    <PointsGroup
                        points={points.values}
                        defaultValue={this.state.points ? this.state.points.length : points.defaultValue}
                        onChange={this.onPointsChanged} />
                </div>
                <div className="row w-100">
                    <Slider
                        name={players.name}
                        defaultValue={this.state.players}
                        min={players.min}
                        max={players.max}
                        onChange={this.onPlayersChanged} />
                </div>
                <div className="row w-100">
                    <Slider
                        name={population.name}
                        defaultValue={this.state.population}
                        min={population.min}
                        max={population.max}
                        onChange={this.onPopulationChanged} />
                </div>
                <div className="row w-100">
                    <Slider
                        name={mutationRate.name}
                        defaultValue={this.state.mutationRate}
                        min={mutationRate.min}
                        max={mutationRate.max}
                        step={mutationRate.step}
                        onChange={this.onMutationRateChanged} />
                </div>
            </React.Fragment>
        );
    }
}
