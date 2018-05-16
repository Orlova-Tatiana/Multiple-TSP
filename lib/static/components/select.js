'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class Select extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape(
                {value: PropTypes.string, text: PropTypes.string}
            )
        ).isRequired,
        onChange: PropTypes.func.isRequired,
        defaultValue: PropTypes.string
    };

    render() {
        const {name, options, onChange, defaultValue} = this.props;

        const selectOptions = options.map(({value, text}) => {
            return (
                <option value={value} key={value}>
                    {text}
                </option>
            );
        });

        return (
            <div className="form-group">
                <legend>{name}</legend>
                <select
                    defaultValue={defaultValue}
                    className="form-control"
                    onChange={(e) => onChange(e.target.value)} >
                    {selectOptions}
                </select>
            </div>
        );
    }
}
