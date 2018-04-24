'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../utils';

export default class GraphCanvas extends React.Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        points: PropTypes.arrayOf(PropTypes.shape({x: PropTypes.number, y: PropTypes.number}))
    };

    constructor() {
        super();
        this.canvas = null;
        this._style = {
            border: '1px solid black',
            borderRadius: 20
        };
    }

    render() {
        const {width, height} = this.props;

        return (
            <canvas
                width={width}
                height={height}
                style={this._style}
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

    shouldComponentUpdate(nextProps) {
        return !utils.arrayEqual(this.props.points, nextProps.points);
    }

    _update() {
        if (this.props.points) {
            this.drawPoints();
        }
    }

    drawPoints() {
        this.clear();
        const context = this.canvas.getContext('2d');
        context.fillStyle = 'black';

        for (let point of this.props.points) {
            this._drawPoint(point.x, point.y);
        }
    }

    drawPath(points, path) {
        this.clear();
        this.drawPoints(points);
        this._drawPath(rearrangePath(points, path));
    }

    clear() {
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.props.width, this.props.height);
    }

    _drawPoint(x, y) {
        const context = this.canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();
    }

    _drawPath(points) {
        const context = this.canvas.getContext('2d');
        context.strokeStyle = 'red';
        context.lineWidth = 1;

        context.beginPath();
        const last = points[points.length - 1];
        context.moveTo(last.x, last.y);
        for (let point of points) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
    }
}

function rearrangePath(points, path) {
    let newPoints = new Array(path.length);
    for (let i = 0; i < path.length; i++) {
        newPoints[i] = points[path[i]];
    }
    return newPoints;
}
