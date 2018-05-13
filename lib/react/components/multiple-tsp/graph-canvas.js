'use strict';

import GraphCanvas from '../base-graph-canvas';
import globalOptions from '../../modules/global-options/multiple-tsp';

export default class MultipleTspGraphCanvas extends GraphCanvas {
    constructor() {
        super();
        this._prevPoints = null;
    }

    setGame(game) {
        this._prevPoints = new Array(game.playersCount);

        game.on('init', ({index, vertex}) => {
            const {x, y} = this.props.points[vertex];
            const color = globalOptions.players.colors[index];

            this._prevPoints[index] = {x, y};
            this._drawPoint(x, y, color);
        });

        game.on('turn', ({index, current, next}) => {
            const prev = this._prevPoints[index];
            current = this.props.points[current];
            next = this.props.points[next];
            const color = globalOptions.players.colors[index];

            if (prev !== current) {
                this._drawLine(prev, current, color);
            }

            this._prevPoints[index] = current;
            this._drawPoint(next.x, next.y, color);
        });

        game.on('result', ({index, tour}) => {
            const prev = this._prevPoints[index];
            const current = this.props.points[tour.lastVertex];
            const next = this.props.points[tour.getVertex(0)];
            const color = globalOptions.players.colors[index];

            this._drawLine(prev, current, color);
            this._drawLine(current, next, color);
        });
    }

    _drawLine(from, to, color) {
        const context = this.canvas.getContext('2d');
        context.strokeStyle = color;
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
    }
}
