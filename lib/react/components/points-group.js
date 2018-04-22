'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class PointsGroup extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this._points = [50, 100, 150, 200, 500, 1000];
    }

    render() {
        const points = this._points.map((value) => {
            return (
                <label className="form-check-label col" key={value}>
                    <input
                        type="radio"
                        className="form-check-input"
                        value={value}
                        name="points"
                        onChange={(e) => this.props.onChange(e.target.value)}
                    />
                    {value}
                </label>
            );
        });

        return (
            <fieldset className="form-group">
                <legend>Points</legend>
                <div className="row m-0">
                    {points}
                </div>
            </fieldset>
        );
    }
}
