'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class GraphCanvas extends React.Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        points: PropTypes.arrayOf(PropTypes.shape({x: PropTypes.number, y: PropTypes.number}))
    };

    constructor() {
        super();
        this.canvas = null;
    }

    render() {
        const {width, height} = this.props;
        const style = {
            border: '1px solid black',
            borderRadius: 20
        };

        return (
            <canvas
                id="canvas"
                width={width}
                height={height}
                style={style}
                ref={(canvas) => this.canvas = canvas}>
            </canvas>
        );
    }

    componentDidMount() {
        this._update();
    }

    componentDidUpdate() {
        this._update();
    }

    _update() {
        if (this.props.points) {
            this._drawPoints();
        }
    }

    _drawPoints() {
        this._clear();
        const context = this.canvas.getContext('2d');
        context.fillStyle = 'black';

        for (let point of this.props.points) {
            this._drawPoint(point.x, point.y);
        }
    }

    _drawPoint(x, y) {
        const context = this.canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();
    }

    _clear() {
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.props.width, this.props.height);
    }
}
