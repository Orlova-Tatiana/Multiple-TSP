'use strict';

import GraphCanvas from '../base-graph-canvas';

export default class OneTspGraphCanvas extends GraphCanvas {
    drawPath(path) {
        this.clear();
        this.drawPoints();
        this._drawPath(this._rearrangeByPath(path));
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

    _rearrangeByPath(path) {
        let newPoints = new Array(path.length);
        for (let i = 0; i < path.length; i++) {
            newPoints[i] = this.props.points[path[i]];
        }
        return newPoints;
    }
}
