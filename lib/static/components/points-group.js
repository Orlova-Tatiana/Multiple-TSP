'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class PointsGroup extends React.Component {
    static propTypes = {
        points: PropTypes.arrayOf(PropTypes.number).isRequired,
        defaultValue: PropTypes.number,
        onChange: PropTypes.func.isRequired
    };

    render() {
        const points = this.props.points.map((value) => {
            return (
                <label className="form-check-label col" key={value}>
                    <input
                        type="radio"
                        className="form-check-input"
                        value={value}
                        name="points"
                        defaultChecked={value === this.props.defaultValue}
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
