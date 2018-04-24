'use strict';

import React from 'react';
import Header from './header';
import GraphCanvas from './graph-canvas';
import PointsGroup from './points-group';
import ElitismCheckbox from './elitism-checkbox';
import Slider from './slider';
import Select from './select';

import utils from '../modules/utils';
import globalOptions from '../modules/globalOptions';
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

        const {elitism, population, mutationRate, selection, crossover, mutation, points} = globalOptions;
        this.state = {
            points: this._generatePoints(points.defaultValue),
            elitism,
            population: population.value,
            mutationRate: mutationRate.value,
            selection: selection.value,
            crossover: crossover.value,
            mutation: mutation.value,
            started: false
        };

        this.canvas = React.createRef();
    }

    _generatePoints(size) {
        return utils.generatePoints(size, 5, 800 - 5, 5, 600 - 5);
    }

    onPointsChanged(size) {
        this.setState({points: this._generatePoints(size)});
    }

    onElitismChanged(elitism) {
        this.setState({elitism});
    }

    onPopulationChanged(population) {
        this.setState({population});
    }

    onMutationRateChanged(mutationRate) {
        this.setState({mutationRate});
    }

    onSelectionChanged(selection) {
        this.setState({selection});
    }

    onCrossoverChanged(crossover) {
        this.setState({crossover});
    }

    onMutationChanged(mutation) {
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

            this._tspLoopId = setTimeout(next, 0);
        };
        next();

        this.setState({started: true});
    }

    onStop() {
        clearInterval(this._tspLoopId);
        this._tspLoopId = null;

        this.setState({started: false});
    }

    onReset() {
        this.onStop();
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
        const {elitism, population, mutationRate, selection, crossover, mutation, points} = globalOptions;

        return (
            <div className="container p-0" id="app">
                <Header/>
                <div className="row">
                    <div className="col-auto">
                        <GraphCanvas ref={this.canvas} width={800} height={600} points={this.state.points}/>
                    </div>
                    <div className="col d-flex align-items-start flex-column">
                        <div className="row">
                            <PointsGroup
                                points={points.values}
                                defaultValue={points.defaultValue}
                                onChange={this.onPointsChanged} />
                        </div>
                        <div className="row">
                            <ElitismCheckbox defaultValue={elitism} onChange={this.onElitismChanged}/>
                        </div>
                        <div className="row w-100">
                            <Slider
                                name={population.name}
                                defaultValue={population.value}
                                min={population.min}
                                max={population.max}
                                onChange={this.onPopulationChanged} />
                        </div>
                        <div className="row">
                            <Select
                                name={selection.name}
                                options={selection.options}
                                defaultValue={selection.value}
                                onChange={this.onSelectionChanged} />
                        </div>
                        <div className="row">
                            <Select
                                name={crossover.name}
                                options={crossover.options}
                                defaultValue={crossover.value}
                                onChange={this.onCrossoverChanged} />
                        </div>
                        <div className="row">
                            <Select
                                name={mutation.name}
                                options={mutation.options}
                                defaultValue={mutation.value}
                                onChange={this.onMutationChanged} />
                        </div>
                        <div className="row w-100">
                            <Slider
                                name={mutationRate.name}
                                defaultValue={mutationRate.value}
                                min={mutationRate.min}
                                max={mutationRate.max}
                                step={mutationRate.step}
                                onChange={this.onMutationRateChanged} />
                        </div>
                        <div className="row mt-auto w-100">
                            <div className="col p-0 text-center">
                                <button
                                    className="btn btn-sm m-1"
                                    onClick={() => this.state.started ? this.onStop() : this.onStart()}>
                                    {this.state.started ? 'Stop' : 'Start'}
                                </button>
                                <button className="btn btn-sm m-1" onClick={this.onReset}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
