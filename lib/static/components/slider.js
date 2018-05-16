'use strict';

import $ from 'jquery';
import '../../../resources/slider/rangeslider.css';
import '../../../resources/slider/rangeslider.min.js';

import React from 'react';
import PropTypes from 'prop-types';

export default class Slider extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        defaultValue: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number,
        onChange: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.setState({
            value: this.props.defaultValue
        });
        this.input = React.createRef();
    }

    componentDidMount() {
        $(() => {
            $(this.input.current).rangeslider({
                polyfill: false,
                onSlide: (pos, value) => this.handleOnChange(value)
            });
        });
    }

    componentWillUnmount() {
        $(this.input.current).rangeslider('destroy');
    }

    handleOnChange(value) {
        this.setState({value});
        this.props.onChange(value);
    }

    render() {
        const {name, min, max, step} = this.props;
        const {value} = this.state;
        const boldStyle = {fontWeight: 'bolder'};

        return (
            <div className="form-group w-100">
                <label>{name}</label>
                <span style={boldStyle}>=</span>
                <span style={boldStyle}>{value}</span>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step ? step : 1}
                    defaultValue={value}
                    ref={this.input} />
            </div>
        );
    }
}
