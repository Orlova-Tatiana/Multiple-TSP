'use strict';

module.exports = class PlayerEmitter {
    constructor(players) {
        this._players = players;
        this._queue = [];
    }

    postpone(player, vertex) {
        this._queue.push({player, vertex});
    }

    notify(player, vertex) {
        this._queue.forEach(({player, vertex}) => this._notify(player, vertex));
        this._queue = [];

        if (player) {
            this._notify(player, vertex);
        }
    }

    _notify(sender, vertex) {
        this._players.forEach((player) => {
            if (player !== sender) {
                player.onVertexChoose(vertex);
            }
        });
    }
};
