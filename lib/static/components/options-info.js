'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class OptionsInfo extends React.Component {
    static propTypes = {
        globalOptions: PropTypes.object.isRequired,
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

            const name = this._getName(prop);
            return (
                <div className="row" key={prop}>
                    <label>
                        <b>{name}</b> = {String(this.props[prop])}
                    </label>
                </div>
            );
        });
    }

    _getName(prop) {
        switch (prop) {
            case 'points':
                return 'Точки';
            case 'elitism':
                return 'Элитизм';
            default:
                return this.props.globalOptions[prop].name;
        }
    }
}
