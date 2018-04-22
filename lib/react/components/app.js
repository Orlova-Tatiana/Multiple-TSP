'use strict';

import React from 'react';
import Header from './header';
import GraphCanvas from './graph-canvas';
import PointsGroup from './points-group';

import utils from '../modules/utils';

export default class App extends React.Component {
    constructor() {
        super();
        this.onPointsChanged = this.onPointsChanged.bind(this);

        this.state = {
            points: null
        };
    }

    onPointsChanged(size) {
        this.setState({
            points: utils.generatePoints(size, 5, 800 - 5, 5, 600 - 5)
        });
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
                    </div>
                </div>
            </div>
        );
    }
}
