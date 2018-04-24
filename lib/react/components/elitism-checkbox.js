'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class ElitismCheckbox extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        defaultValue: PropTypes.bool
    };

    componentWillMount() {
        this.input = React.createRef();
    }

    componentDidMount() {
        this.input.current.checked = this.props.defaultValue;
    }

    render() {
        return (
            <div>
                <legend>Settings</legend>
                <div className="form-group">
                    <label className="form-check-label col">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            ref={this.input}
                            onChange={(e) => this.props.onChange(e.target.value)}/>
                            Elitism
                    </label>
                </div>
            </div>
        );
    }
}
