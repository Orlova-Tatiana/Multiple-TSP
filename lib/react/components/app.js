'use strict';

import React from 'react';
import Header from './header';
import GraphCanvas from './graph-canvas';
import PointsGroup from './points-group';
import ElitismCheckbox from './elitism-checkbox';
import Slider from './slider';

import utils from '../modules/utils';

export default class App extends React.Component {
    constructor() {
        super();
        this.onPointsChanged = this.onPointsChanged.bind(this);
        this.onElitismChanged = this.onElitismChanged.bind(this);
        this.onPopulationChanged = this.onPopulationChanged.bind(this);
        this.onMutationRateChanged = this.onMutationRateChanged.bind(this);

        this.state = {
            points: null,
            elitism: false,
            population: 30
        };
    }

    onPointsChanged(size) {
        this.setState({
            points: utils.generatePoints(size, 5, 800 - 5, 5, 600 - 5)
        });
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

    render() {
        let {points} = this.state;

        return (
            <div className="container p-0" id="app">
                <Header/>
                <div className="row">
                    <div className="col-auto">
                        <GraphCanvas width={800} height={600} points={points}/>
                    </div>
                    <div className="col d-flex align-items-start flex-column">
                        <div className="row">
                            <PointsGroup onChange={this.onPointsChanged}/>
                        </div>
                        <div className="row">
                            <ElitismCheckbox defaultValue={true} onChange={this.onElitismChanged}/>
                        </div>
                        <div className="row w-100">
                            <Slider name={'Population'} defaultValue={30} min={10} max={200} onChange={this.onPopulationChanged}/>
                        </div>
                        <div className="row w-100">
                            <Slider name={'Mutation rate'} defaultValue={0.015} min={0} max={1} step={0.005} onChange={this.onMutationRateChanged}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
