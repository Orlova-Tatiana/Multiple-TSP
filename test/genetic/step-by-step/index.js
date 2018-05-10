'use strict';

const Tester = require('./tester');

test();

function test() {
    const tester = new Tester('mutation', {
        points: 200,
        repeat: 5
    });
    tester.test();
}
