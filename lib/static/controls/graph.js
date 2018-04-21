'use strict';

module.exports = class GraphDrawer {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
    }

    drawPoints(points) {
        this.clear();
        this._drawPoints(points);
    }

    drawPath(points, path) {
        this.clear();
        this.drawPoints(points);
        this._drawPath(rearrangePath(points, path));
    }

    clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    _drawPoints(points) {
        this._context.fillStyle = 'black';

        for (let point of points) {
            this._drawPoint(point.x, point.y);
        }
    }

    _drawPoint(x, y) {
        this._context.beginPath();
        this._context.arc(x, y, 3, 0, 2 * Math.PI, false);
        this._context.fillStyle = 'black';
        this._context.fill();
        this._context.closePath();
    }

    _drawPath(points) {
        this._context.strokeStyle = 'red';
        this._context.lineWidth = 1;

        this._context.beginPath();
        const last = points[points.length - 1];
        this._context.moveTo(last.x, last.y);
        for (let point of points) {
            this._context.lineTo(point.x, point.y);
        }
        this._context.stroke();
    }
};

function rearrangePath(points, path) {
    let newPoints = new Array(path.length);
    for (let i = 0; i < path.length; i++) {
        newPoints[i] = points[path[i]];
    }
    return newPoints;
}
