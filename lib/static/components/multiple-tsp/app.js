'use strict';

import React from 'react';
import Header from '../header';
import GraphCanvas from './graph-canvas';
import PointsGroup from '../points-group';
import Slider from '../slider';
import OptionsInfo from '../options-info';
import Statistics from './statistics';
import utils from '../../modules/utils';
import globalOptions from '../../modules/multiple-tsp/global-options';
import Preferences from '../../modules/multiple-tsp/preferences';

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
        this.onEvolveFirstStepChanged = this.onEvolveFirstStepChanged.bind(this);
        this.onEvolvePerStepChanged = this.onEvolvePerStepChanged.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNext = this.onNext.bind(this);

        const {points} = globalOptions;
        this.state = {
            points: Preferences.getPoints() || this._generatePoints(points.defaultValue),
            players: Preferences.getPlayers(),
            population: Preferences.getPopulation(),
            mutationRate: Preferences.getMutationRate(),
            evolveFirstStep: Preferences.getEvolveFirstStep(),
            evolvePerStep: Preferences.getEvolvePerStep(),
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

    onEvolveFirstStepChanged(count) {
        Preferences.setEvolveFirstStep(count);
        this.setState({evolveFirstStep: count});
    }

    onEvolvePerStepChanged(count) {
        Preferences.setEvolvePerStep(count);
        this.setState({evolvePerStep: count});
    }

    onStart() {
        this._game = this._prepareGame();
        this.canvas.current.setGame(this._game);

        this.setState({inited: true});
    }

    onNext() {
        if (!this._game.isInited) {
            this._game.init();
            return;
        }

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
        const {points, population, mutationRate, players: playersCount, evolvePerStep, evolveFirstStep} = this.state;

        const matrix = utils.convertToDistMatrix(points);
        const tourManager = new TourManager(matrix);
        const options = {
            evolveFirstStep,
            evolvePerStep,
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
                <Header title="TSP: игры коммивояжеров"/>
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
                <Statistics game={this._game}/>
            </React.Fragment>
        );
    }

    renderOptionsInfo() {
        const {points, players, population, mutationRate, evolveFirstStep, evolvePerStep} = this.state;

        return (
            <OptionsInfo globalOptions={globalOptions} points={points.length} players={players} population={population}
                mutationRate={mutationRate} evolvePerStep={evolvePerStep} evolveFirstStep={evolveFirstStep}/>
        );
    }

    renderOptions() {
        const {points} = globalOptions;

        return (
            <React.Fragment>
                <div className="row">
                    <PointsGroup
                        points={points.values}
                        defaultValue={this.state.points ? this.state.points.length : points.defaultValue}
                        onChange={this.onPointsChanged} />
                </div>
                <div className="row w-100">
                    {this._createSlider('players', this.onPlayersChanged)}
                </div>
                <div className="row w-100">
                    {this._createSlider('population', this.onPopulationChanged)}
                </div>
                <div className="row w-100">
                    {this._createSlider('mutationRate', this.onMutationRateChanged)}
                </div>
                <div className="row w-100">
                    {this._createSlider('evolveFirstStep', this.onEvolveFirstStepChanged)}
                </div>
                <div className="row w-100">
                    {this._createSlider('evolvePerStep', this.onEvolvePerStepChanged)}
                </div>
            </React.Fragment>
        );
    }

    _createSlider(name, callback) {
        const option = globalOptions[name];
        const value = this.state[name];

        return <Slider name={option.name} defaultValue={value} min={option.min} max={option.max} step={option.step} onChange={callback}/>;
    }
}
