'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class OptionsInfo extends React.Component {
    static propTypes = {
        points: PropTypes.number.isRequired,
        players: PropTypes.number,
        elitism: PropTypes.bool,
        population: PropTypes.number.isRequired,
        selection: PropTypes.string,
        crossover: PropTypes.string,
        mutation: PropTypes.string,
        mutationRate: PropTypes.number.isRequired,
        evolveFirstStep: PropTypes.number,
        evolvePerStep: PropTypes.number
    };

    constructor() {
        super();
        this._propNames = ['points', 'players', 'elitism', 'population', 'selection', 'crossover', 'mutation', 'mutationRate', 'evolveFirstStep', 'evolvePerStep'];
    }

    render() {
        return this._propNames.map((prop) => {
            if (!this.props.hasOwnProperty(prop)) {
                return undefined;
            }

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
