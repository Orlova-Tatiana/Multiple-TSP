'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class OptionsInfo extends React.Component {
    static propTypes = {
        points: PropTypes.number.isRequired,
        elitism: PropTypes.bool.isRequired,
        population: PropTypes.number.isRequired,
        selection: PropTypes.string.isRequired,
        crossover: PropTypes.string.isRequired,
        mutation: PropTypes.string.isRequired,
        mutationRate: PropTypes.number.isRequired
    };

    constructor() {
        super();
        this._propNames = ['points', 'elitism', 'population', 'selection', 'crossover', 'mutation', 'mutationRate'];
    }

    render() {
        return this._propNames.map((prop) => {
            const name = prop
                .replace(/[A-Z]/g, (sym) => ` ${sym.toLowerCase()}`)
                .replace(/^./, (sym) => sym.toUpperCase());
            return (
                <div className="row" key={prop}>
                    <label>
                        <b>{name}</b> = {String(this.props[prop])}
                    </label>
                </div>
            );
        });
    }
}
