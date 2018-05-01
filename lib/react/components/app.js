'use strict';

import React from 'react';
import Header from './header';
import GraphCanvas from './graph-canvas';
import PointsGroup from './points-group';
import ElitismCheckbox from './elitism-checkbox';
import Slider from './slider';
import Select from './select';
import Statistics from './statistics';
import OptionsInfo from './options-info';

import utils from '../modules/utils';
import globalOptions from '../modules/globalOptions';
import Preferences from '../modules/preferences';
import TourManager from '../../genetic/tour/tour-manager';
import TspGenetic from '../../genetic';
import SelectionFactory from '../../genetic/selection-factory';
import CrossoverFactory from '../../genetic/crossover-factory';
import MutationFactory from '../../genetic/mutation-factory';

export default class App extends React.Component {
    constructor() {
        super();
        this.onPointsChanged = this.onPointsChanged.bind(this);
        this.onElitismChanged = this.onElitismChanged.bind(this);
        this.onPopulationChanged = this.onPopulationChanged.bind(this);
        this.onMutationRateChanged = this.onMutationRateChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onCrossoverChanged = this.onCrossoverChanged.bind(this);
        this.onMutationChanged = this.onMutationChanged.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onReset = this.onReset.bind(this);

        const {points} = globalOptions;
        this.state = {
            points: Preferences.getPoints() || this._generatePoints(points.defaultValue),
            elitism: Preferences.getElitism(),
            population: Preferences.getPopulation(),
            mutationRate: Preferences.getMutationRate(),
            selection: Preferences.getSelection(),
            crossover: Preferences.getCrossover(),
            mutation: Preferences.getMutation(),
            inited: false,
            running: false
        };

        this.canvas = React.createRef();
        this.statistics = React.createRef();
    }

    _generatePoints(size) {
        const points = utils.generatePoints(size, 5, 800 - 5, 5, 600 - 5);
        Preferences.setPoints(points);
        return points;
    }

    onPointsChanged(size) {
        this.onReset();
        this.setState({points: this._generatePoints(size)});
    }

    onElitismChanged(elitism) {
        Preferences.setElitism(elitism);
        this.setState({elitism});
    }

    onPopulationChanged(population) {
        Preferences.setPopulation(population);
        this.setState({population});
    }

    onMutationRateChanged(mutationRate) {
        Preferences.setMutationRate(mutationRate);
        this.setState({mutationRate});
    }

    onSelectionChanged(selection) {
        Preferences.setSelection(selection);
        this.setState({selection});
    }

    onCrossoverChanged(crossover) {
        Preferences.setCrossover(crossover);
        this.setState({crossover});
    }

    onMutationChanged(mutation) {
        Preferences.setMutation(mutation);
        this.setState({mutation});
    }

    onStart() {
        if (!this._tsp) {
            this._tsp = this._prepareTsp();
        }

        let bestTour = null;
        const next = () => {
            this._tsp.evolve();
            const tour = this._tsp.getBestTour();

            if (bestTour !== tour) { //optimize drawing
                bestTour = tour;
                this.canvas.current.drawPath(this.state.points, tour.getPath());
            }

            this.statistics.current.update(this._tsp);
            this._tspLoopId = setTimeout(next, 0);
        };
        setTimeout(next, 0);

        this.setState({inited: true, running: true});
    }

    onStop() {
        clearInterval(this._tspLoopId);
        this._tspLoopId = null;

        this.setState({running: false});
    }

    onReset() {
        this.onStop();
        this.setState({inited: false});

        this._tsp = null;
        this.canvas.current.drawPoints(this.state.points);
    }

    _prepareTsp() {
        const {points, elitism, mutationRate, population: populationSize, selection, crossover, mutation} = this.state;

        const matrix = utils.convertToDistMatrix(points);
        const tourManager = new TourManager(matrix);
        const tsp = new TspGenetic(tourManager, {elitism, mutationRate, populationSize});
        tsp.setSelection(SelectionFactory.create(selection));
        tsp.setCrossover(CrossoverFactory.create(crossover));
        tsp.setMutation(MutationFactory.create(mutation));

        return tsp;
    }

    render() {
        return (
            <div className="container p-0" id="app">
                <Header/>
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
                                    onClick={() => this.state.running ? this.onStop() : this.onStart()}>
                                    {this.state.running ? 'Stop' : 'Start'}
                                </button>
                                <button className="btn btn-sm m-1" onClick={this.onReset}>Reset</button>
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
                <Statistics ref={this.statistics} />
            </React.Fragment>
        );
    }

    renderOptionsInfo() {
        const {points, elitism, population, mutationRate} = this.state;
        const selection = this._findAlgoName('selection', this.state.selection);
        const crossover = this._findAlgoName('crossover', this.state.crossover);
        const mutation = this._findAlgoName('mutation', this.state.mutation);

        return (
            <OptionsInfo points={points.length} elitism={elitism} population={population}
                selection={selection} crossover={crossover} mutation={mutation} mutationRate={mutationRate}/>
        );
    }

    _findAlgoName(algo, value) {
        const options = globalOptions[algo].options;
        for (let option of options) {
            if (option.value === value) {
                return option.text;
            }
        }
    }

    renderOptions() {
        const {population, mutationRate, selection, crossover, mutation, points} = globalOptions;

        return (
            <React.Fragment>
                <div className="row">
                    <PointsGroup
                        points={points.values}
                        defaultValue={this.state.points ? this.state.points.length : points.defaultValue}
                        onChange={this.onPointsChanged} />
                </div>
                <div className="row">
                    <ElitismCheckbox defaultValue={this.state.elitism} onChange={this.onElitismChanged}/>
                </div>
                <div className="row w-100">
                    <Slider
                        name={population.name}
                        defaultValue={this.state.population}
                        min={population.min}
                        max={population.max}
                        onChange={this.onPopulationChanged} />
                </div>
                <div className="row">
                    <Select
                        name={selection.name}
                        options={selection.options}
                        defaultValue={this.state.selection}
                        onChange={this.onSelectionChanged} />
                </div>
                <div className="row">
                    <Select
                        name={crossover.name}
                        options={crossover.options}
                        defaultValue={this.state.crossover}
                        onChange={this.onCrossoverChanged} />
                </div>
                <div className="row">
                    <Select
                        name={mutation.name}
                        options={mutation.options}
                        defaultValue={this.state.mutation}
                        onChange={this.onMutationChanged} />
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
